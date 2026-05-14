import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import {
  sendMessage,
  sendMessageWithKeyboard,
  answerCallbackQuery,
  editMessageText,
  getTimesKeyboard,
  msgStart,
  msgConnected,
  msgStatus,
  msgTimesMenu,
  msgTeamSet,
  msgDisconnected,
  msgNotConnected,
  TIMES_BRASILEIROS,
} from '@/lib/telegram'

interface TelegramMessage {
  chat: { id: number }
  text?: string
  from?: { first_name: string; id: number }
}

interface TelegramCallbackQuery {
  id: string
  from: { id: number; first_name: string }
  message: { chat: { id: number }; message_id: number }
  data?: string
}

interface TelegramUpdate {
  message?: TelegramMessage
  callback_query?: TelegramCallbackQuery
}

async function findProfileByChatId(chatId: number) {
  const admin = getAdminClient()
  const { data } = await admin
    .from('profiles')
    .select('id, display_name, favorite_team')
    .eq('telegram_chat_id', chatId)
    .single()
  return data
}

async function handleMessage(message: TelegramMessage) {
  const chatId = message.chat.id
  const text = (message.text ?? '').trim()
  const firstName = message.from?.first_name ?? 'usuário'

  if (text === '/start') {
    await sendMessage(chatId, msgStart(firstName))
    return
  }

  if (text === '/status') {
    const profile = await findProfileByChatId(chatId)
    if (!profile) {
      await sendMessage(chatId, msgNotConnected())
    } else {
      await sendMessage(chatId, msgStatus(profile.display_name ?? 'Usuário', profile.favorite_team))
    }
    return
  }

  if (text === '/desconectar') {
    const profile = await findProfileByChatId(chatId)
    if (!profile) {
      await sendMessage(chatId, msgNotConnected())
      return
    }
    const admin = getAdminClient()
    await admin.from('profiles').update({ telegram_chat_id: null }).eq('id', profile.id)
    await sendMessage(chatId, msgDisconnected())
    return
  }

  if (text === '/times') {
    const profile = await findProfileByChatId(chatId)
    if (!profile) {
      await sendMessage(chatId, msgNotConnected())
      return
    }
    await sendMessageWithKeyboard(
      chatId,
      msgTimesMenu(profile.favorite_team),
      getTimesKeyboard()
    )
    return
  }

  if (text.startsWith('/conectar ')) {
    const email = text.replace('/conectar ', '').trim().toLowerCase()
    if (!email.includes('@')) {
      await sendMessage(chatId, '❌ Email inválido. Use: /conectar seuemail@exemplo.com')
      return
    }

    const admin = getAdminClient()
    const { data: users, error } = await admin.auth.admin.listUsers()

    if (error) {
      await sendMessage(chatId, '❌ Erro interno. Tente novamente em instantes.')
      return
    }

    const user = users?.users?.find((u) => u.email?.toLowerCase() === email)

    if (!user) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oddsbr.com.br'
      await sendMessage(
        chatId,
        `❌ Email não encontrado. Cadastre-se em <a href="${siteUrl}/cadastro">${siteUrl}/cadastro</a>`
      )
      return
    }

    const { data: existing } = await admin
      .from('profiles')
      .select('telegram_chat_id')
      .eq('id', user.id)
      .single()

    if (existing?.telegram_chat_id && existing.telegram_chat_id !== chatId) {
      await sendMessage(chatId, '⚠️ Esta conta já está conectada a outro Telegram.')
      return
    }

    const { data: profile } = await admin
      .from('profiles')
      .update({ telegram_chat_id: chatId })
      .eq('id', user.id)
      .select('display_name')
      .single()

    await sendMessage(chatId, msgConnected(profile?.display_name ?? email.split('@')[0]))
    return
  }

  await sendMessage(chatId, 'Comando não reconhecido. Use /start para ver os comandos.')
}

async function handleCallbackQuery(query: TelegramCallbackQuery) {
  const chatId = query.message.chat.id
  const messageId = query.message.message_id
  const data = query.data ?? ''

  if (data.startsWith('set_time:')) {
    const team = data.replace('set_time:', '')

    if (!TIMES_BRASILEIROS.includes(team)) {
      await answerCallbackQuery(query.id, '❌ Time inválido.')
      return
    }

    const profile = await findProfileByChatId(chatId)
    if (!profile) {
      await answerCallbackQuery(query.id, 'Conta não conectada.')
      return
    }

    const admin = getAdminClient()
    await admin.from('profiles').update({ favorite_team: team }).eq('id', profile.id)

    await answerCallbackQuery(query.id, `✅ ${team} selecionado!`)
    await editMessageText(chatId, messageId, msgTeamSet(team))
    return
  }

  await answerCallbackQuery(query.id)
}

export async function POST(request: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET
  if (secret) {
    const incomingSecret = request.headers.get('x-telegram-bot-api-secret-token')
    if (incomingSecret !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const update: TelegramUpdate = await request.json()

    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query)
    } else if (update.message) {
      await handleMessage(update.message)
    }
  } catch {
    // não retornar erro para o Telegram para evitar retries
  }

  return NextResponse.json({ ok: true })
}
