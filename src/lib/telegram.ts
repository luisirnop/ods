const TELEGRAM_API = 'https://api.telegram.org/bot'

function getToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN não configurado')
  return token
}

export async function sendMessage(chatId: number, text: string, parseMode: 'HTML' | 'Markdown' = 'HTML') {
  const response = await fetch(`${TELEGRAM_API}${getToken()}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Telegram API error: ${error}`)
  }

  return response.json()
}

export async function setWebhook(url: string) {
  const response = await fetch(`${TELEGRAM_API}${getToken()}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })

  return response.json()
}

export function formatOddsAlert(teamName: string, oldOdd: number, newOdd: number, bookmaker: string): string {
  const change = ((newOdd - oldOdd) / oldOdd) * 100
  const direction = change > 0 ? '📈' : '📉'
  return `${direction} <b>Alerta de Odd — ${teamName}</b>\n\nCasa: ${bookmaker}\nOdd anterior: ${oldOdd.toFixed(2)}\nOdd atual: <b>${newOdd.toFixed(2)}</b>\nVariação: ${change > 0 ? '+' : ''}${change.toFixed(1)}%\n\n<a href="${process.env.NEXT_PUBLIC_SITE_URL}/odds">Ver comparador completo →</a>`
}
