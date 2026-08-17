import { createClient } from '@supabase/supabase-js'

const url = 'https://gmzqogzqseylgxcomlgz.supabase.co'
const anonKey = 'sb_publishable_GtuPmbaa1T_MlmRd-dW4Pg_zYY9f161'
const supabase = createClient(url, anonKey)

// 查看现有报告完整结构（作为生成模板参考）
const { data: report, error: e } = await supabase
  .from('findin_reports')
  .select('*')
  .limit(1)

if (e) console.log('错误:', e.message)
else if (report && report[0]) {
  const r = report[0]
  console.log('=== 报告字段一览 ===')
  console.log('slug:', r.slug)
  console.log('title:', r.title)
  console.log('subtitle:', r.subtitle)
  console.log('category:', r.category)
  console.log('status:', r.status)
  console.log('brand_count:', r.brand_count)
  console.log('criteria_count:', r.criteria_count)
  console.log('read_time_min:', r.read_time_min)
  console.log('last_verified:', r.last_verified)
  console.log('published_at:', r.published_at)
  console.log('cover_image_url:', r.cover_image_url)
  console.log('excerpt:', r.excerpt)
  console.log('\n--- intro_text ---')
  console.log(r.intro_text?.slice(0, 300))
  console.log('\n--- criteria_text ---')
  console.log(JSON.stringify(r.criteria_text, null, 2)?.slice(0, 500))
  console.log('\n--- brand_blocks[0] ---')
  console.log(JSON.stringify(r.brand_blocks?.[0], null, 2)?.slice(0, 800))
  console.log('\n--- comparison_rows[0] ---')
  console.log(JSON.stringify(r.comparison_rows?.[0], null, 2))
  console.log('\n--- methodology_text (前200字) ---')
  console.log(r.methodology_text?.slice(0, 200))
  console.log('\n--- sources ---')
  console.log(JSON.stringify(r.sources))
}
