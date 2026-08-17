import { createClient } from '@supabase/supabase-js'

const url = 'https://gmzqogzqseylgxcomlgz.supabase.co'
const anonKey = 'sb_publishable_GtuPmbaa1T_MlmRd-dW4Pg_zYY9f161'
const secretKey = 'sb_secret_BfcbpiQP-AIfMwSo8fH_bg_MOTxDerA'

// 方法 A: anon 初始化 + 全局 header 覆盖 Authorization 为 secret
console.log('=== 方法 A: anon + secret header ===')
const cA = createClient(url, anonKey, {
  global: { headers: { Authorization: `Bearer ${secretKey}` } },
  auth: { persistSession: false, autoRefreshToken: false },
})
const { data: dA, error: eA } = await cA.from('brands').select('id').limit(1)
if (eA) console.log('失败:', eA.message)
else console.log('成功!', (dA || []).length, '条')

// 测试写入
if (!eA) {
  const { data: ins, error: iE } = await cA.from('brands').insert({
    name: 'TEST-XYZ',
    name_en: 'TEST-XYZ',
    slug: 'test-xyz-' + Date.now(),
    category: 'Test',
    verified: false,
  }).select('id')
  if (iE) console.log('写入失败:', iE.message)
  else {
    console.log('写入成功! id =', ins[0]?.id)
    await cA.from('brands').delete().eq('id', ins[0]?.id)
    console.log('测试数据已清理')
  }
}
