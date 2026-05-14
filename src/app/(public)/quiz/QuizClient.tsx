'use client'

import { useActionState, useState } from 'react'
import { submitQuiz } from '@/actions/quiz'
import type { QuizQuestion, QuizAnswerRecord } from '@/actions/quiz'

interface Props {
  questions: QuizQuestion[]
  existingAnswer: QuizAnswerRecord | null
  quizDate: string
  isLoggedIn: boolean
}

type SubmitResult = Awaited<ReturnType<typeof submitQuiz>>

function buildShareText(correct: number, total: number, results: boolean[], date: string): string {
  const [year, month, day] = date.split('-')
  const dateStr = `${day}/${month}`
  const squares = results.map((r) => (r ? '🟢' : '❌')).join('')
  return `OddsBR Quiz ${dateStr} 🏆\n${squares}\n${correct}/${total} acertos\noddsbr.com.br/quiz`
}

function ShareButton({
  correct,
  total,
  results,
  quizDate,
}: {
  correct: number
  total: number
  results: boolean[]
  quizDate: string
}) {
  const [copied, setCopied] = useState(false)
  function handle() {
    const text = buildShareText(correct, total, results, quizDate)
    if (navigator.share) {
      navigator.share({ text }).catch(() => null)
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }
  return (
    <button
      onClick={handle}
      className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
    >
      {copied ? '✓ Copiado!' : 'Compartilhar resultado'}
    </button>
  )
}

function ReviewList({
  questions,
  userAnswers,
  correctAnswers,
  explanations,
}: {
  questions: QuizQuestion[]
  userAnswers: string[]
  correctAnswers: string[]
  explanations: string[]
}) {
  return (
    <div className="space-y-4">
      {questions.map((q, i) => {
        const correct = userAnswers[i] === correctAnswers[i]
        return (
          <div
            key={q.id}
            className={`rounded-xl border p-4 space-y-2 ${
              correct ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="shrink-0">{correct ? '🟢' : '❌'}</span>
              <p className="font-medium text-sm">{q.question}</p>
            </div>
            <div className="space-y-1 ml-6">
              {q.options.map((opt) => {
                const isCorrect = opt === correctAnswers[i]
                const isChosen = opt === userAnswers[i]
                return (
                  <div
                    key={opt}
                    className={`text-sm px-3 py-1.5 rounded-lg ${
                      isCorrect
                        ? 'bg-green-500/20 text-green-700 dark:text-green-400 font-medium'
                        : isChosen && !isCorrect
                        ? 'bg-red-500/20 text-red-700 dark:text-red-400 line-through'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {opt}
                    {isCorrect && ' ✓'}
                  </div>
                )
              })}
            </div>
            {explanations[i] && (
              <p className="text-xs text-muted-foreground ml-6 pt-1 border-t">{explanations[i]}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

function AlreadyAnswered({
  answer,
  questions,
  quizDate,
}: {
  answer: QuizAnswerRecord
  questions: QuizQuestion[]
  quizDate: string
}) {
  const userAnswers = answer.answers as string[]
  const results = questions.map((q, i) => userAnswers[i] === q.answer)

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6 text-center space-y-3">
        <p className="text-sm text-muted-foreground">Resultado de hoje</p>
        <div className="text-4xl font-bold text-green-500">
          {answer.correct_count}/{questions.length}
        </div>
        <div className="flex justify-center gap-1 text-2xl">
          {results.map((r, i) => (
            <span key={i}>{r ? '🟢' : '❌'}</span>
          ))}
        </div>
        {answer.points_earned > 0 && (
          <p className="text-sm text-green-600 font-medium">+{answer.points_earned} pontos ganhos</p>
        )}
        <ShareButton correct={answer.correct_count} total={questions.length} results={results} quizDate={quizDate} />
      </div>
      <ReviewList
        questions={questions}
        userAnswers={userAnswers}
        correctAnswers={questions.map((q) => q.answer)}
        explanations={questions.map((q) => q.explanation)}
      />
    </div>
  )
}

export default function QuizClient({ questions, existingAnswer, quizDate, isLoggedIn }: Props) {
  const [selected, setSelected] = useState<string[]>(Array(questions.length).fill(''))
  const [state, action, pending] = useActionState<SubmitResult, FormData>(submitQuiz, undefined)

  if (existingAnswer) {
    return <AlreadyAnswered answer={existingAnswer} questions={questions} quizDate={quizDate} />
  }

  if (state && 'correct_count' in state) {
    const results = questions.map((q, i) => selected[i] === q.answer)
    return (
      <div className="space-y-6">
        <div className="rounded-xl border bg-card p-6 text-center space-y-3">
          <div className="text-4xl font-bold text-green-500">
            {state.correct_count}/{state.total}
          </div>
          <p className="text-muted-foreground text-sm">acertos de hoje</p>
          {state.points_earned > 0 && (
            <p className="font-semibold text-green-600">+{state.points_earned} pontos ganhos!</p>
          )}
          <div className="flex justify-center gap-1 text-2xl">
            {state.results.map((r, i) => (
              <span key={i}>{r ? '🟢' : '❌'}</span>
            ))}
          </div>
          <ShareButton correct={state.correct_count} total={state.total} results={state.results} quizDate={quizDate} />
        </div>
        <ReviewList
          questions={questions}
          userAnswers={selected}
          correctAnswers={state.correct_answers}
          explanations={state.explanations}
        />
      </div>
    )
  }

  return (
    <form action={action} className="space-y-6">
      {questions.map((q, i) => (
        <div key={q.id} className="rounded-xl border bg-card p-5 space-y-3">
          <p className="font-medium text-sm">
            <span className="text-muted-foreground mr-2">{i + 1}.</span>
            {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm cursor-pointer hover:bg-muted/50 has-[:checked]:border-green-500 has-[:checked]:bg-green-500/10 transition-colors"
              >
                <input
                  type="radio"
                  name={`q${i}`}
                  value={opt}
                  required
                  checked={selected[i] === opt}
                  onChange={() => {
                    const next = [...selected]
                    next[i] = opt
                    setSelected(next)
                  }}
                  className="accent-green-500"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {state && 'error' in state && (
        <p className="text-sm text-red-500 text-center">{state.error}</p>
      )}

      {isLoggedIn ? (
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-3 text-sm transition-colors"
        >
          {pending ? 'Enviando...' : 'Enviar respostas'}
        </button>
      ) : (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 text-center text-sm space-y-2">
          <p className="text-yellow-700 dark:text-yellow-400 font-medium">
            Faça login para ganhar pontos
          </p>
          <a href="/login" className="inline-flex items-center gap-1 text-green-600 hover:underline font-medium">
            Entrar →
          </a>
        </div>
      )}
    </form>
  )
}
