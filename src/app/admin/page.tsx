import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { LogoutButton } from './logout-button'

export const dynamic = 'force-dynamic'

export default async function AdminHomePage() {
  const supabase = createAdminClient()
  const { data: brandsRaw, error } = await supabase
    .from('brands')
    .select('slug, name_en, category, subcategory, gallery, last_verified, verified, export_countries')
    .order('name_en', { ascending: true })

  const brands = brandsRaw as unknown as Array<{
    slug: string
    name_en: string
    category: string
    subcategory: string | null
    gallery: Array<{ src: string }> | null
    last_verified: string | null
    verified: boolean
    export_countries: string[] | null
  }> | null

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
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

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Brands section */}
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-serif text-2xl font-bold">Brands</h2>
            <span className="text-sm text-slate-500">
              {brands?.length || 0} brands
            </span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded p-3 mb-4">
              Error: {error.message}
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Thumb</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Slug</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Gallery</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Last verified</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {brands?.map((b) => {
                  const gallery = (b.gallery as Array<{ src: string }> | null) || []
                  const thumb = gallery[0]?.src
                  return (
                    <tr key={b.slug} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        {thumb ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={thumb}
                            alt={b.name_en}
                            className="w-12 h-12 object-contain bg-slate-50 rounded border border-slate-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-slate-100 rounded border border-slate-200" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{b.slug}</td>
                      <td className="px-4 py-3 font-medium">{b.name_en}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {b.subcategory || b.category}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {gallery.length} {gallery.length === 1 ? 'image' : 'images'}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {b.last_verified || '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/brands/${b.slug}`}
                          className="text-brand-600 hover:underline font-medium"
                        >
                          Edit →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Not-yet-supported section */}
        <section>
          <h2 className="font-serif text-2xl font-bold mb-4">Reports & Blog</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-6 text-sm text-slate-600">
            <p className="mb-2">
              <strong>findin_reports</strong> and <strong>blog_posts</strong> editing is
              not exposed in v1. Their JSONB structure is too complex for the simple URL-input
              pattern.
            </p>
            <p>
              For now, edit these in the{' '}
              <a
                href="https://supabase.com/dashboard/project/gmzqogzqseylgxcomlgz/editor"
                className="text-brand-600 hover:underline"
                target="_blank"
                rel="noopener"
              >
                Supabase SQL editor
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
