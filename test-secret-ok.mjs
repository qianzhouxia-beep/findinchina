import { createClient } from '@supabase/supabase-js'

const url = 'https://gmzqogzqseylgxcomlgz.supabase.co'
const secretKey = 'sb_secret_A-fvvHucOhiFN6k_xKn8ng_ZpO5TS5x'

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

console.log('=== 测试正确 secret key ===')
const { data, error } = await supabase.from('brands').select('id').limit(1)
if (error) console.log('读取失败:', error.message)
else {
  console.log('读取成功! 数量:', (data || []).length)
  // 测试写入
  const { data: ins, error: iE } = await supabase.from('brands').insert({
    name: 'TEST-OK',
    name_en: 'TEST-OK',
    slug: 'test-ok-' + Date.now(),
    category: 'Test',
    verified: false,
  }).select('id')
  if (iE) console.log('写入失败:', iE.message)
  else {
    console.log('写入成功! id =', ins?.[0]?.id)
    await supabase.from('brands').delete().eq('id', ins?.[0]?.id)
    console.log('测试数据已清理 — key 完全可用 ✅')
  }
}
