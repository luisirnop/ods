#!/usr/bin/env python3
"""
OddsBR — Gerador de quiz diário
Roda às 0h via cron no VPS.
Usa Gemini para gerar 5 perguntas sobre futebol brasileiro e apostas.

Configurar no VPS (cron -e):
  5 0 * * * cd /srv/oddsbr/scripts && python gerar_quiz.py >> logs/quiz.log 2>&1

.env necessário:
  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY
"""

import os
import json
import logging
import random
from datetime import date, datetime, timezone

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
GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-1.5-flash:generateContent"
)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

TEMAS = [
    "história do Brasileirão",
    "recordes do futebol brasileiro",
    "Copa do Brasil",
    "Copa Libertadores com times brasileiros",
    "artilheiros e goleiros históricos do futebol brasileiro",
    "estatísticas e curiosidades de apostas esportivas",
    "regras do futebol",
    "times campeões brasileiros",
    "jogadores que atuaram em clubes brasileiros",
    "estádios do futebol brasileiro",
]


PROMPT_TEMPLATE = """
Você é um especialista em futebol brasileiro e apostas esportivas.
Gere EXATAMENTE 5 perguntas de quiz sobre o tema: {tema}.

Regras:
- Cada pergunta deve ter EXATAMENTE 4 alternativas (options)
- A resposta correta (answer) deve ser uma das 4 alternativas, texto idêntico
- explanation: 1 frase curta explicando a resposta (máx 120 caracteres)
- Variar dificuldade: 2 fáceis, 2 médias, 1 difícil
- NÃO use markdown, NÃO adicione texto fora do JSON

Responda APENAS com JSON válido neste formato exato:
[
  {{
    "id": 1,
    "question": "Pergunta aqui?",
    "options": ["A", "B", "C", "D"],
    "answer": "A",
    "explanation": "Explicação breve."
  }},
  ...
]
"""


def generate_questions(tema: str) -> list[dict]:
    prompt = PROMPT_TEMPLATE.format(tema=tema)
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1024,
        },
    }
    resp = requests.post(
        GEMINI_URL,
        params={"key": GEMINI_API_KEY},
        json=payload,
        timeout=30,
    )
    resp.raise_for_status()
    data = resp.json()

    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
    raw_text = raw_text.strip()

    # Remove markdown code fences if present
    if raw_text.startswith("```"):
        lines = raw_text.splitlines()
        raw_text = "\n".join(
            line for line in lines if not line.strip().startswith("```")
        )

    questions: list[dict] = json.loads(raw_text)

    for i, q in enumerate(questions):
        q["id"] = i + 1
        assert q["answer"] in q["options"], f"Resposta '{q['answer']}' não está nas opções"

    return questions[:5]


def quiz_already_exists(today: str) -> bool:
    result = (
        supabase.table("daily_quiz")
        .select("id")
        .eq("quiz_date", today)
        .single()
        .execute()
    )
    return bool(result.data)


def save_quiz(today: str, questions: list[dict]) -> None:
    supabase.table("daily_quiz").insert(
        {"quiz_date": today, "questions": questions}
    ).execute()
    log.info(f"Quiz salvo para {today} com {len(questions)} perguntas.")


def main() -> None:
    today = date.today().isoformat()
    log.info(f"Gerando quiz para {today}...")

    if quiz_already_exists(today):
        log.info("Quiz já existe para hoje. Nada a fazer.")
        return

    tema = random.choice(TEMAS)
    log.info(f"Tema escolhido: {tema}")

    try:
        questions = generate_questions(tema)
        save_quiz(today, questions)
    except json.JSONDecodeError as e:
        log.error(f"JSON inválido retornado pelo Gemini: {e}")
        raise
    except Exception as e:
        log.error(f"Erro ao gerar quiz: {e}")
        raise


if __name__ == "__main__":
    main()
