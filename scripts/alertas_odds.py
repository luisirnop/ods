#!/usr/bin/env python3
"""
OddsBR — Monitor de alertas de odds
Roda a cada 10 minutos via cron no VPS.
Verifica mudanças de odds e notifica usuários via Telegram.

Configurar no VPS (cron -e):
  */10 * * * * cd /srv/oddsbr/scripts && python alertas_odds.py >> logs/alertas.log 2>&1
  0 0 * * *   cd /srv/oddsbr/scripts && python alertas_odds.py --reset >> logs/alertas.log 2>&1

Dependências: pip install -r requirements.txt

.env necessário:
  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
  THE_ODDS_API_KEY, TELEGRAM_BOT_TOKEN,
  NEXT_PUBLIC_SITE_URL
"""

import os
import sys
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
ODDS_API_KEY = os.environ["THE_ODDS_API_KEY"]
TELEGRAM_TOKEN = os.environ["TELEGRAM_BOT_TOKEN"]
SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://oddsbr.com.br")
FREE_DAILY_LIMIT = 3

SPORTS = [
    "soccer_brazil_campeonato",
    "soccer_brazil_campeonato_b",
    "soccer_brazil_copa_do_brasil",
    "soccer_conmebol_copa_libertadores",
]

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# ─── Odds API ─────────────────────────────────────────────────────────────────

def fetch_odds(sport: str) -> list[dict]:
    url = f"https://api.the-odds-api.com/v4/sports/{sport}/odds"
    resp = requests.get(
        url,
        params={
            "apiKey": ODDS_API_KEY,
            "regions": "br,eu",
            "markets": "h2h,totals",
            "oddsFormat": "decimal",
        },
        timeout=15,
    )
    resp.raise_for_status()
    remaining = resp.headers.get("x-requests-remaining", "?")
    log.info(f"[{sport}] {len(resp.json())} jogos | {remaining} req restantes")
    return resp.json()


def save_snapshots(games: list[dict]) -> None:
    now = datetime.now(timezone.utc).isoformat()
    rows = []

    for game in games:
        for bk in game.get("bookmakers", []):
            row: dict = {
                "game_id": game["id"],
                "home_team": game["home_team"],
                "away_team": game["away_team"],
                "league": game.get("sport_title", ""),
                "game_date": game["commence_time"],
                "bookmaker": bk["key"],
                "market": "h2h",
                "captured_at": now,
            }
            for market in bk.get("markets", []):
                if market["key"] == "h2h":
                    for o in market["outcomes"]:
                        if o["name"] == game["home_team"]:
                            row["home_odd"] = o["price"]
                        elif o["name"] == game["away_team"]:
                            row["away_odd"] = o["price"]
                        else:
                            row["draw_odd"] = o["price"]
                elif market["key"] == "totals":
                    row["market"] = "totals"
                    for o in market["outcomes"]:
                        if o["name"] == "Over":
                            row["over_25_odd"] = o["price"]
                        elif o["name"] == "Under":
                            row["under_25_odd"] = o["price"]
            rows.append(row)

    if rows:
        supabase.table("odds_snapshots").insert(rows).execute()
        log.info(f"Salvou {len(rows)} snapshots")


# ─── Telegram ─────────────────────────────────────────────────────────────────

def send_telegram(chat_id: int, text: str) -> bool:
    try:
        resp = requests.post(
            f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
            json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"},
            timeout=10,
        )
        return resp.ok
    except Exception as e:
        log.error(f"Erro Telegram: {e}")
        return False


def format_alert(home: str, away: str, team: str, old_odd: float, new_odd: float, bk_title: str) -> str:
    change = ((new_odd - old_odd) / old_odd) * 100
    icon = "📈" if change > 0 else "📉"
    return (
        f"{icon} <b>Alerta de Odd — {team}</b>\n\n"
        f"Jogo: {home} × {away}\n"
        f"Casa: {bk_title}\n"
        f"Anterior: {old_odd:.2f} → Atual: <b>{new_odd:.2f}</b>\n"
        f"Variação: {change:+.1f}%\n\n"
        f'<a href="{SITE_URL}/odds">Ver comparador →</a>'
    )


# ─── Alertas ──────────────────────────────────────────────────────────────────

def get_prev_snapshot(game_id: str, bk_key: str) -> dict | None:
    one_hour_ago = (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat()
    result = (
        supabase.table("odds_snapshots")
        .select("home_odd, draw_odd, away_odd, over_25_odd, under_25_odd, home_team, away_team")
        .eq("game_id", game_id)
        .eq("bookmaker", bk_key)
        .gte("captured_at", one_hour_ago)
        .order("captured_at", desc=False)
        .limit(1)
        .execute()
    )
    rows = result.data or []
    return rows[0] if rows else None


def check_and_fire_alerts(games: list[dict]) -> None:
    # Buscar todos os alertas ativos
    result = (
        supabase.table("odds_alerts")
        .select("id, user_id, team_name, league, bookmaker, market, threshold, alerts_sent_today")
        .eq("is_active", True)
        .execute()
    )
    alerts = result.data or []
    if not alerts:
        return

    # Buscar perfis com Telegram conectado
    user_ids = list({a["user_id"] for a in alerts})
    profiles_res = (
        supabase.table("profiles")
        .select("id, telegram_chat_id, is_premium")
        .in_("id", user_ids)
        .not_.is_("telegram_chat_id", None)
        .execute()
    )
    profiles = {p["id"]: p for p in (profiles_res.data or [])}

    now_iso = datetime.now(timezone.utc).isoformat()

    for alert in alerts:
        profile = profiles.get(alert["user_id"])
        if not profile:
            continue

        chat_id = profile["telegram_chat_id"]
        is_premium = profile.get("is_premium", False)
        sent_today = alert.get("alerts_sent_today", 0)

        if not is_premium and sent_today >= FREE_DAILY_LIMIT:
            continue

        alert_team = (alert.get("team_name") or "").lower()
        alert_league = (alert.get("league") or "").lower()
        alert_bk = alert.get("bookmaker") or None
        threshold = float(alert.get("threshold") or 0.10)

        for game in games:
            home = game["home_team"]
            away = game["away_team"]
            league = game.get("sport_title", "")

            if alert_league and alert_league not in league.lower():
                continue
            if alert_team and alert_team not in home.lower() and alert_team not in away.lower():
                continue

            for bk in game.get("bookmakers", []):
                if alert_bk and bk["key"] != alert_bk:
                    continue

                prev = get_prev_snapshot(game["id"], bk["key"])
                if not prev:
                    continue

                for market in bk.get("markets", []):
                    if market["key"] == "h2h":
                        for outcome in market["outcomes"]:
                            name = outcome["name"]
                            if alert_team and alert_team not in name.lower():
                                continue
                            new_odd = outcome["price"]
                            if name == home:
                                old_odd = prev.get("home_odd")
                            elif name == away:
                                old_odd = prev.get("away_odd")
                            else:
                                old_odd = prev.get("draw_odd")

                            if old_odd and abs(new_odd - old_odd) >= threshold:
                                text = format_alert(home, away, name, old_odd, new_odd, bk["title"])
                                if send_telegram(chat_id, text):
                                    sent_today += 1
                                    supabase.table("odds_alerts").update({
                                        "alerts_sent_today": sent_today,
                                        "last_alert_at": now_iso,
                                    }).eq("id", alert["id"]).execute()
                                    log.info(f"Alerta: {name} | {bk['title']} | {old_odd:.2f}→{new_odd:.2f} → chat {chat_id}")

                                if not is_premium and sent_today >= FREE_DAILY_LIMIT:
                                    break


# ─── Reset diário (0h via cron) ───────────────────────────────────────────────

def reset_daily_counters() -> None:
    supabase.table("odds_alerts").update({"alerts_sent_today": 0}).neq(
        "alerts_sent_today", 0
    ).execute()
    log.info("Contadores diários zerados.")


# ─── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    if "--reset" in sys.argv:
        reset_daily_counters()
        return

    all_games: list[dict] = []
    for sport in SPORTS:
        try:
            games = fetch_odds(sport)
            all_games.extend(games)
        except Exception as e:
            log.error(f"Erro ao buscar odds [{sport}]: {e}")

    if not all_games:
        log.warning("Nenhum jogo encontrado.")
        return

    save_snapshots(all_games)
    check_and_fire_alerts(all_games)
    log.info("Verificação concluída.")


if __name__ == "__main__":
    main()
