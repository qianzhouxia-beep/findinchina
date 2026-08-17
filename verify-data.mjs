import { createClient } from '@supabase/supabase-js'

const url = 'https://gmzqogzqseylgxcomlgz.supabase.co'
const anonKey = 'sb_publishable_GtuPmbaa1T_MlmRd-dW4Pg_zYY9f161'
const supabase = createClient(url, anonKey)

// 验证所有内容
const { data: brands } = await supabase.from('brands').select('name_en, category, verified').order('created_at', { ascending: false })
console.log('=== brands 总数量:', (brands || []).length, '===')
;(brands || []).slice(0, 25).forEach(b => console.log(`- ${b.name_en} [${b.category}] verified=${b.verified}`))

const { data: reports } = await supabase.from('findin_reports').select('slug, title, category, status, brand_count')
console.log('\n=== findin_reports 总数量:', (reports || []).length, '===')
;(reports || []).forEach(r => console.log(`- ${r.title} [${r.category}] brands=${r.brand_count} status=${r.status}`))
