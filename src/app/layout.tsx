import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'OddsBR — Comparador de Odds em Tempo Real',
    template: '%s | OddsBR',
  },
  description:
    'Compare odds das melhores casas de apostas do Brasil em tempo real. Palpites, rankings e análises de futebol.',
  keywords: ['odds', 'apostas', 'futebol', 'comparador de odds', 'palpites', 'Brasil'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'OddsBR',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  )
}
