import OpenAI from 'openai'

/**
 * DeepSeek API client
 * =====================
 * DeepSeek is OpenAI-compatible, so we use the openai SDK.
 * Pricing: $0.14 / 1M output tokens (new users get 5M free).
 * Sign up: https://platform.deepseek.com
 *
 * Why DeepSeek:
 * - Strong at both Chinese and English
 * - 1/30 the price of Claude
 * - Free tier is enough for MVP
 */

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: 'https://api.deepseek.com',
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
  const prompt = buildPrompt(params)

  const completion = await deepseek.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content:
          'You are the lead content editor at FindInChina, a curated platform for verified Chinese suppliers, focused on helping global buyers source from China.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 4096,
  })

  const content = completion.choices[0].message.content || ''

  return {
    title: extractTitle(content),
    body: content,
    excerpt: extractExcerpt(content),
    seoTitle: `${params.topic} | FindInChina`,
    seoDescription: extractExcerpt(content, 155),
    readTimeMin: Math.ceil((params.wordCount || 1500) / 200),
  }
}

function buildPrompt(params: ContentGenerationParams): string {
  const { topic, type, keywords = [], wordCount = 1500, tone = 'professional', relatedBrand } = params

  return `You are the lead content editor at FindInChina, a curated platform for verified Chinese suppliers aimed at international buyers.

Write a ${type} about "${topic}".

Requirements:
1. Approximately ${wordCount} words (English)
2. Tone: ${tone}
3. Must include these keywords (naturally integrated): ${keywords.join(', ')}
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

/**
 * Optional: batch generation (multiple articles in one call, more efficient)
 */
export async function generateMultipleContents(topics: string[], type: 'blog' | 'review' = 'blog') {
  const results = []
  for (const topic of topics) {
    const result = await generateContent({
      topic,
      type,
      wordCount: type === 'blog' ? 1500 : 800,
    })
    results.push({ topic, ...result })
    // Rate limit
    await new Promise(r => setTimeout(r, 1000))
  }
  return results
}
