'use client'

import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser } from '@/actions/push'

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i)
  return output.buffer as ArrayBuffer
}

export default function PushToggle() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    setIsSupported(true)
    navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setSubscription(sub))
      .catch(() => null)
  }, [])

  async function subscribe() {
    setLoading(true)
    setStatus(null)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setStatus('Permissão negada. Habilite notificações nas configurações do navegador.')
        return
      }
      const reg = await navigator.serviceWorker.ready
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''
      if (!vapidKey) {
        setStatus('Chave VAPID não configurada.')
        return
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })
      setSubscription(sub)
      const result = await subscribeUser(JSON.parse(JSON.stringify(sub)))
      if ('error' in result) setStatus(result.error ?? 'Erro desconhecido')
      else setStatus('Notificações ativadas!')
    } catch (e) {
      setStatus('Erro ao ativar notificações.')
    } finally {
      setLoading(false)
    }
  }

  async function unsubscribe() {
    setLoading(true)
    setStatus(null)
    try {
      const endpoint = subscription!.endpoint
      await subscription!.unsubscribe()
      setSubscription(null)
      await unsubscribeUser(endpoint)
      setStatus('Notificações desativadas.')
    } catch {
      setStatus('Erro ao desativar notificações.')
    } finally {
      setLoading(false)
    }
  }

  if (!isSupported) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <button
          onClick={subscription ? unsubscribe : subscribe}
          disabled={loading}
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
            subscription
              ? 'border-red-500/40 text-red-600 hover:bg-red-500/5'
              : 'border-green-500/40 text-green-600 hover:bg-green-500/10'
          }`}
        >
          {loading ? 'Aguarde...' : subscription ? 'Desativar notificações' : 'Ativar notificações do navegador'}
        </button>
        {subscription && (
          <span className="text-xs text-green-600 font-medium">Ativo</span>
        )}
      </div>
      {status && (
        <p className="text-xs text-muted-foreground">{status}</p>
      )}
    </div>
  )
}
