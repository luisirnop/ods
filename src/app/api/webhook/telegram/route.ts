import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { sendMessage } from '@/lib/telegram'

interface TelegramUpdate {
  message?: {
    chat: { id: number }
    text?: string
    from?: { first_name: string }
  }
}

export async function POST(request: NextRequest) {
  const update: TelegramUpdate = await request.json()
  const message = update.message
  if (!message?.text) return NextResponse.json({ ok: true })

  const chatId = message.chat.id
  const text = message.text.trim()
  const firstName = message.from?.first_name ?? 'usuário'

  if (text === '/start') {
    await sendMessage(
      chatId,
      `Olá, ${firstName}! Bem-vindo ao OddsBR Bot 🎯\n\nComandos disponíveis:\n/conectar [email] — vincular sua conta\n/times — configurar times favoritos\n\n<a href="${process.env.NEXT_PUBLIC_SITE_URL}">Acessar OddsBR →</a>`
    )
    return NextResponse.json({ ok: true })
  }

  if (text.startsWith('/conectar ')) {
    const email = text.replace('/conectar ', '').trim()
    const admin = getAdminClient()

    const { data: users } = await admin.auth.admin.listUsers()
    const user = users?.users?.find((u) => u.email === email)

    if (!user) {
      await sendMessage(chatId, `❌ Email não encontrado. Cadastre-se em ${process.env.NEXT_PUBLIC_SITE_URL}/cadastro`)
      return NextResponse.json({ ok: true })
    }

    const { error } = await admin
      .from('profiles')
      .update({ telegram_chat_id: chatId })
      .eq('id', user.id)

    if (error) {
      await sendMessage(chatId, '❌ Erro ao conectar conta. Tente novamente.')
    } else {
      await sendMessage(chatId, '✅ Conta conectada com sucesso! Você receberá alertas de odds aqui.')
    }

    return NextResponse.json({ ok: true })
  }

  await sendMessage(chatId, 'Comando não reconhecido. Use /start para ver os comandos disponíveis.')
  return NextResponse.json({ ok: true })
}
