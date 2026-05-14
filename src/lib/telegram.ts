const TELEGRAM_API = 'https://api.telegram.org/bot'

export const TIMES_BRASILEIROS = [
  'Flamengo', 'Palmeiras', 'Corinthians', 'São Paulo', 'Grêmio',
  'Internacional', 'Atlético-MG', 'Cruzeiro', 'Fluminense', 'Botafogo',
  'Santos', 'Vasco', 'Bahia', 'Athletico-PR', 'Fortaleza',
]

function getToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN não configurado')
  return token
}

type InlineButton = { text: string; callback_data: string }
type InlineKeyboard = InlineButton[][]

async function telegramRequest(method: string, body: object) {
  const res = await fetch(`${TELEGRAM_API}${getToken()}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Telegram ${method} error: ${err}`)
  }
  return res.json()
}

export async function sendMessage(
  chatId: number,
  text: string,
  parseMode: 'HTML' | 'Markdown' = 'HTML'
) {
  return telegramRequest('sendMessage', { chat_id: chatId, text, parse_mode: parseMode })
}

export async function sendMessageWithKeyboard(
  chatId: number,
  text: string,
  keyboard: InlineKeyboard
) {
  return telegramRequest('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: { inline_keyboard: keyboard },
  })
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  return telegramRequest('answerCallbackQuery', { callback_query_id: callbackQueryId, text })
}

export async function editMessageText(chatId: number, messageId: number, text: string) {
  return telegramRequest('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: 'HTML',
  })
}

export async function setWebhook(url: string, secretToken?: string) {
  return telegramRequest('setWebhook', { url, secret_token: secretToken })
}

export async function deleteWebhook() {
  return telegramRequest('deleteWebhook', {})
}

export function getTimesKeyboard(): InlineKeyboard {
  const buttons = TIMES_BRASILEIROS.map((t) => ({ text: t, callback_data: `set_time:${t}` }))
  const rows: InlineKeyboard = []
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2))
  }
  return rows
}

// ─── Message templates ───────────────────────────────────────────────────────

export function msgStart(firstName: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oddsbr.com.br'
  return [
    `Olá, <b>${firstName}</b>! Bem-vindo ao OddsBR Bot 🎯`,
    '',
    'Compare odds e acompanhe palpites do futebol brasileiro.',
    '',
    '<b>Comandos disponíveis:</b>',
    '/conectar [email] — vincular conta',
    '/status — ver minha conta',
    '/times — configurar time favorito',
    '/desconectar — desconectar conta',
    '',
    `<a href="${siteUrl}">Acessar OddsBR →</a>`,
  ].join('\n')
}

export function msgConnected(displayName: string): string {
  return [
    `✅ Conta <b>${displayName}</b> conectada com sucesso!`,
    '',
    'Você receberá alertas de odds aqui.',
    'Use /times para configurar seu time favorito.',
  ].join('\n')
}

export function msgStatus(
  displayName: string,
  favoriteTeam: string | null
): string {
  return [
    '✅ <b>Conta conectada</b>',
    '',
    `Nome: ${displayName}`,
    `Time favorito: ${favoriteTeam ?? 'não configurado — use /times'}`,
  ].join('\n')
}

export function msgTimesMenu(currentTeam: string | null): string {
  const current = currentTeam ? `\nAtual: <b>${currentTeam}</b>` : ''
  return `⚽ <b>Selecione seu time favorito</b>${current}\n\nEscolha um time abaixo:`
}

export function msgTeamSet(team: string): string {
  return `✅ Time favorito definido: <b>${team}</b>\n\nVocê receberá alertas quando houver mudanças de odds para jogos desse time.`
}

export function msgDisconnected(): string {
  return '✅ Conta desconectada. Você não receberá mais alertas.\n\nUse /conectar para reconectar.'
}

export function msgNotConnected(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oddsbr.com.br'
  return `❌ Conta não conectada.\n\nUse /conectar [email] com o email cadastrado em <a href="${siteUrl}">${siteUrl}</a>`
}

export function formatOddsAlert(
  teamName: string,
  oldOdd: number,
  newOdd: number,
  bookmaker: string
): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oddsbr.com.br'
  const change = ((newOdd - oldOdd) / oldOdd) * 100
  const direction = change > 0 ? '📈' : '📉'
  return [
    `${direction} <b>Alerta de Odd — ${teamName}</b>`,
    '',
    `Casa: ${bookmaker}`,
    `Anterior: ${oldOdd.toFixed(2)}`,
    `Atual: <b>${newOdd.toFixed(2)}</b>`,
    `Variação: ${change > 0 ? '+' : ''}${change.toFixed(1)}%`,
    '',
    `<a href="${siteUrl}/odds">Ver comparador →</a>`,
  ].join('\n')
}
