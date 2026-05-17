'use client'

import { useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Sparkles, Copy, Download, Check, ChevronDown,
  FileText, Zap, Layers, MessageSquare, BarChart2,
  Wand2, AlertCircle, RotateCcw, Type, LayoutGrid,
} from 'lucide-react'

const TONES = ['Startup','Professional','Luxury','Playful','Minimalist','Technical','Conversational','Bold','Gen Z','Enterprise']
const INDUSTRIES = ['SaaS','Fintech','Health','E-commerce','Education','Agency','AI / ML','Dev Tools','Consumer App','B2B']

const SECTIONS = [
  { id: 'hero',       label: 'Hero section',    icon: Zap },
  { id: 'full',       label: 'Full website',     icon: FileText },
  { id: 'features',   label: 'Features',         icon: Layers },
  { id: 'problem',    label: 'Problem',          icon: AlertCircle },
  { id: 'cta',        label: 'CTA variations',   icon: BarChart2 },
  { id: 'faq',        label: 'FAQ',              icon: MessageSquare },
  { id: 'onboarding', label: 'Onboarding',       icon: Sparkles },
  { id: 'microcopy',  label: 'Microcopy',        icon: Wand2 },
]

const REWRITE_MODES = [
  { id: 'improve',    label: 'Improve' },
  { id: 'shorter',    label: 'Shorter' },
  { id: 'persuasive', label: 'Persuasive' },
  { id: 'premium',    label: 'Premium' },
  { id: 'emotional',  label: 'Emotional' },
  { id: 'direct',     label: 'Direct' },
  { id: 'playful',    label: 'Playful' },
  { id: 'startup',    label: 'Startup' },
  { id: 'technical',  label: 'Technical' },
]

const REWRITE_CHIPS = ['Shorter','More premium','More emotional','More direct','Startup tone','Technical','Luxury','Gen Z']

const DEMO = {
  brandName: 'Stackr', tone: 'Startup', industry: 'SaaS',
  whatItDoes: 'Replaces daily standups with 2-minute AI-generated team digests',
  targetAudience: 'Engineering leads managing remote teams of 5–25 people',
  mainProblem: 'Remote teams waste 45 minutes every day in standups that could be a 2-minute read',
  keyFeatures: 'AI daily digests, blocker detection, async video updates, mood tracking',
  usp: 'The only tool that replaces your standup with a 2-min AI digest your whole team reads',
  ctaGoal: 'Free trial signup', competitors: 'Linear, Notion, Asana', seoKeywords: '',
}

const EMPTY = {
  brandName:'', whatItDoes:'', targetAudience:'', mainProblem:'',
  keyFeatures:'', usp:'', tone:'Startup', industry:'SaaS',
  ctaGoal:'', competitors:'', seoKeywords:'',
}

// ─── Tiny reusable components ───────────────────────────────────────────────

const I = (style?: React.CSSProperties): React.CSSProperties => ({
  width: '100%', padding: '7px 10px', borderRadius: 7,
  border: '0.5px solid var(--border)', background: 'var(--bg)',
  color: 'var(--text)', fontFamily: 'var(--font)', fontSize: 13.5,
  fontWeight: 400, letterSpacing: '-0.02em', outline: 'none',
  transition: 'border-color .15s, box-shadow .15s', ...style,
})

const TopBtn = ({ children, primary, onClick }: { children: React.ReactNode; primary?: boolean; onClick?: () => void }) => (
  <button onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '5px 12px', borderRadius: 7,
    border: primary ? 'none' : '0.5px solid var(--border-2)',
    background: primary ? 'var(--ink)' : 'transparent',
    color: primary ? 'var(--bg)' : 'var(--text-2)',
    fontFamily: 'var(--font)', fontSize: 13, fontWeight: primary ? 500 : 400,
    letterSpacing: '-0.02em', cursor: 'pointer', whiteSpace: 'nowrap' as const,
  }}>
    {children}
  </button>
)

const SmallBtn = ({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) => (
  <button onClick={onClick} disabled={disabled} style={{
    display: 'flex', alignItems: 'center', gap: 4,
    padding: '4px 10px', borderRadius: 6,
    border: '0.5px solid var(--border-2)', background: 'transparent',
    color: 'var(--text-2)', fontFamily: 'var(--font)', fontSize: 12,
    fontWeight: 400, letterSpacing: '-0.02em', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
  }}>
    {children}
  </button>
)

const SectionRule = ({ label }: { label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '28px 0 14px' }}>
    <span style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '0.06em', color: 'var(--text-3)', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const }}>
      {label}
    </span>
    <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
  </div>
)

// ─── Output renderer ─────────────────────────────────────────────────────────

function renderOutput(text: string) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '28px 0 14px' }}>
        <span style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '0.06em', color: 'var(--text-3)', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const }}>
          {line.replace('## ', '')}
        </span>
        <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
      </div>
    )
    if (line.startsWith('### ')) return (
      <p key={i} style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-0.03em', color: 'var(--text)', margin: '16px 0 6px' }}>
        {line.replace('### ', '')}
      </p>
    )
    if (line.startsWith('> ')) return (
      <div key={i} style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--text-2)', padding: '11px 14px', borderRadius: 8, margin: '8px 0', background: 'var(--accent-bg)', borderLeft: '2px solid var(--accent)', letterSpacing: '-0.015em' }}>
        {line.replace('> ', '')}
      </div>
    )
    if (line.startsWith('**') && line.endsWith('**')) return (
      <p key={i} style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.045em', lineHeight: 1.1, color: 'var(--text)', margin: '6px 0' }}>
        {line.replace(/\*\*/g, '')}
      </p>
    )
    if (line.startsWith('- ')) return (
      <div key={i} style={{ display: 'flex', gap: 8, margin: '3px 0' }}>
        <span style={{ color: 'var(--accent)', marginTop: 4, fontSize: 10, flexShrink: 0 }}>●</span>
        <span style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.6, letterSpacing: '-0.02em' }}>
          {line.replace('- ', '')}
        </span>
      </div>
    )
    if (line.match(/^\d\./)) return (
      <p key={i} style={{ fontSize: 15, color: 'var(--text-2)', margin: '3px 0 3px 4px', lineHeight: 1.6, letterSpacing: '-0.02em' }}>{line}</p>
    )
    if (!line.trim()) return <div key={i} style={{ height: 6 }} />

    const parts = line.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.65, margin: '2px 0', letterSpacing: '-0.022em' }}>
        {parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j} style={{ color: 'var(--text)', fontWeight: 500 }}>{p.replace(/\*\*/g, '')}</strong>
            : p
        )}
      </p>
    )
  })
}

// ─── Main workspace ───────────────────────────────────────────────────────────

function Workspace() {
  const params = useSearchParams()
  const [tab, setTab] = useState<'generate' | 'rewrite'>('generate')
  const [section, setSection] = useState('hero')
  const [rewriteMode, setRewriteMode] = useState('improve')
  const [showAdv, setShowAdv] = useState(false)
  const [form, setForm] = useState(params.get('demo') === 'true' ? DEMO : EMPTY)
  const [existingCopy, setExistingCopy] = useState('')
  const [output, setOutput] = useState('')
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const outRef = useRef<HTMLDivElement>(null)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const val = (k: string) => (form as Record<string, string>)[k] || ''

  const generate = async () => {
    if (!form.brandName || !form.whatItDoes) { setError('Brand name and description required.'); return }
    setError(''); setGenerating(true); setOutput('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: { ...form, rewriteMode }, mode: tab === 'rewrite' ? 'rewrite' : section, existingCopy: tab === 'rewrite' ? existingCopy : undefined }),
      })
      if (!res.ok) throw new Error()
      const reader = res.body?.getReader(); const dec = new TextDecoder()
      if (!reader) throw new Error()
      let acc = ''
      while (true) {
        const { done, value } = await reader.read(); if (done) break
        acc += dec.decode(value, { stream: true }); setOutput(acc)
        if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight
      }
    } catch { setError('Generation failed. Check ANTHROPIC_API_KEY is set in .env.local') }
    finally { setGenerating(false) }
  }

  const copyAll = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const exportTxt = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([output], { type: 'text/plain' }))
    a.download = `${form.brandName || 'copy'}-copycraft.txt`; a.click()
  }

  const fieldStyle: React.CSSProperties = { marginBottom: 9 }
  const labelStyle: React.CSSProperties = { fontSize: 10.5, fontWeight: 500, letterSpacing: '0.04em', color: 'var(--text-3)', marginBottom: 4, textTransform: 'uppercase', display: 'block' }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', fontFamily: 'var(--font)' }}>

      {/* ── Topbar ── */}
      <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '0.5px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, background: 'var(--ink)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Type size={12} color="var(--bg)" strokeWidth={2} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.04em', color: 'var(--text)' }}>CopyCraft</span>
        </div>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: '0.5px solid var(--border-2)', color: 'var(--text-2)', fontSize: 13, fontWeight: 400, letterSpacing: '-0.02em', textDecoration: 'none' }}>
            <LayoutGrid size={12} />Projects
          </Link>
          {output && <>
            <TopBtn onClick={copyAll}>{copied ? <Check size={12} /> : <Copy size={12} />}{copied ? 'Copied' : 'Copy all'}</TopBtn>
            <TopBtn onClick={exportTxt}><Download size={12} />Export</TopBtn>
          </>}
          <TopBtn primary onClick={generate}><Sparkles size={12} />Generate</TopBtn>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '224px 1fr', overflow: 'hidden' }}>

        {/* Sidebar */}
        <div style={{ borderRight: '0.5px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-2)' }}>

          {/* Segmented control */}
          <div style={{ padding: '12px 12px 0', flexShrink: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: 'var(--bg-3)', padding: 2, borderRadius: 8, marginBottom: 12 }}>
              {(['generate', 'rewrite'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  fontFamily: 'var(--font)', fontSize: 13, letterSpacing: '-0.02em',
                  fontWeight: tab === t ? 500 : 400, padding: '5px 0',
                  borderRadius: 6, border: 'none',
                  background: tab === t ? 'var(--bg)' : 'transparent',
                  color: tab === t ? 'var(--text)' : 'var(--text-3)',
                  cursor: 'pointer', textTransform: 'capitalize' as const,
                  boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,.06)' : 'none',
                  transition: 'all .15s',
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px 12px' }}>
            {tab === 'generate' ? (
              <>
                <p style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '0.05em', color: 'var(--text-3)', margin: '2px 2px 4px', textTransform: 'uppercase' as const }}>Section</p>
                {SECTIONS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setSection(id)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                    padding: '7px 9px', borderRadius: 8, border: 'none',
                    background: section === id ? 'var(--bg)' : 'transparent',
                    color: section === id ? 'var(--text)' : 'var(--text-2)',
                    fontFamily: 'var(--font)', fontSize: 14.5, fontWeight: section === id ? 500 : 400,
                    letterSpacing: '-0.022em', cursor: 'pointer', textAlign: 'left' as const,
                    marginBottom: 1, transition: 'background .1s',
                  }}>
                    <Icon size={14} color={section === id ? 'var(--accent)' : 'var(--text-3)'} />
                    {label}
                  </button>
                ))}

                <div style={{ height: '0.5px', background: 'var(--border)', margin: '10px 2px' }} />
                <p style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '0.05em', color: 'var(--text-3)', margin: '0 2px 8px', textTransform: 'uppercase' as const }}>Product</p>

                {/* Required fields */}
                {[
                  { k: 'brandName',     label: 'Brand name',      placeholder: 'e.g. Stackr',                req: true  },
                  { k: 'whatItDoes',    label: 'What it does',     placeholder: 'Describe in 1–2 sentences…', req: true, ta: true },
                  { k: 'targetAudience',label: 'Target audience',  placeholder: 'Who uses it?'                },
                  { k: 'mainProblem',   label: 'Problem solved',   placeholder: 'What pain does it fix?'      },
                  { k: 'usp',           label: 'Unique edge',      placeholder: 'What makes it different?'    },
                ].map(({ k, label, placeholder, req, ta }) => (
                  <div key={k} style={fieldStyle}>
                    <label style={labelStyle}>{label}{req && <span style={{ color: 'var(--accent)', marginLeft: 2 }}>*</span>}</label>
                    {ta
                      ? <textarea style={I({ minHeight: 54, resize: 'none', lineHeight: 1.5 })} placeholder={placeholder} value={val(k)} onChange={e => set(k, e.target.value)} />
                      : <input style={I()} placeholder={placeholder} value={val(k)} onChange={e => set(k, e.target.value)} />
                    }
                  </div>
                ))}

                <div style={fieldStyle}>
                  <label style={labelStyle}>Tone</label>
                  <select style={I()} value={form.tone} onChange={e => set('tone', e.target.value)}>
                    {TONES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 9 }}>
                  <div>
                    <label style={labelStyle}>Industry</label>
                    <select style={I()} value={form.industry} onChange={e => set('industry', e.target.value)}>
                      {INDUSTRIES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>CTA goal</label>
                    <input style={I()} placeholder="Free trial" value={val('ctaGoal')} onChange={e => set('ctaGoal', e.target.value)} />
                  </div>
                </div>

                <button onClick={() => setShowAdv(!showAdv)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font)', letterSpacing: '-0.01em', padding: '2px 1px' }}>
                  <ChevronDown size={11} style={{ transform: showAdv ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                  More options
                </button>

                {showAdv && (
                  <div style={{ marginTop: 10 }}>
                    {[
                      { k: 'keyFeatures', label: 'Key features',  placeholder: 'List features…', ta: true },
                      { k: 'competitors', label: 'Competitors',   placeholder: 'e.g. Notion, Linear' },
                      { k: 'seoKeywords', label: 'SEO keywords',  placeholder: 'Target keywords…' },
                    ].map(({ k, label, placeholder, ta }) => (
                      <div key={k} style={fieldStyle}>
                        <label style={labelStyle}>{label}</label>
                        {ta
                          ? <textarea style={I({ minHeight: 50, resize: 'none' })} placeholder={placeholder} value={val(k)} onChange={e => set(k, e.target.value)} />
                          : <input style={I()} placeholder={placeholder} value={val(k)} onChange={e => set(k, e.target.value)} />
                        }
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <p style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '0.05em', color: 'var(--text-3)', margin: '2px 2px 6px', textTransform: 'uppercase' as const }}>Style</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 12 }}>
                  {REWRITE_MODES.map(m => (
                    <button key={m.id} onClick={() => setRewriteMode(m.id)} style={{
                      fontFamily: 'var(--font)', fontSize: 13, fontWeight: 400, letterSpacing: '-0.02em',
                      padding: '6px 8px', borderRadius: 7, cursor: 'pointer', transition: 'all .12s',
                      border: rewriteMode === m.id ? '0.5px solid var(--accent-border)' : '0.5px solid var(--border)',
                      background: rewriteMode === m.id ? 'var(--accent-bg)' : 'transparent',
                      color: rewriteMode === m.id ? 'var(--accent)' : 'var(--text-2)',
                    }}>
                      {m.label}
                    </button>
                  ))}
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Paste your copy <span style={{ color: 'var(--accent)' }}>*</span></label>
                  <textarea style={I({ minHeight: 130, resize: 'none', lineHeight: 1.55 })} placeholder="Paste copy to improve…" value={existingCopy} onChange={e => setExistingCopy(e.target.value)} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Brand name</label>
                  <input style={I()} placeholder="Optional context…" value={val('brandName')} onChange={e => set('brandName', e.target.value)} />
                </div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Tone</label>
                  <select style={I()} value={form.tone} onChange={e => set('tone', e.target.value)}>
                    {TONES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </>
            )}

            {error && (
              <div style={{ marginTop: 10, padding: '9px 11px', borderRadius: 8, fontSize: 13, background: 'rgba(239,68,68,.07)', border: '0.5px solid rgba(239,68,68,.2)', color: '#ef4444', lineHeight: 1.5, letterSpacing: '-0.01em' }}>
                {error}
              </div>
            )}
          </div>

          {/* Generate CTA */}
          <div style={{ padding: 10, borderTop: '0.5px solid var(--border)', flexShrink: 0 }}>
            <button onClick={generate} disabled={generating} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '9px', borderRadius: 9, border: 'none',
              background: generating ? 'var(--bg-3)' : 'var(--ink)',
              color: generating ? 'var(--text-2)' : 'var(--bg)',
              fontFamily: 'var(--font)', fontSize: 14.5, fontWeight: 500,
              letterSpacing: '-0.03em', cursor: generating ? 'not-allowed' : 'pointer',
              transition: 'all .15s',
            }}>
              {generating
                ? <span className="dots" style={{ display: 'flex', alignItems: 'center' }}><span /><span /><span /></span>
                : <Sparkles size={14} />
              }
              {generating ? 'Generating…' : tab === 'rewrite' ? 'Rewrite copy' : 'Generate copy'}
            </button>
          </div>
        </div>

        {/* Output panel */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {output ? (
            <>
              <div style={{ height: 42, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '0.5px solid var(--border)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, letterSpacing: '-0.02em', color: 'var(--text-2)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: generating ? 'var(--accent)' : '#22c55e' }} />
                  {form.brandName} &nbsp;·&nbsp; {SECTIONS.find(s => s.id === section)?.label} &nbsp;·&nbsp; {form.tone}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <SmallBtn onClick={generate} disabled={generating}><RotateCcw size={11} />Regen</SmallBtn>
                  <SmallBtn onClick={copyAll}>{copied ? <Check size={11} /> : <Copy size={11} />}{copied ? 'Copied' : 'Copy'}</SmallBtn>
                  <SmallBtn onClick={exportTxt}><Download size={11} />.txt</SmallBtn>
                </div>
              </div>
              <div ref={outRef} style={{ flex: 1, overflowY: 'auto', padding: '36px 36px 56px' }}>
                <div style={{ maxWidth: 580 }}>
                  {renderOutput(output)}
                  {generating && <span style={{ display: 'inline-block', width: 2, height: 18, background: 'var(--accent)', marginLeft: 3, verticalAlign: 'middle', animation: 'blink .9s step-end infinite' }} />}
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
              <div style={{ textAlign: 'center', maxWidth: 300 }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, margin: '0 auto 16px', background: 'var(--bg-2)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} color="var(--accent)" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.04em', color: 'var(--text)', marginBottom: 8 }}>
                  Ready to generate
                </h2>
                <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.6, letterSpacing: '-0.02em', marginBottom: 24 }}>
                  Fill in your product details, pick a section, and hit Generate.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 7, textAlign: 'left' as const }}>
                  {['Choose a section type', 'Enter product details', 'Click Generate copy', 'Refine and export'].map((s, i) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: 'var(--bg-2)', border: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 500, color: 'var(--accent)' }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: 14, color: 'var(--text-2)', letterSpacing: '-0.02em' }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <span className="dots" style={{ display: 'flex' }}><span /><span /><span /></span>
      </div>
    }>
      <Workspace />
    </Suspense>
  )
}
