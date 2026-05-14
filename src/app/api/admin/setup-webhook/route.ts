import { NextRequest, NextResponse } from 'next/server'
import { setWebhook, deleteWebhook } from '@/lib/telegram'

export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || token !== process.env.INTERNAL_API_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_SITE_URL não configurado' }, { status: 500 })
  }

  const webhookUrl = `${siteUrl}/api/webhook/telegram`
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET

  const result = await setWebhook(webhookUrl, secret)
  return NextResponse.json({ webhookUrl, result })
}

export async function DELETE(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || token !== process.env.INTERNAL_API_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await deleteWebhook()
  return NextResponse.json(result)
}
