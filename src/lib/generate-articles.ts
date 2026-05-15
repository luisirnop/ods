import { GoogleGenerativeAI } from '@google/generative-ai'
import { revalidateTag } from 'next/cache'
import { getAdminClient } from '@/lib/supabase/admin'
import { getOdds, SPORTS, isSportKey, type SportKey } from '@/lib/odds-api'
import { LEAGUES_CONFIG } from '@/lib/leagues'

const MODEL = 'gemini-2.5-flash'
const MAX_GAMES = 5
const HOURS_AHEAD = 48

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90)
}

function extractJson(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
}

export interface GenerateResult {
  slug: string
  status: string
}

export async function generateArticlesForSport(
  sport: SportKey = SPORTS.BRASILEIRAO_A,
  leagueName?: string
): Promise<{ generated: number; total: number; results: GenerateResult[] }> {
  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey) throw new Error('GEMINI_API_KEY not configured')

  const leagueConfig = LEAGUES_CONFIG.find((l) => l.sportKey === sport)
  const league = leagueName ?? leagueConfig?.name ?? 'Brasileirão Série A'

  const allGames = await getOdds(sport).catch(() => [])
  if (allGames.length === 0) return { generated: 0, total: 0, results: [] }

  const cutoff = new Date(Date.now() + HOURS_AHEAD * 3_600_000)
  const upcoming = allGames
    .filter((g) => new Date(g.commence_time) <= cutoff)
    .slice(0, MAX_GAMES)

  if (upcoming.length === 0) return { generated: 0, total: 0, results: [] }

  const genAI = new GoogleGenerativeAI(geminiKey)
  const model = genAI.getGenerativeModel({ model: MODEL })
  const admin = getAdminClient()
  const results: GenerateResult[] = []

  for (const game of upcoming) {
    try {
      const h2hMarket = game.bookmakers.flatMap((b) => b.markets).find((m) => m.key === 'h2h')
      const homeOdd = h2hMarket?.outcomes.find((o) => o.name === game.home_team)?.price
      const drawOdd = h2hMarket?.outcomes.find((o) => o.name === 'Draw')?.price
      const awayOdd = h2hMarket?.outcomes.find((o) => o.name === game.away_team)?.price

      const oddsLine = homeOdd
        ? `Casa ${homeOdd.toFixed(2)} | Empate ${drawOdd?.toFixed(2) ?? '—'} | Visitante ${awayOdd?.toFixed(2) ?? '—'}`
        : 'Odds não disponíveis'

      const gameDate = new Date(game.commence_time).toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      })

      const prompt = `Você é um analista esportivo especializado em futebol. Escreva uma análise/palpite em português do Brasil para o seguinte jogo.

**Jogo:** ${game.home_team} x ${game.away_team}
**Campeonato:** ${league}
**Data:** ${gameDate}
**Odds:** ${oddsLine}

Escreva um artigo com análise tática, forma recente dos times e um palpite fundamentado (300-400 palavras).

Responda APENAS com JSON puro (sem markdown), neste formato exato:
{
  "title": "título chamativo do artigo",
  "meta_description": "resumo de 1-2 frases",
  "content": "conteúdo completo do artigo em markdown simples"
}`

      const result = await model.generateContent(prompt)
      const rawText = result.response.text()
      const parsed = JSON.parse(extractJson(rawText)) as {
        title: string
        meta_description: string
        content: string
      }

      const slug = `${slugify(game.home_team)}-x-${slugify(game.away_team)}-${game.commence_time.slice(0, 10)}`

      const { data, error } = await admin
        .from('articles')
        .upsert(
          {
            slug,
            title: parsed.title,
            meta_description: parsed.meta_description,
            content: `[Gerado por IA]\n\n${parsed.content}`,
            game_id: game.id,
            home_team: game.home_team,
            away_team: game.away_team,
            league,
            game_date: game.commence_time,
            article_type: 'prediction',
            generated_by: `gemini/${MODEL}`,
            published: true,
            published_at: new Date().toISOString(),
          },
          { onConflict: 'slug' }
        )
        .select('id, slug')
        .single()

      results.push(error ? { slug, status: `db_error: ${error.message}` } : { slug: data.slug, status: 'created' })
    } catch (err) {
      results.push({
        slug: `${game.home_team}-x-${game.away_team}`,
        status: `failed: ${String(err)}`,
      })
    }
  }

  revalidateTag('articles', 'max')

  return {
    generated: results.filter((r) => r.status === 'created').length,
    total: results.length,
    results,
  }
}

export { isSportKey, SPORTS }
