import { createClient } from '@supabase/supabase-js'

const url = 'https://gmzqogzqseylgxcomlgz.supabase.co'
const anonKey = 'sb_publishable_GtuPmbaa1T_MlmRd-dW4Pg_zYY9f161'
const supabase = createClient(url, anonKey)

// 查所有品牌
const { data: brands, error: e1 } = await supabase
  .from('brands').select('id, name_en, name, category, subcategory, verified, is_featured')
if (e1) console.log('brands 错误:', e1.message)
else {
  console.log('=== brands 总数量:', (brands || []).length, '===')
  ;(brands || []).forEach(b => console.log(`- ${b.name_en || b.name} [${b.category}/${b.subcategory}] verified=${b.verified} featured=${b.is_featured}`))
}

// 查 findin_reports
const { data: reports, error: e2 } = await supabase
  .from('findin_reports').select('id, title, category, status')
if (e2) console.log('\nreports 错误:', e2.message)
else {
  console.log('\n=== findin_reports 总数量:', (reports || []).length, '===')
  ;(reports || []).forEach(r => console.log(`- ${r.title} [${r.category}] status=${r.status}`))
}

// 查 blog_posts
const { data: blogs, error: e3 } = await supabase
  .from('blog_posts').select('id, title, published')
if (e3) console.log('\nblogs 错误:', e3.message)
else {
  console.log('\n=== blog_posts 总数量:', (blogs || []).length, '===')
  ;(blogs || []).forEach(b => console.log(`- ${b.title} published=${b.published}`))
}
