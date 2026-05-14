import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import PerfilForm from './PerfilForm'
import PushToggle from '@/components/shared/PushToggle'

export const metadata: Metadata = {
  title: 'Meu Perfil',
}

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie suas informações pessoais.</p>
      </div>

      {/* Estatísticas */}
      {profile && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Palpites', value: profile.predictions_total },
            { label: 'Acertos', value: profile.predictions_correct },
            { label: 'Pontos', value: profile.points_total },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border bg-card p-4 text-center">
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}

      <PerfilForm profile={profile} userId={user.id} />

      <div className="space-y-3">
        <div>
          <h2 className="font-semibold text-sm">Notificações do navegador</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Receba alertas quando o jogo do seu time favorito começar em breve.
          </p>
        </div>
        <PushToggle />
      </div>
    </div>
  )
}
