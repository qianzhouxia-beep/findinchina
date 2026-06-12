import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { GalleryEditor } from './gallery-editor'
import { LogoutButton } from '../../logout-button'

export const dynamic = 'force-dynamic'

export default async function BrandEditPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createAdminClient()
  const { data: brandRaw, error } = await supabase
    .from('brands')
    .select('slug, name_en, category, subcategory, gallery, last_verified')
    .eq('slug', slug)
    .single()

  if (error || !brandRaw) notFound()

  const brand = brandRaw as unknown as {
    slug: string
    name_en: string
    category: string
    subcategory: string | null
    gallery: Array<{ src: string }> | null
    last_verified: string | null
  }
  const gallery = brand.gallery || []

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-[10px] font-semibold text-brand-600 uppercase tracking-widest">
              FindInChina
            </div>
            <h1 className="font-serif text-xl font-bold">Admin</h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-sm text-brand-600 hover:underline"
          >
            ← Back to /admin
          </Link>
        </div>

        <div className="mb-6">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">
            {brand.category} · {brand.subcategory || '—'}
          </div>
          <h2 className="font-serif text-3xl font-bold mb-1">{brand.name_en}</h2>
          <div className="text-sm text-slate-500 font-mono">{brand.slug}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <GalleryEditor
            slug={brand.slug}
            initialGallery={gallery}
            lastVerified={brand.last_verified}
          />
        </div>

        <div className="text-xs text-slate-500 leading-relaxed">
          <strong>What this edits:</strong> the <code>gallery</code> field on the{' '}
          <code>brands</code> table. Used by the brand page carousel and the
          homepage card. URLs must start with <code>/brands/</code> (defense in
          depth — we only point to images served from{' '}
          <code>public/brands/</code>).
          <br />
          <br />
          <strong>What it does not edit:</strong> name, description, export
          countries, category, verified status, or any findin report fields.
          For those, use the Supabase SQL editor.
        </div>
      </div>
    </main>
  )
}
