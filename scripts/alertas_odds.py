"""
Script: alertas_odds.py
Roda via cron a cada 10 minutos no VPS.
Monitora mudanças de odds e dispara alertas pelo Telegram.
"""

import os
import requests
from datetime import datetime, date
from dotenv import load_dotenv

load_dotenv()

ODDS_API_KEY = os.getenv("THE_ODDS_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
THRESHOLD = 0.10  # Variação mínima para disparar alerta

headers_sb = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Content-Type": "application/json",
}


def get_current_odds(sport="soccer_brazil_campeonato"):
    url = f"https://api.the-odds-api.com/v4/sports/{sport}/odds"
    resp = requests.get(url, params={
        "apiKey": ODDS_API_KEY,
        "regions": "br,eu",
        "markets": "h2h",
        "oddsFormat": "decimal",
    })
    resp.raise_for_status()
    return resp.json()


def get_last_snapshots(game_id: str, bookmaker: str):
    url = f"{SUPABASE_URL}/rest/v1/odds_snapshots"
    params = {
        "select": "home_odd,draw_odd,away_odd,captured_at",
        "game_id": f"eq.{game_id}",
        "bookmaker": f"eq.{bookmaker}",
        "order": "captured_at.desc",
        "limit": "1",
    }
    resp = requests.get(url, headers=headers_sb, params=params)
    data = resp.json()
    return data[0] if data else None


def save_snapshot(game_id, home_team, away_team, league, game_date, bookmaker, market, h2h_odds):
    url = f"{SUPABASE_URL}/rest/v1/odds_snapshots"
    payload = {
        "game_id": game_id,
        "home_team": home_team,
        "away_team": away_team,
        "league": league,
        "game_date": game_date,
        "bookmaker": bookmaker,
        "market": market,
        "home_odd": h2h_odds.get("home"),
        "draw_odd": h2h_odds.get("draw"),
        "away_odd": h2h_odds.get("away"),
    }
    requests.post(url, headers=headers_sb, json=payload)


def get_active_alerts():
    url = f"{SUPABASE_URL}/rest/v1/odds_alerts"
    params = {"select": "*, profiles(telegram_chat_id, is_premium)", "is_active": "eq.true"}
    resp = requests.get(url, headers=headers_sb, params=params)
    return resp.json()


def send_telegram(chat_id: int, text: str):
    requests.post(
        f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
        json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"},
    )


def increment_alert_counter(alert_id: str):
    url = f"{SUPABASE_URL}/rest/v1/odds_alerts?id=eq.{alert_id}"
    requests.patch(url, headers=headers_sb, json={
        "alerts_sent_today": "alerts_sent_today + 1",
        "last_alert_at": datetime.utcnow().isoformat(),
    })


if __name__ == "__main__":
    print(f"[{datetime.now()}] Verificando odds...")
    games = get_current_odds()
    alerts = get_active_alerts()

    for game in games:
        for bookmaker in game.get("bookmakers", []):
            h2h_market = next((m for m in bookmaker["markets"] if m["key"] == "h2h"), None)
            if not h2h_market:
                continue

            odds = {}
            for o in h2h_market["outcomes"]:
                if o["name"] == game["home_team"]:
                    odds["home"] = o["price"]
                elif o["name"] == game["away_team"]:
                    odds["away"] = o["price"]
                else:
                    odds["draw"] = o["price"]

            last = get_last_snapshots(game["id"], bookmaker["key"])
            save_snapshot(
                game["id"], game["home_team"], game["away_team"],
                game.get("sport_title", ""), game["commence_time"][:10],
                bookmaker["key"], "h2h", odds
            )

            if not last:
                continue

            # Verificar variação
            for side, key in [("home", "home_odd"), ("away", "away_odd"), ("draw", "draw_odd")]:
                new_odd = odds.get(side)
                old_odd = last.get(key)
                if not new_odd or not old_odd:
                    continue

                change = abs(new_odd - old_odd)
                if change < THRESHOLD:
                    continue

                # Disparar alertas configurados pelos usuários
                for alert in alerts:
                    profile = alert.get("profiles", {})
                    chat_id = profile.get("telegram_chat_id")
                    is_premium = profile.get("is_premium", False)
                    sent_today = alert.get("alerts_sent_today", 0)

                    if not chat_id:
                        continue
                    if not is_premium and sent_today >= 3:
                        continue

                    team_filter = alert.get("team_name")
                    if team_filter and team_filter.lower() not in [game["home_team"].lower(), game["away_team"].lower()]:
                        continue

                    direction = "📈" if new_odd > old_odd else "📉"
                    text = (
                        f"{direction} <b>Alerta de Odd</b>\n\n"
                        f"{game['home_team']} x {game['away_team']}\n"
                        f"Casa: {bookmaker['title']} | Mercado: {side}\n"
                        f"Odd: {old_odd:.2f} → <b>{new_odd:.2f}</b> ({'+' if new_odd > old_odd else ''}{change:.2f})"
                    )
                    send_telegram(chat_id, text)
                    increment_alert_counter(alert["id"])

    print("Verificação concluída.")
