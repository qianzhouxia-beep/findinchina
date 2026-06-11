import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface ContentGenerationParams {
  topic: string
  type: 'blog' | 'newsletter' | 'review' | 'guide'
  keywords?: string[]
  wordCount?: number
  tone?: 'professional' | 'casual' | 'enthusiastic'
  relatedBrand?: string
}

export async function generateContent(params: ContentGenerationParams) {
  const { topic, type, keywords = [], wordCount = 1500, tone = 'professional', relatedBrand } = params

  const prompt = buildPrompt(params)

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const content = message.content[0].type === 'text' ? message.content[0].text : ''

  return {
    title: extractTitle(content),
    body: content,
    excerpt: extractExcerpt(content),
    seoTitle: `${topic} | FindInChina`,
    seoDescription: extractExcerpt(content, 155),
    readTimeMin: Math.ceil(wordCount / 200),
  }
}

function buildPrompt(params: ContentGenerationParams): string {
  const { topic, type, keywords = [], wordCount, tone, relatedBrand } = params

  return `You are the lead content editor at FindInChina, a curated platform for verified Chinese suppliers aimed at international buyers.

Write a ${type} about "${topic}".

Requirements:
1. Approximately ${wordCount} words (English)
2. Tone: ${tone}
3. Must include these keywords (naturally integrated, do not stuff): ${keywords.join(', ')}
${relatedBrand ? `4. Related brand: ${relatedBrand}` : ''}
5. Stance: We are not neutral media, we are a curated editorial platform
6. Value: provide global buyers with real, verifiable information about Chinese suppliers
7. Must include specific data, prices, contact info, dealer addresses
8. No fluff, must be actionable

Format:
- Use Markdown
- First # is H1 title
- Use H2, H3 appropriately
- Lists with - or 1.
- Important info in **bold**
- End with a "Sources" or "References" section

Begin writing.`
}

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : 'Untitled'
}

function extractExcerpt(content: string, maxLength = 200): string {
  const cleaned = content.replace(/^#.*$/m, '').replace(/[*#`>\[\]]/g, '').trim()
  const firstParagraph = cleaned.split('\n\n')[0]
  return firstParagraph.slice(0, maxLength).trim() + (firstParagraph.length > maxLength ? '...' : '')
}