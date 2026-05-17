import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const runtime = 'edge'
export const maxDuration = 60

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You are CopyCraft — an elite AI UX copywriter and conversion strategist.

Rules:
- Clarity over cleverness. If it needs explaining, rewrite it.
- Specific beats generic. "Save 3 hours/day" beats "save time."
- Lead with outcome, not product.
- Cut ruthlessly. Every word earns its place.
- Never open with the product name.

Never use: revolutionize, game-changing, unleash, empower, leverage, synergy, seamlessly, effortlessly, all-in-one, streamline, robust, transformative, innovative, cutting-edge, world-class

Format:
- ## SECTION NAME for headers
- **text** for headline options  
- > for strategic notes
- - for lists
- Always end sections with a > strategic note`

function buildPrompt(data: Record<string, string>, mode: string, existing?: string) {
  const ctx = `Brand: ${data.brandName || '—'}
What it does: ${data.whatItDoes || '—'}
Audience: ${data.targetAudience || '—'}
Problem: ${data.mainProblem || '—'}
Features: ${data.keyFeatures || '—'}
USP: ${data.usp || '—'}
Tone: ${data.tone || 'Startup'}
Industry: ${data.industry || 'SaaS'}
CTA goal: ${data.ctaGoal || 'Free trial'}`

  const sections: Record<string, string> = {
    hero: `Generate a hero section:
- 3 headline variations (bold claim / outcome-led / question)
- 2 subheadline options
- 2 primary CTA button labels (outcome-focused)
- 1 trust statement
- 1 badge/eyebrow text
Include a > strategic note on why each choice works.`,

    full: `Generate complete website copy:
1. Hero — 3 headlines, subheadline, 2 CTAs, trust statement
2. Social Proof — 3 testimonials, 3 stats
3. Problem — problem headline + 4 pain points
4. Solution — product intro + value prop
5. Features — 5 features: title, description, benefit
6. How It Works — 3 steps
7. FAQ — 6 Q&As
8. Final CTA — headline + subtext + button copy
Include strategic notes throughout.`,

    features: `Generate a features section:
- Section headline + subheadline
- 6 features each with: 2–4 word title, one-sentence description, key benefit
- > strategic note`,

    problem: `Generate a problem section:
- Problem headline (empathetic, specific)
- 4 pain points with emotional language
- Transition sentence to the solution
- > strategic note`,

    cta: `Generate 8 CTA button variations grouped by trigger:
- Urgency (2), Outcome (2), Curiosity (2), Risk Reversal (2)
- Explain the psychology of each group`,

    faq: `Generate an FAQ section:
- Section headline
- 8 real customer questions (product, pricing, trust, objections)
- Direct, confident answers — no "Great question!"
- > strategic note`,

    onboarding: `Generate onboarding flow copy:
- Welcome screen: headline + subtext + CTA
- Steps 1–3: title + instruction
- 3 empty state messages
- 3 push notification suggestions
- 2 success messages
- > strategic note`,

    microcopy: `Generate UI microcopy:
- 8 form labels + placeholder text
- 5 error messages (validation, server, empty, timeout, not-found)
- 5 success messages
- 10 button label variations
- 5 tooltip examples
- 3 loading state messages
- > strategic note`,
  }

  if (mode === 'rewrite' && existing) {
    const styles: Record<string, string> = {
      shorter:    'Rewrite 40–50% shorter. Every word must earn its place.',
      persuasive: 'Rewrite to be more persuasive — specific, outcome-led, objection-handling.',
      premium:    'Rewrite for a premium brand — confident, refined, zero hype.',
      emotional:  'Rewrite with emotional resonance — before/after contrast, vivid specifics.',
      direct:     'Rewrite more directly — cut all preamble, lead with the point.',
      playful:    'Rewrite with warmth and personality — light, energetic, not silly.',
      startup:    'Rewrite in startup tone — confident, irreverent, sharp.',
      technical:  'Rewrite for technical audiences — precise, detailed, credibility-first.',
      improve:    'Improve this copy — sharpen the hook, fix weak spots, raise conversion.',
    }
    return `${styles[data.rewriteMode || 'improve']}

Context:
${ctx}

Original copy:
${existing}

Provide:
1. Rewritten version
2. 2 alternative variations
3. > specific notes on what changed and why`
  }

  return `${sections[mode] || sections.hero}

Context:
${ctx}`
}

export async function POST(req: NextRequest) {
  try {
    const { formData, mode, existingCopy } = await req.json()
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYSTEM,
      messages: [{ role: 'user', content: buildPrompt(formData || {}, mode || 'hero', existingCopy) }],
    })
    const enc = new TextEncoder()
    return new Response(
      new ReadableStream({
        async start(ctrl) {
          try {
            for await (const chunk of stream) {
              if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta')
                ctrl.enqueue(enc.encode(chunk.delta.text))
            }
            ctrl.close()
          } catch (e) { ctrl.error(e) }
        }
      }),
      { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' } }
    )
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: 'Generation failed' }), { status: 500 })
  }
}
