import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidade | OddsBR',
  description: 'Política de privacidade do OddsBR — como coletamos, usamos e protegemos seus dados conforme a LGPD.',
}

const LAST_UPDATED = '15 de maio de 2026'

export default function PrivacidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-white/8">
        <p className="text-xs text-green-500 uppercase tracking-widest font-semibold">Legal</p>
        <h1 className="text-3xl font-extrabold text-white">Política de Privacidade</h1>
        <p className="text-sm text-muted-foreground">Última atualização: {LAST_UPDATED}</p>
      </div>

      <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
        <p className="text-xs text-green-400 leading-relaxed">
          Esta política está em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD) — Lei nº 13.709/2018</strong>. O OddsBR respeita sua privacidade e se compromete a proteger seus dados pessoais.
        </p>
      </div>

      <div className="prose prose-invert prose-sm max-w-none space-y-8 text-muted-foreground leading-relaxed">

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">1. Quem somos</h2>
          <p>
            O <strong className="text-white">OddsBR</strong> é uma plataforma de comparação de odds e conteúdo informativo sobre apostas esportivas, operada por pessoa jurídica brasileira. Para questões de privacidade, entre em contato pelo e-mail: <strong className="text-white">privacidade@oddsbr.com.br</strong>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">2. Dados que coletamos</h2>

          <h3 className="text-sm font-semibold text-white/90">2.1 Dados fornecidos por você</h3>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-white/80">Cadastro:</strong> nome, endereço de e-mail, senha (criptografada)</li>
            <li><strong className="text-white/80">Perfil:</strong> time favorito, preferências de campeonato</li>
            <li><strong className="text-white/80">Bolão Copa 2026:</strong> palpites de chaveamento (público após compartilhamento)</li>
          </ul>

          <h3 className="text-sm font-semibold text-white/90">2.2 Dados coletados automaticamente</h3>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-white/80">Navegação:</strong> páginas visitadas, tempo de sessão, cliques em links de afiliado</li>
            <li><strong className="text-white/80">Dispositivo:</strong> tipo de dispositivo, navegador, sistema operacional</li>
            <li><strong className="text-white/80">Localização aproximada:</strong> país/estado via IP (não coletamos GPS)</li>
            <li><strong className="text-white/80">Cookies e localStorage:</strong> preferências, voto na enquete diária, variante de teste A/B</li>
          </ul>

          <h3 className="text-sm font-semibold text-white/90">2.3 Dados de terceiros</h3>
          <p>
            Quando você clica em links de afiliado, as casas de apostas parceiras podem coletar dados conforme suas próprias políticas de privacidade. O OddsBR não controla esse processo.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">3. Como usamos seus dados</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Manter sua conta e personalizar a experiência (time favorito, alertas)</li>
            <li>Enviar alertas de odds por e-mail ou push notification (somente com seu consentimento)</li>
            <li>Melhorar a plataforma com base em dados de uso agregados e anonimizados</li>
            <li>Processar pagamentos do plano Premium via Stripe (dados de cartão gerenciados exclusivamente pelo Stripe)</li>
            <li>Cumprir obrigações legais e fiscais</li>
          </ul>
          <p>
            <strong className="text-white">Não vendemos seus dados pessoais</strong> a terceiros para fins de marketing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">4. Bases legais (LGPD)</h2>
          <p>Tratamos seus dados com base nas seguintes hipóteses previstas na LGPD:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-white/80">Execução de contrato</strong> — para manter sua conta e prestar o serviço</li>
            <li><strong className="text-white/80">Consentimento</strong> — para envio de alertas e comunicações de marketing</li>
            <li><strong className="text-white/80">Legítimo interesse</strong> — para segurança da plataforma e prevenção a fraudes</li>
            <li><strong className="text-white/80">Cumprimento de obrigação legal</strong> — quando exigido por lei</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">5. Cookies e rastreamento</h2>
          <p>Utilizamos os seguintes tipos de cookies:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-white/80">Essenciais:</strong> sessão de autenticação (Supabase) — necessários para funcionamento</li>
            <li><strong className="text-white/80">Funcionais:</strong> preferências do usuário, localStorage para enquetes e A/B tests</li>
            <li><strong className="text-white/80">Analíticos:</strong> dados de navegação anonimizados para melhoria da plataforma</li>
            <li><strong className="text-white/80">Afiliados:</strong> identificadores de clique nos links patrocinados (rastreamento de conversão)</li>
          </ul>
          <p>
            Você pode desabilitar cookies nas configurações do seu navegador, mas isso pode afetar a funcionalidade da plataforma.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">6. Serviços de terceiros</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-white/8 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-white/5 text-white/70">
                  <th className="px-3 py-2 text-left font-semibold">Serviço</th>
                  <th className="px-3 py-2 text-left font-semibold">Finalidade</th>
                  <th className="px-3 py-2 text-left font-semibold">Dados compartilhados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="px-3 py-2 font-medium text-white/80">Supabase</td>
                  <td className="px-3 py-2">Banco de dados e autenticação</td>
                  <td className="px-3 py-2">E-mail, perfil</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium text-white/80">Stripe</td>
                  <td className="px-3 py-2">Pagamentos Premium</td>
                  <td className="px-3 py-2">E-mail, dados de cobrança</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium text-white/80">Vercel</td>
                  <td className="px-3 py-2">Hospedagem e CDN</td>
                  <td className="px-3 py-2">IP, logs de acesso</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium text-white/80">The Odds API</td>
                  <td className="px-3 py-2">Dados de odds em tempo real</td>
                  <td className="px-3 py-2">Nenhum dado pessoal</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-medium text-white/80">Casas afiliadas</td>
                  <td className="px-3 py-2">Rastreamento de conversão</td>
                  <td className="px-3 py-2">ID de clique anônimo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">7. Retenção de dados</h2>
          <p>
            Mantemos seus dados enquanto sua conta estiver ativa. Após a exclusão da conta, removemos seus dados pessoais em até <strong className="text-white">30 dias</strong>, exceto quando a retenção for exigida por lei (ex.: registros fiscais por 5 anos).
          </p>
          <p>
            Dados de cliques em links de afiliado são retidos por <strong className="text-white">90 dias</strong> para fins de relatório de comissão.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">8. Seus direitos (LGPD)</h2>
          <p>Conforme a LGPD, você tem direito a:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-white/80">Acesso</strong> — confirmar se tratamos seus dados e obter uma cópia</li>
            <li><strong className="text-white/80">Correção</strong> — corrigir dados incompletos, inexatos ou desatualizados</li>
            <li><strong className="text-white/80">Exclusão</strong> — solicitar a exclusão de dados desnecessários ou tratados em desconformidade</li>
            <li><strong className="text-white/80">Portabilidade</strong> — receber seus dados em formato estruturado</li>
            <li><strong className="text-white/80">Revogação do consentimento</strong> — para dados tratados com base em consentimento</li>
            <li><strong className="text-white/80">Oposição</strong> — opor-se a tratamentos com base em legítimo interesse</li>
          </ul>
          <p>
            Para exercer seus direitos, envie solicitação para <strong className="text-white">privacidade@oddsbr.com.br</strong>. Respondemos em até <strong className="text-white">15 dias úteis</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">9. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo: criptografia de senhas (bcrypt), conexões HTTPS, controle de acesso por RLS (Row Level Security) no banco de dados, e tokens de sessão com expiração automática.
          </p>
          <p>
            Em caso de incidente de segurança que afete seus dados, notificaremos a ANPD e os usuários afetados conforme exigido pela LGPD.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">10. Menores de idade</h2>
          <p>
            Nossos serviços são destinados exclusivamente a maiores de 18 anos. Não coletamos intencionalmente dados de menores. Caso identifiquemos dados de menor de idade, os excluiremos imediatamente.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">11. Alterações nesta política</h2>
          <p>
            Podemos atualizar esta política periodicamente. Alterações significativas serão comunicadas por e-mail ou aviso na plataforma com pelo menos 15 dias de antecedência.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">12. Contato e DPO</h2>
          <p>
            Para dúvidas sobre privacidade ou para exercer seus direitos:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>E-mail: <strong className="text-white">privacidade@oddsbr.com.br</strong></li>
            <li>Assunto: <em>"Solicitação LGPD — [seu direito]"</em></li>
          </ul>
          <p>
            Você também pode registrar reclamação junto à <strong className="text-white">ANPD (Autoridade Nacional de Proteção de Dados)</strong> em gov.br/anpd.
          </p>
        </section>

      </div>

      <div className="pt-6 border-t border-white/8 flex gap-4 text-xs text-muted-foreground">
        <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso →</Link>
        <Link href="/" className="hover:text-white transition-colors">Voltar ao início</Link>
      </div>
    </div>
  )
}
