/**
 * FindInChina 内容导入脚本
 * ========================
 * 把 generated-content/ 下的报告 JSON 灌入 Supabase findin_reports 表
 * 同时把报告中的品牌同步到 brands 表（如果不存在）
 *
 * 用法: node scripts/import-content.mjs
 */
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

const GEN_DIR = path.join(process.cwd(), 'generated-content')

async function importReport(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'))

  // 1. 插入报告
  const { data: inserted, error: err } = await supabase
    .from('findin_reports')
    .upsert({
      slug: data.slug,
      title: data.title,
      subtitle: data.subtitle,
      category: data.category,
      status: 'published',
      brand_count: data.brand_count,
      criteria_count: data.criteria_count,
      read_time_min: data.read_time_min,
      last_verified: data.last_verified,
      published_at: data.last_verified || new Date().toISOString().slice(0, 10),
      cover_image_url: data.cover_image_url || '',
      excerpt: data.excerpt,
      intro_text: data.intro_text,
      criteria_text: data.criteria_text,
      brand_blocks: data.brand_blocks,
      comparison_rows: data.comparison_rows,
      methodology_text: data.methodology_text,
      sources: data.sources || [],
    })
    .select('id, slug')

  if (err) {
    console.log(`  [报告失败] ${data.slug}: ${err.message}`)
    return false
  }
  console.log(`  [报告成功] ${data.slug} (id=${inserted?.[0]?.id})`)

  // 2. 同步品牌到 brands 表
  for (const block of data.brand_blocks || []) {
    const slug = block.slug
    if (!slug) continue

    const { data: existing } = await supabase
      .from('brands').select('id').eq('slug', slug).maybeSingle()

    if (existing) {
      console.log(`    [品牌已存在] ${block.brand_name}`)
      continue
    }

    const { error: bErr } = await supabase
      .from('brands')
      .insert({
        name: block.brand_name,
        name_en: block.brand_name,
        slug: slug,
        category: data.category,
        subcategory: data.category,
        description: block.quick_take || '',
        verified: true,
        verified_by: 'FindInChina Editorial',
        verified_at: new Date().toISOString(),
        rating_avg: null,
        source_urls: data.sources || [],
        tags: [data.category],
      })

    if (bErr) console.log(`    [品牌失败] ${block.brand_name}: ${bErr.message}`)
    else console.log(`    [品牌新增] ${block.brand_name}`)
  }
  return true
}

async function main() {
  const files = fs.readdirSync(GEN_DIR)
    .filter(f => f.startsWith('report-') && f.endsWith('.json') && f !== 'summary.json')

  console.log(`找到 ${files.length} 个报告文件\n`)
  let ok = 0
  for (const f of files) {
    console.log(`导入: ${f}`)
    if (await importReport(path.join(GEN_DIR, f))) ok++
    console.log('')
  }
  console.log(`完成: ${ok}/${files.length} 报告导入成功`)
}

main().catch(e => { console.error('执行失败:', e.message); process.exit(1) })
