"""
email_sequencia.py — Sequência de emails de boas-vindas
Cron: diário às 10h
  0 10 * * * cd /srv/oddsbr/scripts && python email_sequencia.py >> logs/email.log 2>&1

Envia:
  - Dia 3: email sobre calculadora de Kelly
  - Dia 7: email sobre ranking e quiz
Apenas para usuários não-premium registrados há exatamente N dias.
"""

import logging
import os
from datetime import date, timedelta

import requests
from dotenv import load_dotenv
from supabase import create_client

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

load_dotenv()

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
RESEND_FROM = os.environ.get("RESEND_FROM_EMAIL", "OddsBR <noreply@oddsbr.com.br>")
SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://oddsbr.com.br")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def send_email(to: str, subject: str, html: str) -> bool:
    if not RESEND_API_KEY:
        log.warning("RESEND_API_KEY não configurado — email ignorado")
        return False
    resp = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        json={"from": RESEND_FROM, "to": to, "subject": subject, "html": html},
        timeout=10,
    )
    if resp.status_code >= 400:
        log.error(f"Erro ao enviar para {to}: {resp.status_code} {resp.text}")
        return False
    return True


def get_profiles_from_n_days_ago(n: int) -> list[dict]:
    """Perfis criados exatamente N dias atrás, não-premium."""
    target = date.today() - timedelta(days=n)
    start = f"{target.isoformat()}T00:00:00+00:00"
    end = f"{target.isoformat()}T23:59:59+00:00"
    result = (
        supabase.table("profiles")
        .select("id, display_name")
        .gte("created_at", start)
        .lte("created_at", end)
        .eq("is_premium", False)
        .execute()
    )
    return result.data or []


def get_user_email(user_id: str) -> str | None:
    try:
        resp = supabase.auth.admin.get_user_by_id(user_id)
        return resp.user.email if resp and resp.user else None
    except Exception as e:
        log.warning(f"Não conseguiu email de {user_id}: {e}")
        return None


def send_day3(name: str, email: str):
    return send_email(
        to=email,
        subject="⚡ Já calculou o tamanho ideal das suas apostas?",
        html=f"""
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111827">
          <h2 style="color:#16a34a">Olá, {name}!</h2>
          <p>Você sabia que existe uma fórmula matemática para calcular o tamanho ideal de cada aposta?</p>
          <p>O <strong>Critério de Kelly</strong> usa a odds e a sua estimativa de probabilidade para indicar
          quanto da sua banca apostar — maximizando o crescimento e reduzindo o risco de ruína.</p>
          <p>Criamos uma calculadora gratuita para você:</p>
          <p>
            <a href="{SITE_URL}/calculadora"
               style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;
                      border-radius:8px;text-decoration:none;font-weight:700">
              Abrir calculadora de Kelly →
            </a>
          </p>
          <p style="color:#6b7280;font-size:12px;margin-top:24px">
            Apostas esportivas envolvem risco financeiro. +18. Jogue com responsabilidade.
          </p>
        </div>
        """,
    )


def send_day7(name: str, email: str):
    return send_email(
        to=email,
        subject="🏆 Como está o seu ranking no OddsBR?",
        html=f"""
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111827">
          <h2 style="color:#16a34a">Uma semana de OddsBR, {name}!</h2>
          <p>Os melhores tipsters da semana estão subindo no ranking — e você pode estar entre eles.</p>
          <p><strong>Como ganhar mais pontos:</strong></p>
          <ul>
            <li>✅ Faça palpites nos jogos do dia</li>
            <li>🧠 Responda o quiz diário (+2 pts por acerto)</li>
            <li>🔥 Mantenha uma sequência de acertos</li>
          </ul>
          <div style="display:flex;gap:12px;margin-top:20px;flex-wrap:wrap">
            <a href="{SITE_URL}/ranking"
               style="display:inline-block;background:#16a34a;color:#fff;padding:10px 20px;
                      border-radius:8px;text-decoration:none;font-weight:700">
              Ver ranking →
            </a>
            <a href="{SITE_URL}/quiz"
               style="display:inline-block;background:#f3f4f6;color:#111827;padding:10px 20px;
                      border-radius:8px;text-decoration:none;font-weight:600">
              Quiz do dia →
            </a>
          </div>
          <p style="color:#6b7280;font-size:12px;margin-top:24px">
            Apostas esportivas envolvem risco financeiro. +18.
          </p>
        </div>
        """,
    )


def main():
    day3_profiles = get_profiles_from_n_days_ago(3)
    day7_profiles = get_profiles_from_n_days_ago(7)

    log.info(f"Day-3: {len(day3_profiles)} usuário(s)")
    log.info(f"Day-7: {len(day7_profiles)} usuário(s)")

    sent = 0
    for profile in day3_profiles:
        email = get_user_email(profile["id"])
        if not email:
            continue
        name = profile.get("display_name") or "Usuário"
        if send_day3(name, email):
            log.info(f"Day-3 enviado → {email}")
            sent += 1

    for profile in day7_profiles:
        email = get_user_email(profile["id"])
        if not email:
            continue
        name = profile.get("display_name") or "Usuário"
        if send_day7(name, email):
            log.info(f"Day-7 enviado → {email}")
            sent += 1

    log.info(f"Total enviados: {sent}")


if __name__ == "__main__":
    main()
