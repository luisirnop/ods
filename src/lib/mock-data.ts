import type { OddsGame } from '@/types'

export const MOCK_GAMES: OddsGame[] = [
  {
    id: 'flamengo-x-palmeiras-brasileirao-2026',
    sport_key: 'soccer_brazil_campeonato',
    sport_title: 'Brasileirão Série A',
    commence_time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    home_team: 'Flamengo',
    away_team: 'Palmeiras',
    bookmakers: [
      {
        key: 'betano',
        title: 'Betano',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Flamengo', price: 2.45 },
              { name: 'Palmeiras', price: 2.90 },
              { name: 'Draw', price: 3.10 },
            ],
          },
          {
            key: 'totals',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Over', price: 1.85, point: 2.5 },
              { name: 'Under', price: 1.95, point: 2.5 },
            ],
          },
        ],
      },
      {
        key: 'superbet',
        title: 'Superbet',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Flamengo', price: 2.50 },
              { name: 'Palmeiras', price: 2.85 },
              { name: 'Draw', price: 3.05 },
            ],
          },
          {
            key: 'totals',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Over', price: 1.90, point: 2.5 },
              { name: 'Under', price: 1.90, point: 2.5 },
            ],
          },
        ],
      },
      {
        key: 'bet365',
        title: 'Bet365',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Flamengo', price: 2.40 },
              { name: 'Palmeiras', price: 2.95 },
              { name: 'Draw', price: 3.20 },
            ],
          },
          {
            key: 'totals',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Over', price: 1.87, point: 2.5 },
              { name: 'Under', price: 1.93, point: 2.5 },
            ],
          },
        ],
      },
      {
        key: 'kto',
        title: 'KTO',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Flamengo', price: 2.42 },
              { name: 'Palmeiras', price: 2.88 },
              { name: 'Draw', price: 3.15 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'corinthians-x-sao-paulo-brasileirao-2026',
    sport_key: 'soccer_brazil_campeonato',
    sport_title: 'Brasileirão Série A',
    commence_time: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    home_team: 'Corinthians',
    away_team: 'São Paulo',
    bookmakers: [
      {
        key: 'betano',
        title: 'Betano',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Corinthians', price: 2.80 },
              { name: 'São Paulo', price: 2.60 },
              { name: 'Draw', price: 3.00 },
            ],
          },
          {
            key: 'totals',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Over', price: 1.80, point: 2.5 },
              { name: 'Under', price: 2.00, point: 2.5 },
            ],
          },
        ],
      },
      {
        key: 'superbet',
        title: 'Superbet',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Corinthians', price: 2.75 },
              { name: 'São Paulo', price: 2.65 },
              { name: 'Draw', price: 2.95 },
            ],
          },
        ],
      },
      {
        key: 'bet365',
        title: 'Bet365',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Corinthians', price: 2.85 },
              { name: 'São Paulo', price: 2.55 },
              { name: 'Draw', price: 3.05 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'atletico-mg-x-cruzeiro-brasileirao-2026',
    sport_key: 'soccer_brazil_campeonato',
    sport_title: 'Brasileirão Série A',
    commence_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    home_team: 'Atlético-MG',
    away_team: 'Cruzeiro',
    bookmakers: [
      {
        key: 'betano',
        title: 'Betano',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Atlético-MG', price: 2.10 },
              { name: 'Cruzeiro', price: 3.40 },
              { name: 'Draw', price: 3.20 },
            ],
          },
          {
            key: 'totals',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Over', price: 1.95, point: 2.5 },
              { name: 'Under', price: 1.85, point: 2.5 },
            ],
          },
        ],
      },
      {
        key: 'kto',
        title: 'KTO',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Atlético-MG', price: 2.15 },
              { name: 'Cruzeiro', price: 3.35 },
              { name: 'Draw', price: 3.10 },
            ],
          },
        ],
      },
      {
        key: 'estrelabet',
        title: 'Estrela Bet',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Atlético-MG', price: 2.05 },
              { name: 'Cruzeiro', price: 3.50 },
              { name: 'Draw', price: 3.25 },
            ],
          },
        ],
      },
    ],
  },
]
