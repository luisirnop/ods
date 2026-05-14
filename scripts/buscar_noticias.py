#!/usr/bin/env python3
"""
OddsBR — Scraping de notícias via RSS
Roda a cada 2h via cron no VPS.
Fluxo: RSS (Globo/ESPN/UOL) → filtra relevantes → Gemini sumariza → POST /api/internal/articles

Configurar no VPS (cron -e):
  0 */2 * * * cd /srv/oddsbr/scripts && python buscar_noticias.py >> logs/noticias.log 2>&1

.env necessário:
  GEMINI_API_KEY, NEXT_PUBLIC_SITE_URL, INTERNAL_API_TOKEN
"""

import os
import re
import hashlib
import logging
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime

import feedparser
import requests
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)

GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]
SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://oddsbr.com.br")
INTERNAL_TOKEN = os.environ["INTERNAL_API_TOKEN"]

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-1.5-flash:generateContent"
)

# RSS feeds das fontes
RSS_FEEDS = [
    {
        "name": "Globo Esporte",
        "url": "https://ge.globo.com/rss/ge.xml",
        "section": "futebol",
    },
    {
        "name": "ESPN Brasil",
        "url": "https://www.espn.com.br/espn/rss/futebol/noticias",
        "section": "futebol",
    },
    {
        "name": "UOL Esporte",
        "url": "https://esporte.uol.com.br/esporte/rss.xml",
        "section": "futebol",
    },
]

# Palavras-chave relevantes para apostas
KEYWORDS_RELEVANT = [
    "lesão", "lesionado", "contundido", "machucado",
    "suspensão", "suspenso", "cartão vermelho", "expulsão",
    "escalação", "time provável", "provável", "desfalque",
    "retorno", "convocação", "reforço", "baixa",
    "recuperação", "departamento médico",
    "vence", "venceu", "derrota", "empate", "goleada",
    "classificou", "eliminado",
]

# Palavras que excluem (não relevantes para apostas)
KEYWORDS_EXCLUDE = [
    "transferência mercado", "salário", "patrocínio",
    "ingresso", "bilheteria", "torcida", "fanático",
]

# Ligas/times brasileiros de interesse
TIMES_BRASILEIROS = [
    "flamengo", "palmeiras", "corinthians", "são paulo", "grêmio",
    "internacional", "atlético", "cruzeiro", "fluminense", "botafogo",
    "santos", "vasco", "bahia", "athletico", "fortaleza",
    "brasileirão", "série a", "série b", "copa do brasil", "libertadores",
]

MAX_NEWS_PER_RUN = 15
MAX_AGE_HOURS = 3  # Ignora notícias com mais de 3h (para não duplicar com runs anteriores)


def slugify(s: str) -> str:
    s = s.lower()
    for src, dst in [("á","a"),("à","a"),("ã","a"),("â","a"),("ä","a"),
                     ("é","e"),("è","e"),("ê","e"),("ë","e"),
                     ("í","i"),("ì","i"),("î","i"),("ï","i"),
                     ("ó","o"),("ò","o"),("õ","o"),("ô","o"),("ö","o"),
                     ("ú","u"),("ù","u"),("û","u"),("ü","u"),("ç","c")]:
        s = s.replace(src, dst)
    s = s.replace(" ", "-")
    return re.sub(r"[^a-z0-9-]", "", s)


def make_news_slug(title: str, source: str) -> str:
    title_slug = slugify(title)[:50].rstrip("-")
    source_slug = slugify(source)[:10]
    # Hash curto para garantir unicidade mesmo com títulos similares
    h = hashlib.md5(title.encode()).hexdigest()[:6]
    return f"{title_slug}-{source_slug}-{h}"


def is_relevant(title: str, summary: str) -> bool:
    text = (title + " " + summary).lower()

    # Deve mencionar time ou competição brasileira
    has_br_team = any(t in text for t in TIMES_BRASILEIROS)
    if not has_br_team:
        return False

    # Deve ter palavra-chave relevante para apostas
    has_keyword = any(k in text for k in KEYWORDS_RELEVANT)
    if not has_keyword:
        return False

    # Não deve ser sobre assuntos excluídos
    has_excluded = any(k in text for k in KEYWORDS_EXCLUDE)
    if has_excluded:
        return False

    return True


def parse_entry_date(entry: dict) -> datetime | None:
    for field in ("published", "updated"):
        raw = entry.get(f"{field}_parsed") or entry.get(field)
        if not raw:
            continue
        try:
            if isinstance(raw, str):
                return parsedate_to_datetime(raw).replace(tzinfo=timezone.utc)
            # feedparser returns time.struct_time
            import time as time_module
            ts = time_module.mktime(raw)
            return datetime.fromtimestamp(ts, tz=timezone.utc)
        except Exception:
            continue
    return None


def fetch_feed(feed_info: dict) -> list[dict]:
    log.info(f"Buscando feed: {feed_info['name']}")
    try:
        d = feedparser.parse(feed_info["url"])
        entries = d.get("entries", [])
        log.info(f"  {len(entries)} entradas encontradas")
        return entries
    except Exception as e:
        log.error(f"  Erro ao buscar {feed_info['name']}: {e}")
        return []


def summarize_with_gemini(title: str, source: str, content: str) -> str:
    # Trunca o conteúdo para não exceder tokens
    content_excerpt = content[:1200].strip()

    prompt = f"""Você é um jornalista esportivo do OddsBR. Baseado nesta notícia, escreva um resumo em português brasileiro (150-250 palavras) COM SUAS PRÓPRIAS PALAVRAS.

Título original: {title}
Fonte: {source}
Conteúdo: {content_excerpt}

Regras obrigatórias:
- Comece com: [Gerado por IA]
- Escreva com suas próprias palavras — NUNCA copie frases do original
- Destaque o impacto para apostadores (ex: lesão reduz chances do time, suspensão muda escalação)
- Linguagem direta e objetiva
- Use o contexto de apostas esportivas quando relevante

Responda APENAS com o texto do resumo, sem JSON ou marcações extras.
"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.6, "maxOutputTokens": 500},
    }
    resp = requests.post(
        GEMINI_URL,
        params={"key": GEMINI_API_KEY},
        json=payload,
        timeout=20,
    )
    resp.raise_for_status()
    return resp.json()["candidates"][0]["content"]["parts"][0]["text"]


def publish_news(slug: str, title: str, summary_ai: str, source: str, source_url: str) -> None:
    meta = f"{title} — Resumo e análise de impacto para apostas. Fonte: {source}."
    payload = {
        "slug": slug,
        "title": title,
        "meta_description": meta[:200],
        "content": summary_ai,
        "article_type": "news",
        "generated_by": "gemini-1.5-flash",
        "source_url": source_url,
    }
    resp = requests.post(
        f"{SITE_URL}/api/internal/articles",
        json=payload,
        headers={"x-internal-token": INTERNAL_TOKEN},
        timeout=15,
    )
    resp.raise_for_status()
    log.info(f"  Publicado: {slug}")


def main() -> None:
    log.info("Iniciando scraping de notícias...")
    cutoff = datetime.now(timezone.utc) - timedelta(hours=MAX_AGE_HOURS)

    candidates: list[dict] = []

    for feed_info in RSS_FEEDS:
        entries = fetch_feed(feed_info)
        for entry in entries:
            title = entry.get("title", "").strip()
            summary = entry.get("summary", "") or entry.get("description", "") or ""
            link = entry.get("link", "")
            pub_date = parse_entry_date(entry)

            if not title or not link:
                continue

            # Ignora notícias antigas
            if pub_date and pub_date < cutoff:
                continue

            if not is_relevant(title, summary):
                continue

            candidates.append({
                "title": title,
                "summary": summary,
                "link": link,
                "source": feed_info["name"],
                "pub_date": pub_date,
            })

    log.info(f"{len(candidates)} notícias relevantes encontradas")

    # Limita por run
    published = 0
    errors = 0

    for item in candidates[:MAX_NEWS_PER_RUN]:
        title = item["title"]
        source = item["source"]
        slug = make_news_slug(title, source)
        log.info(f"Processando: {title[:60]}...")

        try:
            content_for_gemini = item["summary"] or title
            summary_ai = summarize_with_gemini(title, source, content_for_gemini)
            publish_news(slug, title, summary_ai, source, item["link"])
            published += 1
        except requests.HTTPError as e:
            # 409/conflict = já existe → não é erro real
            if e.response.status_code in (409,):
                log.info(f"  Já existe: {slug}")
            else:
                log.error(f"  HTTP {e.response.status_code}: {e.response.text[:150]}")
                errors += 1
        except Exception as e:
            log.error(f"  Erro: {e}")
            errors += 1

    log.info(f"Concluído: {published} publicadas, {errors} erros")


if __name__ == "__main__":
    main()
