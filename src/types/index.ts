export type Market = '1x2' | 'over_under' | 'btts' | 'exact_score' | 'double_chance'
export type PredictionResult = 'correct' | 'incorrect' | 'void'
export type ArticleType = 'prediction' | 'news' | 'guide' | 'recap'

export interface Profile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  favorite_team: string | null
  telegram_chat_id: number | null
  is_premium: boolean
  premium_until: string | null
  points_total: number
  predictions_total: number
  predictions_correct: number
  current_streak: number
  best_streak: number
  created_at: string
  updated_at: string
}

export interface Prediction {
  id: string
  user_id: string
  game_id: string
  home_team: string
  away_team: string
  league: string
  league_country: string | null
  game_date: string
  market: Market
  prediction: string
  confidence: number
  justification: string | null
  odds_at_time: number | null
  final_score_home: number | null
  final_score_away: number | null
  result: PredictionResult | null
  points_earned: number
  likes_count: number
  comments_count: number
  created_at: string
}

export interface OddsSnapshot {
  id: string
  game_id: string
  home_team: string
  away_team: string
  league: string
  game_date: string
  bookmaker: string
  market: string
  home_odd: number | null
  draw_odd: number | null
  away_odd: number | null
  over_25_odd: number | null
  under_25_odd: number | null
  btts_yes_odd: number | null
  btts_no_odd: number | null
  captured_at: string
}

export interface Article {
  id: string
  slug: string
  title: string
  meta_description: string | null
  content: string
  game_id: string | null
  home_team: string | null
  away_team: string | null
  league: string | null
  game_date: string | null
  article_type: ArticleType
  generated_by: string
  source_url: string | null
  published: boolean
  views: number
  published_at: string
  created_at: string
}

export interface Achievement {
  id: string
  user_id: string
  badge_key: string
  unlocked_at: string
}

// The Odds API types
export interface OddsGame {
  id: string
  sport_key: string
  sport_title: string
  commence_time: string
  home_team: string
  away_team: string
  bookmakers: OddsBookmaker[]
}

export interface OddsBookmaker {
  key: string
  title: string
  last_update: string
  markets: OddsMarket[]
}

export interface OddsMarket {
  key: string
  last_update: string
  outcomes: OddsOutcome[]
}

export interface OddsOutcome {
  name: string
  price: number
  point?: number
}
