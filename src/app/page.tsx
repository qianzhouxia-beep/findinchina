import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { NewsletterForm } from '@/components/newsletter-form'
import { NavMenu } from '@/components/nav-menu'
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react'
import { brandFallback } from '@/lib/brand-fallback'

interface Brand {
  id: number
  slug: string
  name_en: string
  category: string
  subcategory: string
  price_min: number
  price_max: number
  verified: boolean
  rating_avg: number
  expert_review_source: string
  expert_review_quote: string
  export_countries: number
  warranty_years: number
  description_short: string
  gallery?: Array<{ src: string; model_name: string; category: string }> | null
}

interface FindInSummary {
  slug: string
  title: string
  subtitle: string
  category: string
  brand_count: number
  read_time_min: number
  published_at: string
  cover_image_url: string
  excerpt: string
}

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  if (!rating) return null
  const full = Math.round(rating)
  const cls = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${cls} ${i < full ? 'fill-amber-500 text-amber-500' : 'fill-slate-200 text-slate-200'}`}
        />
      ))}
      <span className="ml-1.5 text-xs text-slate-500 font-medium">{rating.toFixed(1)}</span>
    </span>
  )
}

export default async function HomePage() {
  const supabase = createClient()

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('verified', true)
    .order('rating_avg', { ascending: false })
    .limit(6)

  const { data: reports } = await supabase
    .from('findin_reports')
    .select('slug, title, subtitle, category, brand_count, read_time_min, published_at, cover_image_url, excerpt')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3)

  const featured = brands?.[0]
  const grid = brands?.slice(1, 6) || []
  const list = (brands || []) as Brand[]
  const repList = (reports || []) as FindInSummary[]
  const reportTop = repList[0]

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4 flex-nowrap">
          <Link href="/" className="flex items-center flex-shrink-0" aria-label="FindInChina home">
            <Image
              src="/findinchina-transparent.png"
              alt="FindInChina"
              width={198}
              height={36}
              priority
              className="h-9 w-auto"
            />
          </Link>
          <NavMenu />
        </div>
      </header>

      {/* ============ HERO — Editorial ============ */}
      <section className="border-b bg-stone-50">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-5">
                Editorial · Curated · Verified
              </div>
              <h1 className="font-serif text-5xl md:text-7xl font-bold leading-[1.0] tracking-tight text-balance">
                Made in China,<br />
                <span className="text-brand-600 italic">bought direct.</span>
              </h1>
              <p className="font-serif text-xl md:text-2xl text-slate-700 mt-8 leading-relaxed max-w-2xl">
                Six verified Chinese brands, 30 days of vetting, zero marketing fluff. Buy e-bikes and EV chargers straight from the makers.
              </p>
              <div className="mt-10 flex items-center gap-6 text-sm">
                <Link
                  href="/findin"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors rounded"
                >
                  Read the 2026 reports
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/brands"
                  className="inline-flex items-center gap-2 text-slate-900 font-semibold hover:text-brand-600"
                >
                  Browse brands
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {featured && (
              <div className="lg:col-span-5">
                <Link href={`/brands/${featured.slug}`} className="block group">
                  <div className="relative aspect-square w-full bg-white overflow-hidden rounded">
                    <Image
                      src={
                        (featured.gallery as Array<{ src: string }> | null)?.[0]?.src ||
                        brandFallback(featured.slug)
                      }
                      alt={featured.name_en}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-contain transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                  </div>
                  <div className="mt-4 border-t pt-4">
                    <div className="text-[10px] font-semibold text-brand-600 uppercase tracking-widest">
                      Featured · {featured.subcategory}
                    </div>
                    <div className="font-serif text-2xl font-bold mt-1 group-hover:text-brand-600">
                      {featured.name_en}
                    </div>
                    {featured.price_min && featured.price_max && (
                      <div className="text-sm text-slate-500 mt-1 font-serif italic">
                        from ${featured.price_min.toLocaleString()} to ${featured.price_max.toLocaleString()}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ 6 BRANDS — Editorial bento ============ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-7">
              <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
                Verified roster
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Six brands, vetted on the same four criteria.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-2">
              <p className="font-serif text-lg text-slate-700 leading-relaxed">
                Export history, manufacturing capacity, warranty terms, verified contact. We score on the same four — no exceptions.
              </p>
              <Link
                href="/brands"
                className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-brand-600 hover:underline"
              >
                See all brands
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((b) => (
              <Link
                key={b.id}
                href={`/brands/${b.slug}`}
                className="group block border border-slate-200 hover:border-brand-600 transition rounded overflow-hidden"
              >
                <div className="relative aspect-square bg-slate-50 overflow-hidden">
                    <Image
                      src={
                        (b.gallery as Array<{ src: string }> | null)?.[0]?.src ||
                        brandFallback(b.slug)
                      }
                      alt={b.name_en}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-semibold text-brand-600 uppercase tracking-widest">
                      {b.subcategory}
                    </div>
                    {b.verified && (
                      <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-widest">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl font-bold leading-snug group-hover:text-brand-600">
                    {b.name_en}
                  </h3>
                  {b.rating_avg > 0 && (
                    <div className="mt-2">
                      <Stars rating={b.rating_avg} />
                    </div>
                  )}
                  {b.expert_review_quote && (
                    <blockquote className="mt-4 border-l-2 border-slate-200 pl-3">
                      <p className="font-serif text-sm italic text-slate-600 line-clamp-2">
                        &ldquo;{b.expert_review_quote}&rdquo;
                      </p>
                      {b.expert_review_source && (
                        <footer className="text-[10px] text-slate-400 mt-1">
                          — {b.expert_review_source}
                        </footer>
                      )}
                    </blockquote>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Latest FindIn — Editorial ============ */}
      {reportTop && (
        <section className="py-20 md:py-28 bg-stone-50 border-y">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5">
                <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
                  FindIn · Latest report
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
                  {reportTop.title}
                </h2>
                <p className="font-serif text-lg text-slate-700 leading-relaxed mb-6">
                  {reportTop.excerpt || reportTop.subtitle}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-6">
                  <span><strong className="text-slate-900">{reportTop.brand_count}</strong> brands</span>
                  <span>·</span>
                  <span><strong className="text-slate-900">{reportTop.read_time_min}</strong> min read</span>
                  <span>·</span>
                  <span>Published <strong className="text-slate-900">{reportTop.published_at}</strong></span>
                </div>
                <Link
                  href={`/findin/${reportTop.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold hover:bg-brand-600 transition-colors rounded"
                >
                  Read the full report
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="lg:col-span-7">
                <Link href={`/findin/${reportTop.slug}`} className="group block">
                  <div className="relative aspect-square w-full bg-white overflow-hidden rounded">
                    <Image
                      src={reportTop.cover_image_url || '/brands/engwe.jpg'}
                      alt={reportTop.title}
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </Link>
              </div>
            </div>

            {repList.length > 1 && (
              <div className="mt-12 pt-12 border-t grid md:grid-cols-2 gap-6">
                {repList.slice(1, 3).map((r) => (
                  <Link
                    key={r.slug}
                    href={`/findin/${r.slug}`}
                    className="group flex gap-5 items-start"
                  >
                    <div className="relative w-28 h-20 flex-shrink-0 bg-white overflow-hidden rounded">
                      <Image
                        src={r.cover_image_url || '/brands/engwe.jpg'}
                        alt={r.title}
                        fill
                        sizes="112px"
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold text-brand-600 uppercase tracking-widest">
                        {r.category}
                      </div>
                      <h3 className="font-serif font-bold mt-1 group-hover:text-brand-600 line-clamp-2">
                        {r.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {r.brand_count} brands · {r.read_time_min} min
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-10 text-center">
              <Link
                href="/findin"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline"
              >
                All reports
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ Newsletter — Editorial muted ============ */}
      <section id="newsletter" className="py-20 md:py-28 border-b">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
            Newsletter
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
            One brand, every Monday.
          </h2>
          <p className="font-serif text-lg md:text-xl text-slate-700 mt-5 leading-relaxed">
            One hand-picked Chinese brand, one dealer, one product, sent every Monday morning. 2,500+ cross-border buyers read it.
          </p>
          <div className="mt-8 max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* ============ Browse by category — Editorial ============ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-12 gap-10 mb-12">
            <div className="lg:col-span-7">
              <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
                Browse
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
                Browse by category.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-2">
              <p className="font-serif text-lg text-slate-700 leading-relaxed">
                Pick a category. We&rsquo;ll show you what we know.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
            {[
              { name: 'E-bikes', slug: 'e-bike', count: 6, desc: 'Folding, fat-tire, moped' },
              { name: 'EV charging', slug: 'ev-charging', count: 1, desc: 'Home and commercial' },
              { name: 'Audio', slug: 'audio', count: 0, desc: 'Earbuds, headphones, DACs' },
              { name: 'Power & charging', slug: 'power', count: 0, desc: 'Power banks, wall chargers' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group block bg-white p-7 hover:bg-stone-50 transition-colors"
              >
                <div className="text-[10px] font-semibold text-brand-600 uppercase tracking-widest">
                  {cat.count} {cat.count === 1 ? 'brand' : 'brands'}
                </div>
                <h3 className="font-serif text-2xl font-bold mt-2 group-hover:text-brand-600">
                  {cat.name}
                </h3>
                <p className="text-sm text-slate-500 mt-2 font-serif italic">{cat.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div>© 2026 FindInChina. Independent. Curated. Verified.</div>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-brand-600">About</Link>
            <Link href="/blog" className="hover:text-brand-600">Blog</Link>
            <Link href="/findin" className="hover:text-brand-600">FindIn</Link>
            <Link href="/contact" className="hover:text-brand-600">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
