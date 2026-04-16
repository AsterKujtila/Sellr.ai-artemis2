import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"

export const maxDuration = 30

const SYSTEM_PROMPT = `You are SELLR — an elite AI sales coach built exclusively for Whop sellers.

PERSONALITY: Direct, sharp, warm. Like a world-class sales consultant who genuinely cares. Always give specific, actionable advice.

EXPERTISE: Whop platform, offer copywriting, conversion optimization, pricing strategy, launch planning, store analysis, A/B testing, community growth.

RULES:
- Be hyper-specific, never vague
- Keep responses scannable with short paragraphs
- Give honest critique with exact rewrites when shown copy
- End every response with a clear next action step
- Max 300 words unless asked for more
- Use bullet points and headers for easy scanning
- When analyzing offers, always mention what works AND what needs improvement`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: "anthropic/claude-opus-4.6",
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}
