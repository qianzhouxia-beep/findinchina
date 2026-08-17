import { createClient } from '@supabase/supabase-js'

const url = 'https://gmzqogzqseylgxcomlgz.supabase.co'
const anonKey = 'sb_publishable_GtuPmbaa1T_MlmRd-dW4Pg_zYY9f161'
const supabase = createClient(url, anonKey)

// 测试 anon key 能否写入（试插入一条临时品牌）
const { data: inserted, error: e1 } = await supabase
  .from('brands')
  .insert({
    name: 'TEST-DELETE-ME',
    name_en: 'TEST-DELETE-ME',
    slug: 'test-delete-me-' + Date.now(),
    category: 'Test',
    verified: false,
  })
  .select('id')

if (e1) console.log('写入测试(anon): 被拒绝 →', e1.message)
else {
  console.log('写入测试(anon): 成功! id =', inserted[0]?.id)
  // 删除测试数据
  const { error: e2 } = await supabase.from('brands').delete().eq('id', inserted[0]?.id)
  console.log('清理测试数据:', e2 ? '失败 ' + e2.message : '成功')
}
