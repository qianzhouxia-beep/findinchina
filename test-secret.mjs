import { createClient } from '@supabase/supabase-js'

const url = 'https://gmzqogzqseylgxcomlgz.supabase.co'
const secretKey = 'sb_secret_BfcbpiQP-AIfMwSo8fH_bg_MOTxDerA'

// 官方推荐方式：secret key 直接作为 createClient 的第二个参数
console.log('=== 官方方式: createClient(url, secretKey) ===')
const supabase = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data, error } = await supabase.from('brands').select('id').limit(1)
if (error) {
  console.log('读取失败:', error.message)
  console.log('错误详情:', JSON.stringify(error, null, 2).slice(0, 500))
} else {
  console.log('读取成功! 数量:', (data || []).length)
}

// 测试写入
if (!error) {
  const { data: ins, error: iE } = await supabase.from('brands').insert({
    name: 'TEST-SECRET',
    name_en: 'TEST-SECRET',
    slug: 'test-secret-' + Date.now(),
    category: 'Test',
    verified: false,
  }).select('id')
  if (iE) console.log('写入失败:', iE.message)
  else {
    console.log('写入成功! id =', ins?.[0]?.id)
    const { error: dE } = await supabase.from('brands').delete().eq('id', ins?.[0]?.id)
    console.log('清理:', dE ? '失败 ' + dE.message : '成功')
  }
}
