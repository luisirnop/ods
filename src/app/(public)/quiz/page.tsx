import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getTodayQuiz, getUserQuizAnswer } from '@/actions/quiz'
import QuizClient from './QuizClient'

export const metadata: Metadata = {
  title: 'Quiz Diário — OddsBR',
  description: 'Responda 5 perguntas sobre futebol e apostas todo dia. Ganhe pontos e suba no ranking.',
}

export default async function QuizPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [quiz, existingAnswer] = await Promise.all([
    getTodayQuiz(),
    getUserQuizAnswer(),
  ])

  const today = new Date().toISOString().slice(0, 10)
  const [year, month, day] = today.split('-')
  const dateLabel = `${day}/${month}/${year}`

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quiz Diário</h1>
        <p className="text-muted-foreground text-sm mt-1">
          5 perguntas sobre futebol · Renova à meia-noite · +2 pts por acerto
        </p>
      </div>

      {!quiz ? (
        <div className="rounded-xl border bg-card p-10 text-center space-y-2">
          <p className="text-muted-foreground text-sm">Quiz de hoje ainda não está disponível.</p>
          <p className="text-muted-foreground text-xs">Volte mais tarde ou aguarde até amanhã.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{dateLabel}</span>
            <span>5 perguntas · 10 pts máx</span>
          </div>
          <QuizClient
            questions={quiz.questions}
            existingAnswer={existingAnswer}
            quizDate={quiz.quiz_date}
            isLoggedIn={!!user}
          />
        </>
      )}

      <div className="rounded-xl border bg-card p-4 text-sm space-y-2 text-muted-foreground">
        <p className="font-medium text-foreground">Como funciona</p>
        <ul className="space-y-1">
          <li>→ 5 perguntas geradas automaticamente todo dia às 0h</li>
          <li>→ +2 pontos por resposta correta (máximo 10 pts/dia)</li>
          <li>→ Compartilhe seu resultado como no Wordle</li>
          <li>→ Pontos contam para o{' '}
            <a href="/ranking" className="text-green-600 hover:underline">ranking geral</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
