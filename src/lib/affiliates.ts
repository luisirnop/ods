export type Bookmaker =
  | 'betano'
  | 'superbet'
  | 'kto'
  | 'bet365'
  | 'estrelabet'

type AffiliateConfig = {
  name: string
  baseUrl: string
  affiliateParam: string
  affiliateId: string
}

const AFFILIATES: Record<Bookmaker, AffiliateConfig> = {
  betano: {
    name: 'Betano',
    baseUrl: 'https://www.betano.com.br',
    affiliateParam: 'ref',
    affiliateId: process.env.AFFILIATE_BETANO_ID ?? '',
  },
  superbet: {
    name: 'Superbet',
    baseUrl: 'https://superbet.com.br',
    affiliateParam: 'ref',
    affiliateId: process.env.AFFILIATE_SUPERBET_ID ?? '',
  },
  kto: {
    name: 'KTO',
    baseUrl: 'https://www.kto.com',
    affiliateParam: 'btag',
    affiliateId: process.env.AFFILIATE_KTO_ID ?? '',
  },
  bet365: {
    name: 'Bet365',
    baseUrl: 'https://www.bet365.com',
    affiliateParam: 'affiliate',
    affiliateId: process.env.AFFILIATE_BET365_ID ?? '',
  },
  estrelabet: {
    name: 'Estrela Bet',
    baseUrl: 'https://www.estrelabet.com',
    affiliateParam: 'ref',
    affiliateId: process.env.AFFILIATE_ESTRELABET_ID ?? '',
  },
}

export function getAffiliateLink(bookmaker: Bookmaker, page: string): string {
  const config = AFFILIATES[bookmaker]
  if (!config) return '#'

  const params = new URLSearchParams({
    [config.affiliateParam]: config.affiliateId,
    utm_source: 'oddsbr',
    utm_medium: 'affiliate',
    utm_campaign: page,
  })

  return `${config.baseUrl}?${params.toString()}`
}

export function getBookmakerName(bookmaker: Bookmaker): string {
  return AFFILIATES[bookmaker]?.name ?? bookmaker
}

export function getAllBookmakers(): Bookmaker[] {
  return Object.keys(AFFILIATES) as Bookmaker[]
}
