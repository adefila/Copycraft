'use client'

import Link from 'next/link'
import { Type, Plus, Clock, FileText, Sparkles, BarChart2, Zap, Wand2, Layers, ArrowRight } from 'lucide-react'

const RECENT = [
  { name: 'Stackr', section: 'Hero section', updated: '2h ago', tone: 'Startup' },
  { name: 'Flowbase', section: 'Full website', updated: 'Yesterday', tone: 'Professional' },
  { name: 'Orbit App', section: 'Onboarding', updated: '3 days ago', tone: 'Playful' },
]

const QUICK = [
  { label: 'Hero section',   icon: Zap,       href: '/workspace?section=hero' },
  { label: 'Full website',   icon: FileText,   href: '/workspace?section=full' },
  { label: 'CTA variations', icon: BarChart2,  href: '/workspace?section=cta' },
  { label: 'Features',       icon: Layers,     href: '/workspace?section=features' },
  { label: 'Microcopy',      icon: Wand2,      href: '/workspace?section=microcopy' },
  { label: 'Try demo',       icon: Sparkles,   href: '/workspace?demo=true' },
]

const F = 'var(--font)'
const row: React.CSSProperties = { display: 'flex', alignItems: 'center' }

export default function Dashboard() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: F, letterSpacing: '-0.025em' }}>

      <header style={{ height: 48, ...row, justifyContent: 'space-between', padding: '0 24px', borderBottom: '0.5px solid var(--border)' }}>
        <div style={{ ...row, gap: 8 }}>
          <div style={{ width: 24, height: 24, background: 'var(--ink)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Type size={12} color="var(--bg)" strokeWidth={2} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.04em', color: 'var(--text)' }}>CopyCraft</span>
        </div>
        <Link href="/workspace" style={{ ...row, gap: 5, padding: '5px 13px', borderRadius: 7, background: 'var(--ink)', color: 'var(--bg)', fontSize: 13, fontWeight: 500, letterSpacing: '-0.025em', textDecoration: 'none' }}>
          <Plus size={13} />New project
        </Link>
      </header>

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '44px 24px' }}>

        <h1 style={{ fontSize: 34, fontWeight: 500, letterSpacing: '-0.045em', color: 'var(--text)', marginBottom: 4 }}>
          Projects
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-2)', marginBottom: 36, letterSpacing: '-0.02em' }}>
          Pick up where you left off, or start something new.
        </p>

        {/* Quick start */}
        <p style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase' as const }}>Quick start</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 36 }}>
          {QUICK.map(({ label, icon: Icon, href }) => (
            <Link key={label} href={href} style={{ padding: '14px 15px', borderRadius: 10, border: '0.5px solid var(--border)', background: 'var(--bg-2)', textDecoration: 'none', display: 'block', transition: 'border-color .15s' }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--bg)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Icon size={13} color="var(--accent)" />
              </div>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.025em' }}>{label}</p>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 36 }}>
          {[['Generations', '24'], ['Projects', '3'], ['Words written', '14k']].map(([label, val]) => (
            <div key={label as string} style={{ padding: '14px 16px', borderRadius: 10, border: '0.5px solid var(--border)', background: 'var(--bg-2)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6, letterSpacing: '-0.01em' }}>{label}</p>
              <p style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.05em', color: 'var(--text)' }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Recent */}
        <p style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: 8, textTransform: 'uppercase' as const }}>Recent</p>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
          {RECENT.map(({ name, section, updated, tone }) => (
            <Link key={name} href="/workspace" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderRadius: 10, border: '0.5px solid var(--border)', background: 'var(--bg-2)', textDecoration: 'none', transition: 'border-color .15s' }}>
              <div style={{ ...row, gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={13} color="var(--accent)" />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.025em' }}>{name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1, letterSpacing: '-0.01em' }}>{section} · {tone}</p>
                </div>
              </div>
              <div style={{ ...row, gap: 8 }}>
                <div style={{ ...row, gap: 4, fontSize: 12, color: 'var(--text-3)', letterSpacing: '-0.01em' }}>
                  <Clock size={11} />{updated}
                </div>
                <ArrowRight size={13} color="var(--text-3)" />
              </div>
            </Link>
          ))}
        </div>

        {/* Tip */}
        <div style={{ marginTop: 24, padding: '13px 15px', borderRadius: 10, background: 'var(--accent-bg)', border: '0.5px solid var(--accent-border)', ...row, gap: 10 }}>
          <Sparkles size={13} color="var(--accent)" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65, letterSpacing: '-0.02em' }}>
            <span style={{ color: 'var(--text)', fontWeight: 500 }}>Tip:</span> The more specific your USP and target audience, the sharper the output. Vague input = generic copy.
          </p>
        </div>

      </main>
    </div>
  )
}
