#!/usr/bin/env python3
"""
OddsBR — Post diário no canal Telegram
Roda às 8h via cron no VPS.
Publica os palpites mais confiantes do dia no canal público.

Configurar no VPS (cron -e):
  0 8 * * * cd /srv/oddsbr/scripts && python canal_telegram.py >> logs/canal.log 2>&1

.env necessário:
  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
  TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID,
  NEXT_PUBLIC_SITE_URL
"""

import os
import logging
from datetime import datetime, timezone, timedelta

import requests
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
TELEGRAM_TOKEN = os.environ["TELEGRAM_BOT_TOKEN"]
TELEGRAM_CHANNEL_ID = os.environ["TELEGRAM_CHANNEL_ID"]
SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://oddsbr.com.br")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

MARKET_LABELS: dict[str, str] = {
    "h2h": "1X2",
    "totals": "Over/Under",
    "btts": "Ambos Marcam",
    "double_chance": "Dupla Chance",
    "exact_score": "Placar Exato",
}

CONFIDENCE_LABELS: dict[int, str] = {
    1: "Baixa",
    2: "Média",
    3: "Alta",
    4: "Muito Alta",
    5: "Máxima",
}


def fetch_top_predictions(limit: int = 10) -> list[dict]:
    today_start = datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    today_end = today_start + timedelta(days=1)

    result = (
        supabase.table("predictions")
        .select(
            "id, market, prediction, confidence, notes, "
            "home_team, away_team, league, game_date, "
            "profiles!inner(username, points_total)"
        )
        .eq("result", "pending")
        .gte("game_date", today_start.isoformat())
        .lt("game_date", today_end.isoformat())
        .order("confidence", desc=True)
        .order("profiles.points_total", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data or []


def format_prediction_label(market: str, prediction: str, home: str, away: str) -> str:
    if market == "h2h":
        if prediction == "1":
            return home
        if prediction == "2":
            return away
        if prediction == "X":
            return "Empate"
    if market == "btts":
        return "Sim" if prediction == "yes" else "Não"
    if market == "totals":
        return f"Over 2.5" if prediction == "over" else "Under 2.5"
    return prediction


def build_channel_message(predictions: list[dict]) -> str:
    today = datetime.now(timezone.utc)
    date_str = today.strftime("%d/%m/%Y")

    lines = [
        f"🏆 <b>Palpites do Dia — {date_str}</b>",
        "",
        "Os melhores palpites dos nossos tipsters para hoje:",
        "",
    ]

    for i, p in enumerate(predictions, start=1):
        home = p["home_team"]
        away = p["away_team"]
        league = p.get("league") or ""
        market = p.get("market") or "h2h"
        prediction = p.get("prediction") or ""
        confidence = int(p.get("confidence") or 3)
        tipster = p.get("profiles", {}).get("username") or "anônimo"

        label = format_prediction_label(market, prediction, home, away)
        market_name = MARKET_LABELS.get(market, market)
        conf_label = CONFIDENCE_LABELS.get(confidence, "Alta")
        stars = "⭐" * confidence

        game_dt = p.get("game_date")
        time_str = ""
        if game_dt:
            try:
                dt = datetime.fromisoformat(game_dt.replace("Z", "+00:00"))
                dt_local = dt.astimezone(timezone(timedelta(hours=-3)))
                time_str = f" ({dt_local.strftime('%H:%M')})"
            except Exception:
                pass

        lines += [
            f"<b>{i}. {home} × {away}</b>{time_str}",
            f"   📋 {league}" if league else "",
            f"   🎯 {market_name}: <b>{label}</b>",
            f"   {stars} Confiança: {conf_label}",
            f"   👤 @{tipster}",
            "",
        ]

    lines += [
        "─────────────────────────",
        f'🔗 <a href="{SITE_URL}/palpites">Ver todos os palpites →</a>',
        f'📊 <a href="{SITE_URL}/odds">Comparar odds →</a>',
        "",
        "<i>Entre no grupo para discutir as apostas!</i>",
    ]

    return "\n".join(line for line in lines if line is not None)


def send_channel_message(text: str) -> bool:
    try:
        resp = requests.post(
            f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
            json={
                "chat_id": TELEGRAM_CHANNEL_ID,
                "text": text,
                "parse_mode": "HTML",
                "disable_web_page_preview": True,
            },
            timeout=15,
        )
        if not resp.ok:
            log.error(f"Telegram erro {resp.status_code}: {resp.text}")
        return resp.ok
    except Exception as e:
        log.error(f"Erro ao enviar mensagem: {e}")
        return False


def post_no_games_message() -> None:
    today = datetime.now(timezone.utc)
    date_str = today.strftime("%d/%m/%Y")
    text = (
        f"📅 <b>OddsBR — {date_str}</b>\n\n"
        "Nenhum palpite registrado para hoje ainda.\n\n"
        f'🔗 <a href="{SITE_URL}/palpites">Adicione seus palpites →</a>'
    )
    send_channel_message(text)


def main() -> None:
    log.info("Iniciando post diário no canal Telegram...")
    predictions = fetch_top_predictions(limit=10)

    if not predictions:
        log.info("Nenhum palpite para hoje. Enviando mensagem padrão.")
        post_no_games_message()
        return

    log.info(f"Encontrados {len(predictions)} palpites. Construindo mensagem...")
    text = build_channel_message(predictions)
    ok = send_channel_message(text)

    if ok:
        log.info("Post diário enviado com sucesso.")
    else:
        log.error("Falha ao enviar post diário.")


if __name__ == "__main__":
    main()
