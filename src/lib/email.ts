export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const from = process.env.RESEND_FROM_EMAIL ?? 'OddsBR <noreply@oddsbr.com.br>'

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: '🎉 Bem-vindo ao OddsBR Premium!',
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
          <h2 style="color:#16a34a">Você é Premium, ${name}!</h2>
          <p>A partir de agora você tem acesso completo a:</p>
          <ul>
            <li>⚡ <strong>Value bets</strong> com casa, mercado e % de edge revelados</li>
            <li>🔔 <strong>Alertas de odds ilimitados</strong> pelo Telegram</li>
            <li>📊 <strong>Histórico completo</strong> de odds e movimentações</li>
          </ul>
          <p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oddsbr.com.br'}/odds"
               style="display:inline-block;background:#16a34a;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">
              Acessar agora →
            </a>
          </p>
          <p style="color:#6b7280;font-size:13px">
            Para gerenciar ou cancelar sua assinatura acesse seu
            <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oddsbr.com.br'}/perfil">perfil</a>.
          </p>
        </div>
      `,
    }),
  }).catch(() => {})
}
