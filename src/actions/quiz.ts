'use server'

import { getAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  answer: string
  explanation: string
}

export interface DailyQuiz {
  id: string
  quiz_date: string
  questions: QuizQuestion[]
}

export interface QuizAnswerRecord {
  quiz_date: string
  answers: string[]
  correct_count: number
  points_earned: number
  answered_at: string
}

type SubmitState =
  | { error: string }
  | {
      correct_count: number
      total: number
      points_earned: number
      results: boolean[]
      correct_answers: string[]
      explanations: string[]
    }
  | undefined

export async function getTodayQuiz(): Promise<DailyQuiz | null> {
  const admin = getAdminClient()
  const today = new Date().toISOString().slice(0, 10)
  const { data } = await admin
    .from('daily_quiz')
    .select('id, quiz_date, questions')
    .eq('quiz_date', today)
    .single()
  if (!data) return null
  return data as DailyQuiz
}

export async function getUserQuizAnswer(): Promise<QuizAnswerRecord | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const today = new Date().toISOString().slice(0, 10)
  const { data } = await supabase
    .from('quiz_answers')
    .select('quiz_date, answers, correct_count, points_earned, answered_at')
    .eq('quiz_date', today)
    .single()
  if (!data) return null
  return data as QuizAnswerRecord
}

export async function submitQuiz(
  _prevState: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Faça login para participar do quiz.' }

  const today = new Date().toISOString().slice(0, 10)
  const admin = getAdminClient()

  const { data: existing } = await admin
    .from('quiz_answers')
    .select('id')
    .eq('user_id', user.id)
    .eq('quiz_date', today)
    .single()
  if (existing) return { error: 'Você já respondeu o quiz de hoje.' }

  const { data: quizRow } = await admin
    .from('daily_quiz')
    .select('questions')
    .eq('quiz_date', today)
    .single()
  if (!quizRow) return { error: 'Quiz de hoje não encontrado.' }

  const questions: QuizQuestion[] = quizRow.questions
  const userAnswers: string[] = questions.map((_, i) => formData.get(`q${i}`) as string ?? '')

  const results = questions.map((q, i) => userAnswers[i] === q.answer)
  const correct_count = results.filter(Boolean).length
  const points_earned = correct_count * 2

  await admin.from('quiz_answers').insert({
    user_id: user.id,
    quiz_date: today,
    answers: userAnswers,
    correct_count,
    points_earned,
  })

  const { data: profile } = await admin
    .from('profiles')
    .select('points_total')
    .eq('id', user.id)
    .single()
  const current = (profile?.points_total ?? 0) as number
  await admin
    .from('profiles')
    .update({ points_total: current + points_earned })
    .eq('id', user.id)

  revalidatePath('/quiz')

  return {
    correct_count,
    total: questions.length,
    points_earned,
    results,
    correct_answers: questions.map((q) => q.answer),
    explanations: questions.map((q) => q.explanation),
  }
}
