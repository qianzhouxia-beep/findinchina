import { createClient } from '@supabase/supabase-js'

const url = 'https://gmzqogzqseylgxcomlgz.supabase.co'
const anonKey = 'sb_publishable_GtuPmbaa1T_MlmRd-dW4Pg_zYY9f161'
const secretKey = 'sb_secret_BfcbpiQP-AIfMwSo8fH_bg_MOTxDerA'

// 方法1: secret key 直接作为 client key（当前 .env 配置方式）
const c1 = createClient(url, secretKey, { auth: { persistSession: false } })
const { error: e1 } = await c1.from('brands').select('id').limit(1)
console.log('方法1 (secret 作为唯一 key):', e1 ? '失败 - ' + e1.message : '成功')

// 方法2: 用 anon key 初始化，手动设置 access token 为 secret key
const c2 = createClient(url, anonKey, {
  global: { headers: { Authorization: `Bearer ${secretKey}` } },
  auth: { persistSession: false },
})
const { error: e2 } = await c2.from('brands').select('id').limit(1)
console.log('方法2 (anon+手动secret header):', e2 ? '失败 - ' + e2.message : '成功')

// 方法3: 旧版 JWT 格式测试 - 看看是不是 secret 需要 eyJ 开头
console.log('\n提示: 2026 新版 Supabase key 有两种格式')
console.log('- 新格式: sb_secret_xxx (你提供的)')
console.log('- 旧格式: eyJhbGciOi... (JWT 格式)')
console.log('如果你在 Dashboard 看到的是 eyJ 开头的长字符串，那才是完整的 service role key')
