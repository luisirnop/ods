"""
Script: gerar_conteudo.py
Roda via cron às 6h todo dia no VPS.
Busca jogos do dia via API-Football → Gemini gera artigos → publica via API interna.
"""

import os
import json
import re
import requests
from datetime import date
from dotenv import load_dotenv

load_dotenv()

API_FOOTBALL_KEY = os.getenv("API_FOOTBALL_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SITE_URL = os.getenv("SITE_URL", "http://localhost:3000")
INTERNAL_TOKEN = os.getenv("INTERNAL_API_TOKEN")

LEAGUES_TO_COVER = [71, 72, 13, 11, 2]  # Brasileirão A, B, Copa Brasil, Libertadores, Champions


def get_fixtures_today():
    today = date.today().isoformat()
    url = "https://api-football-v1.p.rapidapi.com/v3/fixtures"
    headers = {
        "X-RapidAPI-Key": API_FOOTBALL_KEY,
        "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    }
    resp = requests.get(url, headers=headers, params={"date": today})
    resp.raise_for_status()
    fixtures = resp.json().get("response", [])
    return [f for f in fixtures if f["league"]["id"] in LEAGUES_TO_COVER]


def generate_article(fixture: dict) -> str:
    home = fixture["teams"]["home"]["name"]
    away = fixture["teams"]["away"]["name"]
    league = fixture["league"]["name"]
    game_date = fixture["fixture"]["date"]

    prompt = f"""Você é analista esportivo do OddsBR. Escreva um artigo de palpite em português brasileiro (600-800 palavras) para o jogo:

{home} x {away} — {league} ({game_date})

O artigo deve incluir:
1. Contexto da partida e momento dos times
2. Análise de desempenho recente (últimos 5 jogos)
3. Prováveis escalações e desfalques
4. Mercados sugeridos para apostar (1x2, Over/Under, BTTS)
5. Palpite final fundamentado

Regras obrigatórias:
- Linguagem: "aposte com estratégia", nunca "ganhe dinheiro garantido"
- Tag [Gerado por IA] no início do artigo
- Tom profissional e acessível para apostadores brasileiros
- Não inventar estatísticas — usar linguagem condicional quando incerto
"""

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
    resp = requests.post(
        url,
        params={"key": GEMINI_API_KEY},
        json={"contents": [{"parts": [{"text": prompt}]}]},
    )
    resp.raise_for_status()
    return resp.json()["candidates"][0]["content"]["parts"][0]["text"]


def make_slug(home: str, away: str, league: str, game_date: str) -> str:
    def slugify(s):
        s = s.lower().replace(" ", "-")
        return re.sub(r"[^a-z0-9-]", "", s)

    date_str = game_date[:10]
    return f"{slugify(home)}-x-{slugify(away)}-{slugify(league)}-{date_str}"


def publish_article(fixture: dict, content: str):
    home = fixture["teams"]["home"]["name"]
    away = fixture["teams"]["away"]["name"]
    league = fixture["league"]["name"]
    game_date = fixture["fixture"]["date"]
    slug = make_slug(home, away, league, game_date)

    payload = {
        "slug": slug,
        "title": f"Palpite {home} x {away} — {league}",
        "meta_description": f"Análise e palpite para {home} x {away} pela {league}. Compare odds e aposte com estratégia.",
        "content": content,
        "game_id": str(fixture["fixture"]["id"]),
        "home_team": home,
        "away_team": away,
        "league": league,
        "game_date": game_date[:10],
        "article_type": "prediction",
    }

    resp = requests.post(
        f"{SITE_URL}/api/internal/articles",
        json=payload,
        headers={"x-internal-token": INTERNAL_TOKEN},
    )
    resp.raise_for_status()
    print(f"✅ Publicado: {slug}")


if __name__ == "__main__":
    print("Buscando jogos do dia...")
    fixtures = get_fixtures_today()
    print(f"Jogos encontrados: {len(fixtures)}")

    for fixture in fixtures[:10]:  # Limitar a 10 por dia para economizar cota
        home = fixture["teams"]["home"]["name"]
        away = fixture["teams"]["away"]["name"]
        print(f"Gerando artigo: {home} x {away}...")
        try:
            content = generate_article(fixture)
            publish_article(fixture, content)
        except Exception as e:
            print(f"❌ Erro: {e}")
