import Link from 'next/link'
import { NavMenu } from '@/components/nav-menu'
import { createClient } from '@/lib/supabase/server'

interface FindInSummary {
  slug: string
  title: string
  subtitle: string
  category: string
  status: string
  brand_count: number
  read_time_min: number
  last_verified: string
  published_at: string
  cover_image_url: string
  excerpt: string
}

export default async function FindInListPage() {
  const supabase = createClient()

  const { data: reports } = await supabase
    .from('findin_reports')
    .select('slug, title, subtitle, category, status, brand_count, read_time_min, last_verified, published_at, cover_image_url, excerpt')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .returns<FindInSummary[]>()

  const list = reports || []
  const featured = list[0]
  const secondary = list.slice(1, 3)
  const wide = list[3]

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4 flex-nowrap">
          <Link href="/" className="flex items-center flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/findinchina-transparent.png" alt="FindInChina" className="h-9 w-auto" />
          </Link>
          <NavMenu />
        </div>
      </header>

      <section className="bg-slate-50 border-b">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
            FindIn reports
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-5">FindIn.</h1>
          <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
            Side-by-side comparisons of verified Chinese brands. We test, we vet, we publish the data. No marketing fluff.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        {list.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No reports yet. Check back soon.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-7">
            {/* Featured: large card */}
            {featured && (
              <Link
                href={`/findin/${featured.slug}`}
                className="md:col-span-2 group block border border-slate-200 rounded-lg overflow-hidden hover:border-brand-600 transition"
              >
                <div className="grid md:grid-cols-5">
                  <div className="md:col-span-3 aspect-square md:aspect-square bg-slate-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featured.cover_image_url || '/brands/engwe/engwe-engine-pro-3.jpg'}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="md:col-span-2 p-7 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-semibold text-brand-600 uppercase tracking-widest">
                          Featured
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                          {featured.category}
                        </span>
                      </div>
                      <h2 className="font-serif text-2xl md:text-3xl font-bold leading-snug mb-3 group-hover:text-brand-600">
                        {featured.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed line-clamp-3">
                        {featured.excerpt || featured.subtitle}
                      </p>
                    </div>
                    <div className="mt-5 flex items-center gap-3 text-xs text-slate-500">
                      <span>{featured.published_at}</span>
                      <span>·</span>
                      <span>{featured.brand_count} brands</span>
                      <span>·</span>
                      <span>{featured.read_time_min} min read</span>
                      <span className="ml-auto text-brand-600 font-semibold group-hover:underline">
                        Read →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Secondary: 2 standard cards */}
            {secondary.map((r) => (
              <Link
                key={r.slug}
                href={`/findin/${r.slug}`}
                className="group block border border-slate-200 rounded-lg overflow-hidden hover:border-brand-600 transition"
              >
                <div className="aspect-square bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.cover_image_url || '/brands/engwe/engwe-engine-pro-3.jpg'}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                    {r.category}
                  </div>
                  <h2 className="font-serif text-xl font-bold leading-snug mb-2 group-hover:text-brand-600">
                    {r.title}
                  </h2>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {r.excerpt || r.subtitle}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{r.brand_count} brands</span>
                    <span>·</span>
                    <span>{r.read_time_min} min</span>
                    <span className="ml-auto text-brand-600 font-semibold group-hover:underline">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Wide: 1 horizontal card */}
            {wide && (
              <Link
                href={`/findin/${wide.slug}`}
                className="md:col-span-2 group block border border-slate-200 rounded-lg overflow-hidden hover:border-brand-600 transition"
              >
                <div className="grid md:grid-cols-5">
                  <div className="md:col-span-2 aspect-square md:aspect-square bg-slate-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={wide.cover_image_url || '/brands/star-charge/starcharge-banner-1.jpg'}
                      alt={wide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="md:col-span-3 p-7 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                        {wide.category}
                      </div>
                      <h2 className="font-serif text-2xl font-bold leading-snug mb-3 group-hover:text-brand-600">
                        {wide.title}
                      </h2>
                      <p className="text-slate-600 line-clamp-2">
                        {wide.excerpt || wide.subtitle}
                      </p>
                    </div>
                    <div className="mt-5 flex items-center gap-3 text-xs text-slate-500">
                      <span>{wide.brand_count} brands</span>
                      <span>·</span>
                      <span>{wide.read_time_min} min</span>
                      <span className="ml-auto text-brand-600 font-semibold group-hover:underline">
                        Read →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
