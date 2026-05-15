import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Termos de Uso | OddsBR',
  description: 'Termos de uso da plataforma OddsBR — comparador de odds de apostas esportivas.',
}

const LAST_UPDATED = '15 de maio de 2026'

export default function TermosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-white/8">
        <p className="text-xs text-green-500 uppercase tracking-widest font-semibold">Legal</p>
        <h1 className="text-3xl font-extrabold text-white">Termos de Uso</h1>
        <p className="text-sm text-muted-foreground">Última atualização: {LAST_UPDATED}</p>
      </div>

      <div className="prose prose-invert prose-sm max-w-none space-y-8 text-muted-foreground leading-relaxed">

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e utilizar a plataforma OddsBR (<strong className="text-white">oddsbr.com.br</strong>), você concorda com estes Termos de Uso. Caso não concorde com qualquer disposição, não utilize nossos serviços.
          </p>
          <p>
            Reservamo-nos o direito de alterar estes termos a qualquer momento. Alterações significativas serão comunicadas por e-mail ou por aviso destacado na plataforma.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">2. O que é o OddsBR</h2>
          <p>
            O OddsBR é um serviço de <strong className="text-white">comparação de odds</strong> e conteúdo informativo sobre apostas esportivas. <strong className="text-white">Não somos uma casa de apostas</strong> e não operamos jogos de azar. Não recebemos depósitos, não gerenciamos apostas e não processamos pagamentos de apostas dos usuários.
          </p>
          <p>
            Nosso serviço se limita a:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Exibir e comparar odds de casas de apostas licenciadas</li>
            <li>Publicar conteúdo informativo e educativo sobre apostas esportivas</li>
            <li>Direcionar usuários, via links de afiliado, para casas de apostas regulamentadas</li>
            <li>Oferecer ferramentas de análise (calculadora de banca, detector de value bets)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">3. Elegibilidade — Maiores de 18 Anos</h2>
          <p>
            O uso da plataforma é <strong className="text-white">restrito a maiores de 18 anos</strong>. Ao criar uma conta ou acessar nosso conteúdo, você declara ter pelo menos 18 anos de idade.
          </p>
          <p>
            Apostas esportivas são atividade regulada no Brasil pela Lei nº 14.790/2023. É responsabilidade exclusiva do usuário verificar a legalidade de apostas em sua jurisdição e cumprir a legislação aplicável.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">4. Links de Afiliado e Transparência Comercial</h2>
          <p>
            O OddsBR possui relação comercial com casas de apostas parceiras (Betano, Superbet, KTO, Bet365, Estrela Bet). Quando você clica em um link de "Resgatar bônus" ou similar e realiza um cadastro ou depósito, podemos receber uma comissão da casa de apostas.
          </p>
          <p>
            Esta relação <strong className="text-white">não influencia</strong> a forma como exibimos as odds — as melhores odds são sempre destacadas independentemente da casa que as oferece.
          </p>
          <p>
            Links patrocinados são identificados com o aviso <em>"Publicidade"</em> ou <em>"Patrocinado"</em>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">5. Precisão das Informações</h2>
          <p>
            As odds exibidas na plataforma são obtidas de fontes externas e podem ter atraso de até 5 minutos em relação às odds reais das casas de apostas. O OddsBR <strong className="text-white">não garante</strong> a precisão, completude ou atualidade das odds em tempo real.
          </p>
          <p>
            Sempre confirme as odds diretamente no site da casa de apostas antes de realizar qualquer aposta. O OddsBR não se responsabiliza por diferenças de odds ou por decisões de apostas tomadas com base em informações exibidas na plataforma.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">6. Jogo Responsável</h2>
          <p>
            Apostas esportivas envolvem risco financeiro real. O OddsBR promove o <strong className="text-white">jogo responsável</strong> e recomenda:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Estabelecer limites de banca antes de apostar</li>
            <li>Nunca apostar mais do que pode perder</li>
            <li>Não perseguir prejuízos (martingale)</li>
            <li>Buscar ajuda profissional em caso de dependência de jogo</li>
          </ul>
          <p>
            Se você ou alguém que conhece tem problemas com jogo compulsivo, acesse o <strong className="text-white">Jogo Responsável Brasil</strong> ou ligue para o CVV: <strong className="text-white">188</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">7. Conta de Usuário</h2>
          <p>
            Ao criar uma conta, você é responsável por manter a confidencialidade das suas credenciais de acesso. Notifique-nos imediatamente em caso de uso não autorizado da sua conta.
          </p>
          <p>
            Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos, pratiquem fraude ou prejudiquem outros usuários.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">8. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo original da plataforma OddsBR — textos, análises, código, design e marca — é protegido por direitos autorais. É proibida a reprodução, distribuição ou uso comercial sem autorização expressa.
          </p>
          <p>
            Logos e marcas das casas de apostas parceiras pertencem a seus respectivos proprietários.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">9. Limitação de Responsabilidade</h2>
          <p>
            O OddsBR não se responsabiliza por perdas financeiras resultantes de apostas realizadas com base em informações da plataforma, por indisponibilidade temporária do serviço, ou por ações de terceiros (casas de apostas, provedores de dados).
          </p>
          <p>
            A plataforma é fornecida "como está", sem garantias de qualquer tipo.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">10. Legislação Aplicável</h2>
          <p>
            Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer controvérsias.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">11. Contato</h2>
          <p>
            Dúvidas sobre estes termos? Entre em contato: <strong className="text-white">contato@oddsbr.com.br</strong>
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-white/8 flex gap-4 text-xs text-muted-foreground">
        <Link href="/privacidade" className="hover:text-white transition-colors">Política de Privacidade →</Link>
        <Link href="/" className="hover:text-white transition-colors">Voltar ao início</Link>
      </div>
    </div>
  )
}
