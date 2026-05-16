import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CopyCraft — AI UX Copywriting',
  description: 'Generate conversion-focused copy for websites, landing pages, and apps.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
