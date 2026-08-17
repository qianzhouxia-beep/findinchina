import { createClient } from '@supabase/supabase-js'

const url = 'https://gmzqogzqseylgxcomlgz.supabase.co'
const anonKey = 'sb_publishable_GtuPmbaa1T_MlmRd-dW4Pg_zYY9f161'
const c = createClient(url, anonKey, { auth: { persistSession: false } })

// 1. publishable 能否写 findin_reports（测试 RLS）
console.log('=== 测试 publishable 写 findin_reports ===')
const { data: d1, error: e1 } = await c.from('findin_reports').insert({
  slug: 'test-' + Date.now(),
  title: 'test',
  category: 'Test',
  intro_text: 'x',
}).select('id')
console.log(e1 ? '失败: ' + e1.message : '成功: ' + JSON.stringify(d1))
if (!e1 && d1?.[0]?.id) await c.from('findin_reports').delete().eq('id', d1[0].id)

// 2. 读取 RLS 策略相关的表权限信息
console.log('\n=== 测试 publishable 写 blog_posts ===')
const { data: d2, error: e2 } = await c.from('blog_posts').insert({
  slug: 'test-' + Date.now(),
  title: 'test',
  body: 'x',
}).select('id')
console.log(e2 ? '失败: ' + e2.message : '成功: ' + JSON.stringify(d2))
if (!e2 && d2?.[0]?.id) await c.from('blog_posts').delete().eq('id', d2[0].id)
