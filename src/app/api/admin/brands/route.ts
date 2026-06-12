import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('brands')
    .select('slug, name_en, category, subcategory, gallery, last_verified, verified')
    .order('name_en', { ascending: true })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ brands: data })
}
