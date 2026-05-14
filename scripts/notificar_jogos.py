#!/usr/bin/env python3
"""
OddsBR — Notificador de jogos via browser push
Roda a cada 30 minutos via cron no VPS.
Notifica usuários cujo time favorito joga em ~2 horas.

Configurar no VPS (cron -e):
  */30 * * * * cd /srv/oddsbr/scripts && python notificar_jogos.py >> logs/push.log 2>&1

.env necessário:
  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_SITE_URL, INTERNAL_API_TOKEN
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
SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://oddsbr.com.br")
INTERNAL_TOKEN = os.environ["INTERNAL_API_TOKEN"]

NOTIFY_URL = f"{SITE_URL}/api/push/notify"

# Janela de notificação: jogos que começam entre 90 e 150 minutos a partir de agora
WINDOW_MIN_MINUTES = 90
WINDOW_MAX_MINUTES = 150

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_upcoming_games() -> list[dict]:
    now = datetime.now(timezone.utc)
    window_start = (now + timedelta(minutes=WINDOW_MIN_MINUTES)).isoformat()
    window_end = (now + timedelta(minutes=WINDOW_MAX_MINUTES)).isoformat()

    result = (
        supabase.table("odds_snapshots")
        .select("game_id, home_team, away_team, league, game_date")
        .gte("game_date", window_start)
        .lte("game_date", window_end)
        .execute()
    )
    rows = result.data or []

    # Deduplica por game_id
    seen: set[str] = set()
    games: list[dict] = []
    for row in rows:
        gid = row["game_id"]
        if gid not in seen:
            seen.add(gid)
            games.append(row)
    return games


def send_push_notification(subscriptions: list[dict], title: str, body: str, url: str) -> None:
    if not subscriptions:
        return
    try:
        resp = requests.post(
            NOTIFY_URL,
            json={"subscriptions": subscriptions, "title": title, "body": body, "url": url},
            headers={"Authorization": f"Bearer {INTERNAL_TOKEN}"},
            timeout=15,
        )
        if resp.ok:
            data = resp.json()
            log.info(f"Push enviado: {data.get('sent', 0)} ok, {data.get('failed', 0)} falhas")
        else:
            log.error(f"Erro ao enviar push: {resp.status_code} {resp.text[:200]}")
    except Exception as e:
        log.error(f"Erro na chamada push: {e}")


def main() -> None:
    log.info("Verificando jogos próximos para notificação push...")
    games = get_upcoming_games()

    if not games:
        log.info("Nenhum jogo na janela de notificação.")
        return

    log.info(f"{len(games)} jogo(s) encontrado(s) na janela.")

    # Busca todos os perfis com time favorito configurado
    profiles_res = (
        supabase.table("profiles")
        .select("id, favorite_team")
        .not_.is_("favorite_team", None)
        .execute()
    )
    profiles = profiles_res.data or []

    if not profiles:
        log.info("Nenhum usuário com time favorito configurado.")
        return

    # Monta mapa de time → usuários
    team_to_users: dict[str, list[str]] = {}
    for p in profiles:
        team = (p.get("favorite_team") or "").strip().lower()
        if team:
            team_to_users.setdefault(team, []).append(p["id"])

    notified_users: set[str] = set()

    for game in games:
        home = game["home_team"]
        away = game["away_team"]
        league = game.get("league") or ""

        game_dt = datetime.fromisoformat(game["game_date"].replace("Z", "+00:00"))
        game_dt_local = game_dt.astimezone(timezone(timedelta(hours=-3)))
        time_str = game_dt_local.strftime("%H:%M")

        for team_key, user_ids in team_to_users.items():
            if team_key not in home.lower() and team_key not in away.lower():
                continue

            # Filtra usuários ainda não notificados nesta execução
            targets = [uid for uid in user_ids if uid not in notified_users]
            if not targets:
                continue

            # Busca push subscriptions desses usuários
            subs_res = (
                supabase.table("push_subscriptions")
                .select("user_id, subscription")
                .in_("user_id", targets)
                .execute()
            )
            subs = subs_res.data or []
            if not subs:
                continue

            subscriptions = [s["subscription"] for s in subs]
            title = f"⚽ {home} × {away}"
            body = f"Começa às {time_str} — {league}. Confira as odds!"
            url = f"{SITE_URL}/odds"

            log.info(f"Notificando {len(subscriptions)} usuário(s) sobre {home} × {away}")
            send_push_notification(subscriptions, title, body, url)

            for s in subs:
                notified_users.add(s["user_id"])

    log.info(f"Notificação concluída. {len(notified_users)} usuário(s) notificado(s).")


if __name__ == "__main__":
    main()
