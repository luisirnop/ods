'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

// ─── Tipos ───────────────────────────────────────────────────────────────────

type Tab = 'kelly' | 'paper'

interface PaperBet {
  id: string
  date: string
  description: string
  odds: number
  amount: number
  result: 'win' | 'loss' | 'pending'
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PAPER_KEY = 'oddsbr_paper_bets'

function brl(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function pct(n: number, decimals = 1) {
  return `${(n * 100).toFixed(decimals)}%`
}

// ─── SVG Line Chart ──────────────────────────────────────────────────────────

function LineChart({ points }: { points: number[] }) {
  if (points.length < 2) return null
  const W = 500
  const H = 160
  const PAD = { top: 8, right: 12, bottom: 24, left: 56 }
  const iW = W - PAD.left - PAD.right
  const iH = H - PAD.top - PAD.bottom

  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1

  const x = (i: number) => PAD.left + (i / (points.length - 1)) * iW
  const y = (v: number) => PAD.top + iH - ((v - min) / range) * iH

  const linePath = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(' ')

  const areaPath =
    `M${x(0).toFixed(1)},${(PAD.top + iH).toFixed(1)} ` +
    points.map((v, i) => `L${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ') +
    ` L${x(points.length - 1).toFixed(1)},${(PAD.top + iH).toFixed(1)} Z`

  const yLabels = [min, (min + max) / 2, max]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {yLabels.map((v, i) => (
        <g key={i}>
          <line
            x1={PAD.left} y1={y(v)}
            x2={W - PAD.right} y2={y(v)}
            stroke="currentColor" strokeOpacity={0.08} strokeDasharray="4 3"
          />
          <text
            x={PAD.left - 6} y={y(v) + 4}
            textAnchor="end" fontSize={9} fill="currentColor" fillOpacity={0.45}
          >
            {v >= 10000 ? `${(v / 1000).toFixed(0)}k` : v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0)}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#chartGrad)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="#22c55e" strokeWidth={2} strokeLinejoin="round" />

      {/* Dots */}
      {[0, Math.round(points.length / 2), points.length - 1].map((i) => (
        <circle key={i} cx={x(i)} cy={y(points[i])} r={3.5} fill="#22c55e" />
      ))}
    </svg>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function CalculadoraClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [tab, setTab] = useState<Tab>('kelly')

  // Kelly inputs
  const [bankroll, setBankroll] = useState(1000)
  const [odds, setOdds] = useState(2.0)
  const [confidence, setConfidence] = useState(55) // %

  // Simulator
  const [numBets, setNumBets] = useState(20)

  // Paper trading
  const [paperBets, setPaperBets] = useState<PaperBet[]>([])
  const [desc, setDesc] = useState('')
  const [pOdds, setPOdds] = useState('')
  const [pAmount, setPAmount] = useState('')

  // Carrega paper bets do localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PAPER_KEY)
      if (raw) setPaperBets(JSON.parse(raw))
    } catch {}
  }, [])

  const savePaperBets = useCallback((bets: PaperBet[]) => {
    setPaperBets(bets)
    localStorage.setItem(PAPER_KEY, JSON.stringify(bets))
  }, [])

  // ── Kelly ──────────────────────────────────────────────────────────────────

  const kelly = useMemo(() => {
    const p = confidence / 100
    const q = 1 - p
    const b = odds - 1
    if (b <= 0) return null
    const fraction = (b * p - q) / b
    const ev = b * p - q
    return {
      fraction,
      halfFraction: fraction / 2,
      betFull: Math.max(0, fraction) * bankroll,
      betHalf: Math.max(0, fraction / 2) * bankroll,
      ev,
      isPositive: fraction > 0,
    }
  }, [bankroll, odds, confidence])

  // ── Simulator ─────────────────────────────────────────────────────────────

  const simPoints = useMemo(() => {
    if (!kelly?.isPositive) return []
    const p = confidence / 100
    const b = odds - 1
    const f = Math.max(0, kelly.halfFraction) // half kelly
    // geometric growth per bet under expected win rate
    const g = Math.pow(1 + f * b, p) * Math.pow(Math.max(0.0001, 1 - f), 1 - p)
    const pts: number[] = [bankroll]
    let cur = bankroll
    for (let i = 0; i < numBets; i++) {
      cur *= g
      pts.push(cur)
    }
    return pts
  }, [bankroll, odds, confidence, numBets, kelly])

  // ── Paper trading ─────────────────────────────────────────────────────────

  function addBet() {
    const o = parseFloat(pOdds)
    const a = parseFloat(pAmount)
    if (!desc || isNaN(o) || isNaN(a) || o <= 1 || a <= 0) return
    const bet: PaperBet = {
      id: `${Date.now()}`,
      date: new Date().toLocaleDateString('pt-BR'),
      description: desc,
      odds: o,
      amount: a,
      result: 'pending',
    }
    savePaperBets([bet, ...paperBets])
    setDesc('')
    setPOdds('')
    setPAmount('')
  }

  function resolvebet(id: string, result: 'win' | 'loss') {
    savePaperBets(paperBets.map((b) => (b.id === id ? { ...b, result } : b)))
  }

  function removeBet(id: string) {
    savePaperBets(paperBets.filter((b) => b.id !== id))
  }

  const resolved = paperBets.filter((b) => b.result !== 'pending')
  const paperPnL = resolved.reduce((sum, b) => {
    return sum + (b.result === 'win' ? b.amount * (b.odds - 1) : -b.amount)
  }, 0)
  const paperInvested = resolved.reduce((sum, b) => sum + b.amount, 0)
  const paperROI = paperInvested > 0 ? (paperPnL / paperInvested) * 100 : 0

  // ── Render ────────────────────────────────────────────────────────────────

  const tabs: { id: Tab; label: string }[] = [
    { id: 'kelly', label: 'Critério de Kelly' },
    { id: 'paper', label: 'Paper Trading' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Calculadora de Banca</h1>
        <p className="text-sm text-muted-foreground">
          Calcule o tamanho ideal de aposta com o Critério de Kelly e simule o crescimento da sua banca.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
              tab === t.id
                ? 'border-green-500 text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Kelly + Simulador ── */}
      {tab === 'kelly' && (
        <div className="space-y-6">
          {/* Inputs */}
          <div className="rounded-xl border bg-card p-5 space-y-5">
            <p className="text-sm font-semibold">Parâmetros da aposta</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Banca total (R$)</label>
                <input
                  type="number"
                  min={1}
                  step={50}
                  value={bankroll}
                  onChange={(e) => setBankroll(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Odds (decimal)</label>
                <input
                  type="number"
                  min={1.01}
                  step={0.05}
                  value={odds}
                  onChange={(e) => setOdds(Math.max(1.01, Number(e.target.value)))}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Confiança: <span className="text-foreground font-bold">{confidence}%</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={99}
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="w-full accent-green-500"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>1%</span>
                  <span>50%</span>
                  <span>99%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resultado Kelly */}
          {kelly ? (
            kelly.isPositive ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Full Kelly */}
                  <div className="rounded-xl border bg-card p-4 space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Kelly Completo</p>
                    <p className="text-2xl font-extrabold text-green-600">{brl(kelly.betFull)}</p>
                    <p className="text-xs text-muted-foreground">{pct(kelly.fraction)} da banca</p>
                  </div>

                  {/* Half Kelly */}
                  <div className="rounded-xl border-2 border-green-500 bg-green-500/5 p-4 space-y-1 relative">
                    <div className="absolute -top-2.5 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      RECOMENDADO
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Kelly Fracionário ½</p>
                    <p className="text-2xl font-extrabold text-green-600">{brl(kelly.betHalf)}</p>
                    <p className="text-xs text-muted-foreground">{pct(kelly.halfFraction)} da banca</p>
                  </div>

                  {/* EV */}
                  <div className="rounded-xl border bg-card p-4 space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Expected Value (EV)</p>
                    <p className="text-2xl font-extrabold text-green-600">
                      +{pct(kelly.ev)}
                    </p>
                    <p className="text-xs text-muted-foreground">por unidade apostada</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground border rounded-lg px-3 py-2 bg-muted/30">
                  <span className="font-semibold">Por que Kelly Fracionário?</span> Usar metade do Kelly completo
                  reduz a volatilidade em 50% com perda mínima de crescimento esperado. Ideal para apostadores com horizonte de longo prazo.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm">
                <p className="font-semibold text-red-600 mb-1">EV negativo — não aposte aqui</p>
                <p className="text-muted-foreground">
                  Com confiança de {confidence}% e odds de {odds.toFixed(2)}, a probabilidade implícita da casa ({pct(1 / odds)}) é maior que a sua estimativa.
                  Só aposte quando seu EV for positivo.
                </p>
              </div>
            )
          ) : null}

          {/* Simulador */}
          {kelly?.isPositive && simPoints.length > 1 && (
            <div className="rounded-xl border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-sm font-semibold">Simulador de banca</p>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground">Apostas:</label>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    step={5}
                    value={numBets}
                    onChange={(e) => setNumBets(Number(e.target.value))}
                    className="w-28 accent-green-500"
                  />
                  <span className="text-xs font-bold w-6 text-right">{numBets}</span>
                </div>
              </div>

              <LineChart points={simPoints} />

              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                {[
                  { label: 'Início', value: simPoints[0] },
                  { label: `Aposta ${Math.round(numBets / 2)}`, value: simPoints[Math.round(numBets / 2)] },
                  { label: `Aposta ${numBets}`, value: simPoints[numBets] },
                ].map(({ label, value }) => (
                  <div key={label} className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-bold text-green-600">{brl(value)}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground border-t pt-3">
                Simulação usando ½ Kelly. Assume taxa de acerto de {confidence}% em todas as apostas — resultado ideal,
                não garantido. A banca real oscila aleatoriamente ao redor desta curva.
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground border-t pt-4">
            Esta calculadora é educacional. Resultados reais dependem da acurácia da sua estimativa de probabilidade.
            Apostas esportivas envolvem risco financeiro. +18.
          </p>
        </div>
      )}

      {/* ── Tab: Paper Trading ── */}
      {tab === 'paper' && (
        <div className="space-y-6">
          {!isLoggedIn && (
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 px-4 py-3 text-sm text-blue-700 dark:text-blue-400">
              Suas apostas ficam salvas neste navegador. <a href="/login" className="font-semibold underline">Entre</a> para sincronizar entre dispositivos em breve.
            </div>
          )}

          {/* Resumo P&L */}
          {resolved.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border bg-card p-4 text-center space-y-0.5">
                <p className="text-xs text-muted-foreground">P&amp;L total</p>
                <p className={cn('text-xl font-extrabold', paperPnL >= 0 ? 'text-green-600' : 'text-red-500')}>
                  {paperPnL >= 0 ? '+' : ''}{brl(paperPnL)}
                </p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-center space-y-0.5">
                <p className="text-xs text-muted-foreground">ROI</p>
                <p className={cn('text-xl font-extrabold', paperROI >= 0 ? 'text-green-600' : 'text-red-500')}>
                  {paperROI >= 0 ? '+' : ''}{paperROI.toFixed(1)}%
                </p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-center space-y-0.5">
                <p className="text-xs text-muted-foreground">Resolvidas</p>
                <p className="text-xl font-extrabold">{resolved.length}/{paperBets.length}</p>
              </div>
            </div>
          )}

          {/* Formulário */}
          <div className="rounded-xl border bg-card p-5 space-y-4">
            <p className="text-sm font-semibold">Registrar aposta simulada</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Descrição</label>
                <input
                  type="text"
                  placeholder="ex: Flamengo vence"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Odds</label>
                <input
                  type="number"
                  min={1.01}
                  step={0.05}
                  placeholder="ex: 2.50"
                  value={pOdds}
                  onChange={(e) => setPOdds(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Valor (R$)</label>
                <input
                  type="number"
                  min={0.01}
                  step={1}
                  placeholder="ex: 50"
                  value={pAmount}
                  onChange={(e) => setPAmount(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>
            </div>
            <button
              onClick={addBet}
              className="rounded-lg bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-semibold transition-colors"
            >
              Adicionar aposta
            </button>
          </div>

          {/* Lista */}
          {paperBets.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              Nenhuma aposta registrada ainda.
            </p>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Aposta</th>
                    <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">Odds</th>
                    <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">Valor</th>
                    <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">P&amp;L</th>
                    <th className="px-3 py-2.5 w-36" />
                  </tr>
                </thead>
                <tbody>
                  {paperBets.map((bet) => {
                    const pnl =
                      bet.result === 'win'
                        ? bet.amount * (bet.odds - 1)
                        : bet.result === 'loss'
                        ? -bet.amount
                        : null
                    return (
                      <tr key={bet.id} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="px-4 py-3">
                          <p className="font-medium truncate max-w-[180px]">{bet.description}</p>
                          <p className="text-xs text-muted-foreground">{bet.date}</p>
                        </td>
                        <td className="px-3 py-3 text-center">{bet.odds.toFixed(2)}</td>
                        <td className="px-3 py-3 text-center">{brl(bet.amount)}</td>
                        <td className="px-3 py-3 text-center font-semibold">
                          {pnl === null ? (
                            <span className="text-muted-foreground">—</span>
                          ) : (
                            <span className={pnl >= 0 ? 'text-green-600' : 'text-red-500'}>
                              {pnl >= 0 ? '+' : ''}{brl(pnl)}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {bet.result === 'pending' ? (
                            <div className="flex gap-1 justify-end">
                              <button
                                onClick={() => resolvebet(bet.id, 'win')}
                                className="rounded px-2 py-1 text-xs font-semibold bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                              >
                                Ganhou
                              </button>
                              <button
                                onClick={() => resolvebet(bet.id, 'loss')}
                                className="rounded px-2 py-1 text-xs font-semibold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                              >
                                Perdeu
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <span
                                className={cn(
                                  'rounded-full px-2 py-0.5 text-[10px] font-bold',
                                  bet.result === 'win'
                                    ? 'bg-green-500/10 text-green-600'
                                    : 'bg-red-500/10 text-red-500'
                                )}
                              >
                                {bet.result === 'win' ? 'GANHOU' : 'PERDEU'}
                              </span>
                              <button
                                onClick={() => removeBet(bet.id)}
                                className="text-muted-foreground hover:text-foreground text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
