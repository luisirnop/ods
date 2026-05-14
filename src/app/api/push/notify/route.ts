import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_CONTACT_EMAIL ?? 'admin@oddsbr.com.br'}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || token !== process.env.INTERNAL_API_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { subscriptions, title, body, url } = (await req.json()) as {
    subscriptions: webpush.PushSubscription[]
    title: string
    body: string
    url?: string
  }

  if (!subscriptions?.length) {
    return NextResponse.json({ sent: 0, failed: 0 })
  }

  const payload = JSON.stringify({
    title,
    body,
    icon: '/icon-192.png',
    url: url ?? '/',
  })

  const results = await Promise.allSettled(
    subscriptions.map((sub) => webpush.sendNotification(sub, payload))
  )

  const sent = results.filter((r) => r.status === 'fulfilled').length
  const failed = results.filter((r) => r.status === 'rejected').length

  return NextResponse.json({ sent, failed })
}
