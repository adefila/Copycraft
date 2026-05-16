import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const runtime = 'edge'
export const maxDuration = 60

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function systemPrompt() {
  return `You are CopyCraft — an elite AI UX copywriter and conversion strategist with the instincts of a senior product writer and the precision of a CRO specialist.

Your copy rules:
- Clarity over cleverness. If it needs explaining, rewrite it.
- Every word earns its place. Cut ruthlessly.
- Specific beats generic. "Save 3 hours/day" beats "save time."
- Emotion drives decisions, logic justifies them.
- Lead with outcome, not product. Never open with the product name.

Forbidden words — never use these:
revolutionize, game-changing, next-level, unleash, empower, leverage, synergy, world-class, cutting-edge, state-of-the-art, innovative, seamlessly, effortlessly, all-in-one, streamline, robust, transformative, unlock

Output format:
- Use ## SECTION NAME for section headers
- Use **text** for headline options
- Use > for strategic callout notes
- Use - for list items
- Provide exactly 3 variations when asked
- Always end each section with a > strategic note explaining WHY the copy works`
}

function userPrompt(data: Record<string, string>, mode: string, existingCopy?: string) {
  const ctx = `Brand: ${data.brandName || '—'}
What it does: ${data.whatItDoes || '—'}
Target audience: ${data.targetAudience || '—'}
Problem solved: ${data.mainProblem || '—'}
Key features: ${data.keyFeatures || '—'}
USP: ${data.usp || '—'}
Tone: ${data.tone || 'Startup'}
Industry: ${data.industry || 'SaaS'}
Site type: ${data.websiteType || 'SaaS'}
CTA goal: ${data.ctaGoal || 'Free trial'}
Competitors: ${data.competitors || '—'}
SEO keywords: ${data.seoKeywords || '—'}`

  const sections: Record<string, string> = {
    full: `Generate complete website copy with all major sections:
1. Hero — 3 headline variations, subheadline, 2 CTAs, trust statement
2. Social Proof — 3 testimonials, 3 stat callouts
3. Problem — main problem + 4 pain points
4. Solution — product intro + value prop
5. Features — 5 features: title, description, benefit
6. How It Works — 3 steps
7. FAQ — 6 questions + answers
8. Final CTA — headline + subtext + button
Include strategic notes throughout.`,

    hero: `Generate a hero section:
- 3 headline variations (bold claim / outcome-led / question-based)
- 2 subheadline options
- 2 primary CTA button labels
- 1 trust statement
- 1 badge/eyebrow text
Strategic notes on why each choice works.`,

    features: `Generate a features section:
- Section headline + subheadline
- 6 features each with: 2–4 word title, one-sentence description, key benefit
Strategic notes included.`,

    problem: `Generate a problem section:
- Main problem headline (empathetic, not accusatory)
- 4 specific pain points with emotional language
- Transition to solution
Strategic notes included.`,

    cta: `Generate 8 CTA button variations grouped by psychological trigger:
- Urgency (2)
- Outcome/Value (2)
- Curiosity (2)
- Risk Reversal (2)
Explain the psychology of each group.`,

    faq: `Generate an FAQ section:
- Section headline
- 8 real customer questions mixing product, pricing, trust, and objections
- Direct, confident answers — no "Great question!"
Strategic notes on why these questions matter.`,

    pricing: `Generate pricing copy:
- Section headline + subtext
- 3 plan names with positioning taglines
- Feature list copy per tier
- 2 CTA variations per plan
- Money-back guarantee copy
Strategic notes included.`,

    onboarding: `Generate onboarding flow copy:
- Welcome screen: headline + subtext + CTA
- Steps 1–3: title + instruction each
- 3 empty state messages
- 3 push notification suggestions
- 2 success messages
Strategic notes included.`,

    microcopy: `Generate UI microcopy:
- 8 form labels + placeholder text
- 5 error messages (validation, server, empty, timeout, not found)
- 5 success messages
- 10 button label variations
- 5 tooltip examples
- 3 loading state messages
Strategic notes on microcopy best practices.`,
  }

  if (mode === 'rewrite' && existingCopy) {
    const styles: Record<string, string> = {
      shorter: 'Rewrite 40–50% shorter. Every word must earn its place.',
      persuasive: 'Rewrite to be more persuasive — add specificity, address objections, use outcome language.',
      premium: 'Rewrite for a premium brand — confident, refined, no hype.',
      emotional: 'Rewrite with emotional resonance — before/after contrast, vivid language.',
      direct: 'Rewrite more directly — cut all preamble, lead with the point immediately.',
      playful: 'Rewrite with personality — light, warm, energetic but not silly.',
      startup: 'Rewrite in startup tone — confident, slightly irreverent, sharp.',
      technical: 'Rewrite for a technical audience — precise, detailed, credibility-first.',
      improve: 'Improve this copy — sharpen the hook, fix the weakest parts, increase clarity and conversion potential.',
    }
    return `${styles[data.rewriteMode || 'improve']}

Product context:
${ctx}

Original copy:
${existingCopy}

Provide:
1. Rewritten version
2. 2 alternative variations
3. Specific notes on what changed and why`
  }

  return `${sections[mode] || sections.hero}

Product context:
${ctx}`
}

export async function POST(req: NextRequest) {
  try {
    const { formData, mode, existingCopy } = await req.json()

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt(),
      messages: [{ role: 'user', content: userPrompt(formData || {}, mode || 'hero', existingCopy) }],
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
          controller.close()
        } catch (e) { controller.error(e) }
      }
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' }
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: 'Generation failed' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }
}
