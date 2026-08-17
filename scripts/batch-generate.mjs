/**
 * FindInChina 批量内容生成脚本
 * ============================
 * 用 DeepSeek 生成品牌调研报告，先输出到本地文件（不依赖数据库）
 * 等 Supabase secret key 修复后，可将数据灌入 findin_reports 表
 */
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

const client = new OpenAI({
  apiKey: 'sk-fa9d6a4dd4ba4d29b98606509f1bd601',
  baseURL: 'https://api.deepseek.com',
})

const OUT_DIR = path.join(process.cwd(), 'generated-content')

// 报告生成 Prompt —— 严格匹配 findin_reports 表结构
const REPORT_PROMPT = (category, brands) => `You are the lead researcher at FindInChina, a curated editorial platform helping global buyers source verified Chinese brands.

Create a "FindIn Report" for the category: **${category}**

Brands to cover: ${brands.join(', ')}

Output MUST be valid JSON with EXACTLY this structure (no markdown, no code fences):
{
  "slug": "kebab-case-unique-slug",
  "title": "Compelling headline with brand count and category",
  "subtitle": "One-line teaser naming the brands",
  "category": "${category}",
  "brand_count": number,
  "criteria_count": 4,
  "read_time_min": 8,
  "last_verified": "2026-08-17",
  "excerpt": "One-line summary for list cards",
  "intro_text": "3-4 paragraph editorial intro (no markdown headers)",
  "criteria_text": ["Real export operation", "Working warranty", "Product line currency", "Verifiable contact"],
  "brand_blocks": [
    {
      "brand_name": "Brand English Name",
      "slug": "brand-slug",
      "quick_take": "One sentence: who this is best for",
      "why_vetted": ["3-4 specific vetted facts with data"],
      "who_for": ["2-3 buyer personas"],
      "expert_quote": "One strong editorial quote",
      "gallery": []
    }
  ],
  "comparison_rows": [
    {
      "brand_slug": "brand-slug",
      "brand_name": "Brand",
      "price": 999,
      "price_label": "$999",
      "warranty": "2 yr",
      "countries": 5,
      "rating": 4.0,
      "third_party": "—"
    }
  ],
  "methodology_text": "2 paragraphs explaining the 4-criteria scoring method",
  "sources": ["source 1", "source 2"]
}

IMPORTANT:
- Use REAL brand names, REAL approximate prices, REAL warranty terms (research from official sites)
- Editorial tone: vetted, trustworthy, specific data — NOT generic filler
- Brand blocks must have at least 3 brands, ideally 4-5
- All text in English, written for global buyers sourcing from China
- Do NOT include speculative or invented data — use realistic public info`

// 博客文章生成 Prompt
const BLOG_PROMPT = (topic) => `You are the lead content editor at FindInChina, a curated platform for verified Chinese suppliers.

Write an 800-word English blog article about: "${topic}"

Style: editorial, data-driven, helpful for global buyers sourcing from China. Include real brand examples with approximate prices, concrete facts, actionable advice. No fluff. Use markdown with # title, ## sections, - lists. End with a Sources section.`

async function generateReport(category, brands) {
  const completion = await client.chat.completions.create({
    model: 'deepseek-v4-flash',
    messages: [
      { role: 'system', content: 'You are a meticulous brand researcher producing structured JSON data.' },
      { role: 'user', content: REPORT_PROMPT(category, brands) },
    ],
    temperature: 0.5,
    max_tokens: 6000,
    response_format: { type: 'json_object' },
  })
  const raw = completion.choices[0].message.content || ''
  try {
    return JSON.parse(raw)
  } catch (e) {
    // Try to extract JSON from markdown fences
    const match = raw.match(/```json\n([\s\S]*?)```/)
    if (match) return JSON.parse(match[1])
    console.error('JSON 解析失败，原始输出前500字:', raw.slice(0, 500))
    return null
  }
}

async function generateBlog(topic) {
  const completion = await client.chat.completions.create({
    model: 'deepseek-v4-flash',
    messages: [
      { role: 'system', content: 'You are the lead content editor at FindInChina.' },
      { role: 'user', content: BLOG_PROMPT(topic) },
    ],
    temperature: 0.7,
    max_tokens: 3000,
  })
  return completion.choices[0].message.content || ''
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  // 第一批报告：3 个新品类
  const reports = [
    { category: 'Outdoor gear', brands: ['Naturehike', 'TETON Sports (OEM)', 'DECATHLON (OEM)', 'KingCamp', 'FIELDOOR'] },
    { category: 'GaN chargers', brands: ['CUKTECH', 'PISEN', 'Baseus', 'UGREEN', 'Anker (OEM)'] },
    { category: 'Mechanical keyboards', brands: ['Keychron', 'Epomaker', 'Akko', 'Royal Kludge', 'Aula'] },
  ]

  const summary = { generated_at: new Date().toISOString(), reports: [], blogs: [] }

  for (const r of reports) {
    console.log(`生成报告: ${r.category}...`)
    const data = await generateReport(r.category, r.brands)
    if (data) {
      const file = path.join(OUT_DIR, `report-${data.slug || r.category.toLowerCase().replace(/\s+/g, '-')}.json`)
      fs.writeFileSync(file, JSON.stringify(data, null, 2))
      summary.reports.push({ category: r.category, slug: data.slug, title: data.title, file })
      console.log(`  ✅ ${data.title}`)
    } else {
      summary.reports.push({ category: r.category, error: '生成失败' })
    }
    await new Promise(res => setTimeout(res, 2000))
  }

  // 第一批博客：2 篇
  const blogTopics = [
    'How to verify a Chinese factory is real before you send a deposit (2026 guide)',
    'Made in China 2026: 15 underrated Chinese tech brands worth buying directly',
  ]
  for (const topic of blogTopics) {
    console.log(`生成博客: ${topic.slice(0, 50)}...`)
    const content = await generateBlog(topic)
    if (content) {
      const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
      const file = path.join(OUT_DIR, `blog-${slug}.md`)
      fs.writeFileSync(file, content)
      summary.blogs.push({ topic, file })
      console.log(`  ✅ ${file}`)
    }
    await new Promise(res => setTimeout(res, 2000))
  }

  fs.writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2))
  console.log('\n=== 全部完成 ===')
  console.log(`输出目录: ${OUT_DIR}`)
  console.log(`报告 ${summary.reports.length} 篇, 博客 ${summary.blogs.length} 篇`)
}

main().catch(e => { console.error('执行失败:', e.message); process.exit(1) })
