#!/usr/bin/env python3
"""
OddsBR — Pipeline de geração de artigos com IA
Roda às 6h via cron no VPS.
Fluxo: API-Football → Gemini → POST /api/internal/articles

Configurar no VPS (cron -e):
  0 6 * * * cd /srv/oddsbr/scripts && python gerar_conteudo.py >> logs/conteudo.log 2>&1

.env necessário:
  API_FOOTBALL_KEY, GEMINI_API_KEY,
  NEXT_PUBLIC_SITE_URL, INTERNAL_API_TOKEN
"""

import os
import json
import re
import logging
from datetime import date

import requests
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)

API_FOOTBALL_KEY = os.environ["API_FOOTBALL_KEY"]
GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]
SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://oddsbr.com.br")
INTERNAL_TOKEN = os.environ["INTERNAL_API_TOKEN"]

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-1.5-flash:generateContent"
)

# Brasileirão A, B, Copa Brasil, Libertadores, Champions
LEAGUES_TO_COVER = [71, 72, 13, 11, 2]
MAX_ARTICLES_PER_RUN = 10


def make_slug(home: str, away: str, league: str, game_date: str) -> str:
    def slugify(s: str) -> str:
        s = s.lower().replace(" ", "-")
        s = re.sub(r"[áàãâä]", "a", s)
        s = re.sub(r"[éèêë]", "e", s)
        s = re.sub(r"[íìîï]", "i", s)
        s = re.sub(r"[óòõôö]", "o", s)
        s = re.sub(r"[úùûü]", "u", s)
        s = re.sub(r"[ç]", "c", s)
        return re.sub(r"[^a-z0-9-]", "", s)

    date_str = game_date[:10]
    return f"{slugify(home)}-x-{slugify(away)}-{slugify(league)}-{date_str}"


def get_fixtures_today() -> list[dict]:
    today = date.today().isoformat()
    url = "https://api-football-v1.p.rapidapi.com/v3/fixtures"
    headers = {
        "X-RapidAPI-Key": API_FOOTBALL_KEY,
        "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    }
    resp = requests.get(url, headers=headers, params={"date": today}, timeout=15)
    resp.raise_for_status()
    fixtures = resp.json().get("response", [])
    filtered = [f for f in fixtures if f["league"]["id"] in LEAGUES_TO_COVER]
    log.info(f"API-Football: {len(fixtures)} jogos hoje, {len(filtered)} nas ligas cobertas")
    return filtered


def article_exists(slug: str) -> bool:
    resp = requests.get(
        f"{SITE_URL}/api/internal/articles/{slug}",
        headers={"x-internal-token": INTERNAL_TOKEN},
        timeout=10,
    )
    return resp.status_code == 200


def generate_article_content(fixture: dict) -> str:
    home = fixture["teams"]["home"]["name"]
    away = fixture["teams"]["away"]["name"]
    league = fixture["league"]["name"]
    game_date = fixture["fixture"]["date"]

    prompt = f"""Você é analista esportivo do OddsBR. Escreva um artigo de análise e palpite em português brasileiro (600-800 palavras) para:

{home} × {away} — {league} ({game_date[:10]})

Estrutura obrigatória:
## Contexto da Partida
## Momento dos Times
## Palpites e Mercados Recomendados
## Conclusão

Regras:
- Comece com a linha: [Gerado por IA]
- Use linguagem: "aposte com estratégia", "compare as odds", nunca "ganhe dinheiro garantido"
- Mencione pelo menos 2 mercados (1X2, Over/Under, BTTS)
- Se não tiver dados recentes exatos, use linguagem condicional ("historicamente", "costuma", "tende a")
- Tom profissional e acessível para apostadores brasileiros

Responda APENAS com o texto do artigo, sem JSON ou formatação extra.
"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.8,
            "maxOutputTokens": 1500,
        },
    }
    resp = requests.post(
        GEMINI_URL,
        params={"key": GEMINI_API_KEY},
        json=payload,
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["candidates"][0]["content"]["parts"][0]["text"]


def publish_article(fixture: dict, content: str) -> str:
    home = fixture["teams"]["home"]["name"]
    away = fixture["teams"]["away"]["name"]
    league = fixture["league"]["name"]
    game_date = fixture["fixture"]["date"]
    slug = make_slug(home, away, league, game_date)

    payload = {
        "slug": slug,
        "title": f"Palpite {home} × {away} — {league}",
        "meta_description": (
            f"Análise e palpite para {home} × {away} pela {league}. "
            "Compare odds e aposte com estratégia."
        ),
        "content": content,
        "game_id": str(fixture["fixture"]["id"]),
        "home_team": home,
        "away_team": away,
        "league": league,
        "game_date": game_date[:10],
        "article_type": "prediction",
        "generated_by": "gemini-1.5-flash",
    }

    resp = requests.post(
        f"{SITE_URL}/api/internal/articles",
        json=payload,
        headers={"x-internal-token": INTERNAL_TOKEN},
        timeout=15,
    )
    resp.raise_for_status()
    log.info(f"Publicado: {slug}")
    return slug


def main() -> None:
    log.info("Iniciando pipeline de geração de artigos...")

    try:
        fixtures = get_fixtures_today()
    except Exception as e:
        log.error(f"Erro ao buscar jogos: {e}")
        return

    if not fixtures:
        log.info("Nenhum jogo nas ligas cobertas hoje.")
        return

    published = 0
    skipped = 0
    errors = 0

    for fixture in fixtures[:MAX_ARTICLES_PER_RUN]:
        home = fixture["teams"]["home"]["name"]
        away = fixture["teams"]["away"]["name"]
        league = fixture["league"]["name"]
        game_date = fixture["fixture"]["date"]
        slug = make_slug(home, away, league, game_date)

        log.info(f"Processando: {home} × {away} ({league})")

        # Idempotência: pula se já existe (upsert no backend também protege)
        try:
            content = generate_article_content(fixture)
            publish_article(fixture, content)
            published += 1
        except requests.HTTPError as e:
            log.error(f"HTTP {e.response.status_code} para {slug}: {e.response.text[:200]}")
            errors += 1
        except Exception as e:
            log.error(f"Erro para {slug}: {e}")
            errors += 1

    log.info(
        f"Pipeline concluído: {published} publicados, {skipped} ignorados, {errors} erros"
    )


if __name__ == "__main__":
    main()
