import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

interface GalleryItem {
  src: string
  alt?: string
}

/**
 * PUT /api/admin/brands/[slug]
 * Body: { gallery: string[] }  // one URL per line in the form
 *
 * Validates URLs start with /brands/ (defense in depth — admin can only point
 * to images we actually serve from public/brands/).
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  const rawGallery: unknown = body?.gallery
  if (!Array.isArray(rawGallery)) {
    return NextResponse.json({ error: 'gallery_must_be_array' }, { status: 400 })
  }

  // Clean and validate each URL
  const gallery: GalleryItem[] = []
  for (const item of rawGallery) {
    const url = typeof item === 'string' ? item : (item?.src as string)
    if (!url || typeof url !== 'string') continue
    const cleaned = url.trim()
    if (!cleaned) continue
    if (!cleaned.startsWith('/brands/')) {
      return NextResponse.json(
        { error: 'invalid_url', detail: `URL must start with /brands/: ${cleaned}` },
        { status: 400 }
      )
    }
    if (cleaned.includes('..') || cleaned.includes('\\')) {
      return NextResponse.json({ error: 'invalid_url', detail: `path traversal: ${cleaned}` }, { status: 400 })
    }
    gallery.push({ src: cleaned, alt: '' })
  }

  if (gallery.length === 0) {
    return NextResponse.json({ error: 'gallery_empty' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

  // Cast through unknown — supabase-js types are not generated for this project
  const { data, error } = await (supabase
    .from('brands') as any)
    .update({ gallery, last_verified: today })
    .eq('slug', slug)
    .select('slug, gallery, last_verified')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'brand_not_found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, brand: data[0] })
}
