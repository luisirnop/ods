import type { Bookmaker } from './affiliates'

export interface BonusOffer {
  bookmakerKey: Bookmaker
  name: string
  bonus: string
  bonusDetail: string
  minDeposit: number
  rolloverTimes: number
  rolloverOdds: number
  highlight: string
  badge?: string
  accentColor: string
  promoCode?: string
  regulatedBR: true   // apenas casas licenciadas pelo SPA/MF aparecem aqui
}

export const BONUS_OFFERS: BonusOffer[] = [
  {
    bookmakerKey: 'betano',
    name: 'Betano',
    bonus: 'Até R$500',
    bonusDetail: '100% do 1º depósito até R$500',
    minDeposit: 20,
    rolloverTimes: 5,
    rolloverOdds: 1.65,
    highlight: 'Maior bônus do mercado',
    badge: 'MAIS POPULAR',
    accentColor: '#e23737',
    promoCode: 'ODDSBR500',
    regulatedBR: true,
  },
  {
    bookmakerKey: 'bet365',
    name: 'Bet365',
    bonus: 'Crédito R$200',
    bonusDetail: 'Crédito de aposta de até R$200',
    minDeposit: 30,
    rolloverTimes: 1,
    rolloverOdds: 1.20,
    highlight: 'Menor rollover do mercado',
    badge: 'MELHOR ROLLOVER',
    accentColor: '#1a7c3e',
    promoCode: 'ODDSBR',
    regulatedBR: true,
  },
  {
    bookmakerKey: 'kto',
    name: 'KTO',
    bonus: 'Até R$1.000',
    bonusDetail: '100% do 1º depósito até R$1.000',
    minDeposit: 30,
    rolloverTimes: 6,
    rolloverOdds: 1.65,
    highlight: 'Maior valor absoluto',
    badge: 'MAIOR VALOR',
    accentColor: '#f59e0b',
    promoCode: 'ODDS1000',
    regulatedBR: true,
  },
  {
    bookmakerKey: 'superbet',
    name: 'Superbet',
    bonus: 'Até R$200',
    bonusDetail: '100% do 1º depósito até R$200',
    minDeposit: 20,
    rolloverTimes: 3,
    rolloverOdds: 1.50,
    highlight: 'Rollover mais fácil de cumprir',
    accentColor: '#7c3aed',
    promoCode: 'ODDSBR',
    regulatedBR: true,
  },
  {
    bookmakerKey: 'estrelabet',
    name: 'Estrela Bet',
    bonus: 'Até R$300',
    bonusDetail: '100% do 1º depósito até R$300',
    minDeposit: 20,
    rolloverTimes: 4,
    rolloverOdds: 1.50,
    highlight: 'Ampla cobertura de mercados',
    accentColor: '#0ea5e9',
    promoCode: 'ESTRELA300',
    regulatedBR: true,
  },
  {
    bookmakerKey: 'betway',
    name: 'Betway',
    bonus: 'Até R$400',
    bonusDetail: '100% do 1º depósito até R$400',
    minDeposit: 30,
    rolloverTimes: 5,
    rolloverOdds: 1.65,
    highlight: 'Plataforma global com suporte local',
    accentColor: '#00a651',
    regulatedBR: true,
  },
]
