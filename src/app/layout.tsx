import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Advait Parab — AI Enabler & AI Product Builder',
  description: 'AI Enabler at Netcore Cloud. I build AI products and automations that teams adopt—outcome-first UX, fast time-to-value, measurable impact.',
  keywords: ['AI Enabler', 'AI Product Builder', 'Automation', 'Netcore Cloud', 'LLM', 'Workflow Automation'],
  openGraph: {
    title: 'Advait Parab — AI Enabler & AI Product Builder',
    description: 'AI Enabler at Netcore Cloud. I build AI products and automations that teams adopt—outcome-first UX, fast time-to-value, measurable impact.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advait Parab — AI Enabler & AI Product Builder',
    description: 'AI Enabler at Netcore Cloud. I build AI products and automations that teams adopt.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
