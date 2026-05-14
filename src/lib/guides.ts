export interface GuideSection {
  heading: string
  body: string
}

export interface Guide {
  slug: string
  title: string
  description: string
  category: 'fundamentos' | 'estrategia' | 'mercados' | 'gestao'
  readTime: number
  updatedAt: string
  sections: GuideSection[]
}

export const GUIDES: Guide[] = [
  {
    slug: 'como-comparar-odds',
    title: 'Como Comparar Odds — Guia Completo',
    description:
      'Aprenda como comparar odds entre casas de apostas para sempre encontrar o melhor valor antes de apostar.',
    category: 'fundamentos',
    readTime: 6,
    updatedAt: '2026-05-01',
    sections: [
      {
        heading: 'O que são odds?',
        body: 'Odds (ou cotações) representam a probabilidade implícita de um evento ocorrer e determinam quanto você recebe por cada real apostado. No formato decimal — o mais usado no Brasil — uma odd de 2.50 significa que para cada R$1 apostado você recebe R$2,50 de volta se ganhar, com lucro de R$1,50.',
      },
      {
        heading: 'Por que as odds variam entre casas?',
        body: 'Cada casa de apostas define suas cotações de forma independente, com base em seus modelos matemáticos, volume de apostas recebidas e margem de lucro (chamada de "vig" ou "overround"). Um mesmo jogo pode ter odds de 2.30 em uma casa e 2.55 em outra — diferença de 10,8% que impacta diretamente seu retorno a longo prazo.',
      },
      {
        heading: 'Como usar um comparador de odds',
        body: 'Um comparador como o OddsBR lista as cotações de várias casas lado a lado para o mesmo evento. O processo é simples: (1) acesse a página do jogo, (2) escolha o mercado desejado (1X2, Over/Under, etc.), (3) identifique a casa com a maior odd para o desfecho que você acredita e (4) aposte lá. É gratuito e leva menos de 1 minuto.',
      },
      {
        heading: 'Qual a diferença entre os tipos de odds?',
        body: 'O formato decimal (ex: 2.50) é o padrão no Brasil e inclui o valor apostado no retorno. O formato fracionário (ex: 3/2) é mais comum no Reino Unido e mostra o lucro proporcional. O formato americano (ex: +150 ou -200) é usado nos EUA. O OddsBR exibe sempre no formato decimal para facilitar a comparação.',
      },
      {
        heading: 'Quanto posso ganhar comparando odds?',
        body: 'Apostadores que consistentemente escolhem a melhor odd disponível — em vez de ficar em uma única casa — podem aumentar seu retorno esperado em 3% a 8% ao longo do tempo. Para quem aposta com frequência, isso representa uma diferença significativa na rentabilidade anual.',
      },
      {
        heading: 'Dica: abra conta em mais de uma casa',
        body: 'Para aproveitar as melhores odds, você precisa ter saldo disponível em diferentes casas. A boa notícia: todas as casas listadas no OddsBR oferecem bônus de boas-vindas. Aproveite para criar contas em pelo menos três delas — Betano, Bet365 e Superbet são as que geralmente oferecem as odds mais competitivas no mercado brasileiro.',
      },
    ],
  },
  {
    slug: 'value-bet',
    title: 'O que é Value Bet e Como Encontrar',
    description:
      'Entenda o conceito de value bet — a aposta com valor positivo — e aprenda a identificar oportunidades que as casas subestimam.',
    category: 'estrategia',
    readTime: 7,
    updatedAt: '2026-05-01',
    sections: [
      {
        heading: 'O conceito de valor em apostas',
        body: 'Uma value bet ocorre quando a probabilidade real de um evento é maior do que a probabilidade implícita na odd oferecida pela casa. Em outras palavras: a casa está "pagando mal" — oferecendo mais dinheiro do que deveria. Apostar sistematicamente em value bets é a base de qualquer estratégia lucrativa a longo prazo.',
      },
      {
        heading: 'Como calcular o valor esperado',
        body: 'A fórmula é simples: Valor Esperado = (Probabilidade × Odd) − 1. Se você acredita que o Flamengo tem 55% de chance de vencer (0.55) e a odd oferecida é 2.10, o cálculo é: (0.55 × 2.10) − 1 = 0.155, ou seja, +15.5% de valor positivo. Qualquer resultado acima de zero indica uma value bet.',
      },
      {
        heading: 'De onde vem a probabilidade real?',
        body: 'Estimar a probabilidade real é o verdadeiro desafio. Fontes úteis incluem: histórico de confrontos diretos, forma recente dos times (últimos 5-10 jogos), desfalques por lesão ou suspensão, e modelos estatísticos baseados em gols esperados (xG). Nenhuma fonte é perfeita — a habilidade está em combinar informações.',
      },
      {
        heading: 'Por que value bets funcionam no longo prazo',
        body: 'No curto prazo, qualquer aposta pode ganhar ou perder. Mas a longo prazo — com centenas ou milhares de apostas — quem aposta consistentemente em odds com valor positivo tende a lucrar, pois a lei dos grandes números faz as probabilidades convergirem para a realidade. É exatamente assim que as casas de apostas ganham dinheiro (com valor a favor delas).',
      },
      {
        heading: 'Como o OddsBR ajuda a encontrar value bets',
        body: 'Ao comparar odds de múltiplas casas, fica mais fácil identificar quando uma casa específica está pagando acima do mercado para um determinado resultado — o que frequentemente indica valor. O comparador também mostra a média de mercado, permitindo identificar outliers rapidamente.',
      },
      {
        heading: 'Erros comuns ao buscar value bets',
        body: 'O maior erro é confundir "equipe favorita" com "value". Uma odd de 1.20 para o favorito pode não ter valor; uma odd de 5.00 para o zebra pode ter. Outro erro é desistir após uma sequência de derrotas — value bets podem perder várias vezes seguidas sem invalidar a estratégia. Registre todas as suas apostas e avalie o ROI no longo prazo.',
      },
    ],
  },
  {
    slug: 'handicap-asiatico',
    title: 'Handicap Asiático Explicado — Do Básico ao Avançado',
    description:
      'Entenda como funciona o handicap asiático, um dos mercados mais populares no futebol, com exemplos práticos e estratégias.',
    category: 'mercados',
    readTime: 8,
    updatedAt: '2026-05-01',
    sections: [
      {
        heading: 'O que é o handicap asiático?',
        body: 'O handicap asiático é um tipo de aposta em que um time recebe uma vantagem ou desvantagem fictícia de gols antes do jogo começar, eliminando o empate como resultado possível. Criado na Ásia para nivelar disputas desiguais, hoje é um dos mercados mais apostados no futebol mundial por oferecer odds mais competitivas.',
      },
      {
        heading: 'Como funciona na prática',
        body: 'Se o Palmeiras joga contra o Athletico-PR e você aposta no Palmeiras com handicap -1.5, o Palmeiras precisa vencer por 2 gols ou mais para você ganhar. Se apostar no Athletico-PR com +1.5, você ganha se o Athletico vencer, empatar, ou perder por apenas 1 gol. O "-" representa desvantagem (favorito), o "+" vantagem (azarão).',
      },
      {
        heading: 'Handicaps inteiros vs. meios gols',
        body: 'Handicaps com meios gols (0.5, 1.5, 2.5) nunca permitem empate na aposta — sempre há um vencedor. Handicaps inteiros (0, 1, 2) permitem o "push" — devolução do dinheiro apostado quando o resultado iguala exatamente o handicap. Exemplo: Palmeiras -1 e o Palmeiras vencer por exatamente 1 gol → aposta devolvida.',
      },
      {
        heading: 'Handicap duplo (quarter ball)',
        body: 'O handicap asiático também existe em quartos de gol (0.25, 0.75, 1.25...). Nesses casos, sua aposta é dividida igualmente entre dois handicaps adjacentes. Exemplo: apostar R$100 no handicap -0.75 equivale a R$50 no -0.5 e R$50 no -1. Se o time vencer por 1 gol, você ganha a metade (-0.5) e recupera a outra (-1).',
      },
      {
        heading: 'Handicap 0 (empate anulado)',
        body: 'O handicap 0, também chamado de "draw no bet", é o mais simples: você aposta em um time e, se o jogo terminar empatado, recebe o dinheiro de volta. É uma opção conservadora para apostar em favoritos com redução de risco.',
      },
      {
        heading: 'Vantagens sobre o mercado 1X2',
        body: 'O handicap asiático elimina o empate como resultado possível, o que significa que só há dois desfechos — reduzindo a vantagem matemática da casa. Odds de handicap costumam ser mais competitivas que o 1X2 tradicional, especialmente em jogos com favorito claro. Para apostadores experientes, é um mercado com melhor relação risco/retorno.',
      },
    ],
  },
  {
    slug: 'melhores-casas-apostas-brasil',
    title: 'Melhores Casas de Apostas do Brasil em 2026',
    description:
      'Compare as principais casas de apostas esportivas legalizadas no Brasil: odds, bônus, mercados e confiabilidade.',
    category: 'fundamentos',
    readTime: 9,
    updatedAt: '2026-05-01',
    sections: [
      {
        heading: 'Como escolher uma casa de apostas',
        body: 'Uma boa casa de apostas combina: (1) licença válida no Brasil ou regulação internacional reconhecida, (2) odds competitivas nos mercados de futebol brasileiro, (3) variedade de mercados (1X2, handicap, over/under, cantos, escanteios), (4) saque rápido e métodos de pagamento locais (Pix, boleto) e (5) suporte ao cliente em português.',
      },
      {
        heading: 'Betano',
        body: 'Uma das casas com as odds mais competitivas no Brasil, especialmente em Brasileirão e Copa do Brasil. Forte cobertura do futebol nacional, com mercados ao vivo e streaming de partidas. Interface limpa e aplicativo mobile bem avaliado. Licenciada e regulamentada, com saque via Pix em até 24h.',
      },
      {
        heading: 'Bet365',
        body: 'Referência global com uma das maiores variedades de mercados disponíveis — incluindo estatísticas avançadas e mercados de cantos, cartões e jogador marcador. Odds geralmente muito competitivas em competições europeias; no futebol brasileiro, tende a equiparar com as melhores casas nacionais. Cash out disponível.',
      },
      {
        heading: 'Superbet',
        body: 'Casa com crescimento acelerado no Brasil e odds frequentemente acima da média de mercado em Brasileirão. Bônus generoso para novos usuários e interface simples. Boa cobertura de futebol sul-americano, incluindo Copa Libertadores e Sul-Americana.',
      },
      {
        heading: 'KTO',
        body: 'Casa brasileira com foco no mercado local, odds competitivas em futebol nacional e suporte dedicado em português. Depósito e saque via Pix instantâneo. Ponto forte: programa de cashback para apostadores frequentes.',
      },
      {
        heading: 'Estrela Bet',
        body: 'Popular entre o público brasileiro, com patrocínio de times da Série A. Odds razoáveis e boa cobertura dos campeonatos nacionais. Interface voltada para usuários iniciantes, com tutoriais e guias dentro da plataforma.',
      },
      {
        heading: 'Como aproveitar múltiplas casas',
        body: 'A melhor estratégia é ter conta em pelo menos 3 casas e sempre comparar as odds antes de apostar. Use o OddsBR para identificar em qual casa cada mercado paga melhor. A diferença acumulada ao longo de meses pode ser significativa — apostadores disciplinados que comparam odds consistentemente têm ROI superior em 5-10 pontos percentuais.',
      },
    ],
  },
  {
    slug: 'over-under',
    title: 'Como Funciona o Over/Under (Mais/Menos Gols)',
    description:
      'Guia completo sobre o mercado Over/Under: como apostar em total de gols, estratégias e quando usar cada opção.',
    category: 'mercados',
    readTime: 6,
    updatedAt: '2026-05-01',
    sections: [
      {
        heading: 'O que é o mercado Over/Under?',
        body: 'No mercado Over/Under (também chamado de "mais/menos gols"), você aposta no total de gols da partida — independentemente de qual time marcar. Não importa quem vence: o que importa é se a soma dos gols ultrapassa (Over) ou fica abaixo (Under) de um valor determinado, geralmente 2.5 gols.',
      },
      {
        heading: 'Como funciona o Over/Under 2.5',
        body: 'O 2.5 é o mercado mais popular. Over 2.5 vence se o jogo terminar com 3 ou mais gols no total. Under 2.5 vence se o jogo terminar com 0, 1 ou 2 gols. Como os resultados de 3+ gols são ligeiramente menos comuns que os de 0-2 gols no futebol brasileiro, o Under costuma ter odds ligeiramente menores (e portanto é o "favorito estatístico").',
      },
      {
        heading: 'Outros valores de Over/Under',
        body: 'Além do 2.5, as casas oferecem: Over/Under 1.5 (muito comum em jogos com histórico defensivo), 3.5 (popular em campeonatos com muitos gols) e 0.5 (se haverá algum gol). Alguns mercados usam valores inteiros como 2 ou 3, que permitem devolução (empate de gols) — fique atento às regras de cada casa.',
      },
      {
        heading: 'Fatores que influenciam o total de gols',
        body: 'Ao analisar Over/Under, considere: (1) médias de gols dos dois times nos últimos jogos, (2) histórico do confronto direto, (3) importância da partida (finais e decisões tendem a ser mais fechadas), (4) desfalques nos setores ofensivos/defensivos, (5) estilo de jogo dos treinadores e (6) condições climáticas extremas.',
      },
      {
        heading: 'Combinando com outros mercados',
        body: 'Over/Under combina bem com Ambos Marcam (BTTS). Se você acredita que será um jogo aberto com ambos times marcando, pode combinar "Ambos Marcam — Sim" com "Over 2.5" em uma acumulada, potencializando o retorno com consistência lógica entre os mercados escolhidos.',
      },
      {
        heading: 'Por que Over/Under é vantajoso para apostadores',
        body: 'Diferente do 1X2, você não precisa acertar o vencedor — apenas o padrão de gols. Isso facilita a análise quando os times são muito equilibrados. Além disso, a ausência do empate como fator complica menos o raciocínio: são apenas dois desfechos possíveis.',
      },
    ],
  },
  {
    slug: 'gestao-de-banca',
    title: 'Gestão de Banca para Apostas Esportivas',
    description:
      'Aprenda a gerenciar sua banca de apostas para sobreviver às sequências negativas e crescer de forma sustentável.',
    category: 'gestao',
    readTime: 8,
    updatedAt: '2026-05-01',
    sections: [
      {
        heading: 'Por que gestão de banca é fundamental',
        body: 'Mesmo apostadores com uma taxa de acerto excelente podem quebrar a banca se apostarem de forma irresponsável. A gestão de banca é o conjunto de regras que define quanto apostar em cada evento. Sem ela, uma sequência de derrotas — inevitável em qualquer estratégia — pode eliminar todo o capital antes que as apostas lucrativas apareçam.',
      },
      {
        heading: 'Defina sua banca inicial',
        body: 'A banca de apostas é o dinheiro reservado exclusivamente para apostas — separado das suas finanças pessoais. Nunca aposte dinheiro que você não pode perder. A banca deve ser um valor que, mesmo que perdido completamente, não afete seu padrão de vida. Muitos especialistas recomendam começar com pelo menos 50 unidades de apostas.',
      },
      {
        heading: 'O método flat (unidades fixas)',
        body: 'O método mais simples e recomendado para iniciantes: aposte sempre o mesmo valor em cada aposta — geralmente 1% a 2% da banca total. Com uma banca de R$500, cada aposta seria de R$5 a R$10. Isso garante que você nunca perca tudo em uma sequência ruim e permite crescimento gradual conforme a banca aumenta.',
      },
      {
        heading: 'Critério de Kelly (versão simplificada)',
        body: 'O critério de Kelly calcula o tamanho ótimo da aposta com base na vantagem percebida: % da banca = (Odd × Probabilidade − 1) / (Odd − 1). Para uma odd de 2.20 com probabilidade estimada de 55%: (2.20 × 0.55 − 1) / (2.20 − 1) = 0.21 / 1.20 = 17.5% — muito alto para usar na íntegra. Apostadores experientes usam 25-50% do Kelly para reduzir risco.',
      },
      {
        heading: 'Quanto apostar por evento',
        body: 'Uma diretriz prática: nunca aposte mais de 3-5% da banca em um único evento. Reserve apostas maiores (2-3%) para situações de alta confiança e aposte menos (1%) em mercados menos familiares. Evite acumuladas com muitas seleções — cada aposta adicional multiplica o risco exponencialmente.',
      },
      {
        heading: 'Registre todas as suas apostas',
        body: 'Um registro detalhado é a ferramenta mais valiosa para um apostador. Anote: data, evento, mercado, odd, valor apostado, resultado e lucro/prejuízo. Após 100+ apostas, você terá dados reais sobre sua taxa de acerto e ROI por mercado, time e campeonato. Isso permite identificar onde você tem vantagem real e onde está perdendo dinheiro.',
      },
      {
        heading: 'Jogue com responsabilidade',
        body: 'Apostas esportivas devem ser uma forma de entretenimento, não uma fonte de renda principal. Defina limites diários, semanais e mensais antes de começar e respeite-os. Se sentir que as apostas estão afetando sua vida financeira ou emocional, busque ajuda. O site Jogo Responsável (jogoresponsavel.com.br) oferece suporte gratuito.',
      },
    ],
  },
]

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug)
}
