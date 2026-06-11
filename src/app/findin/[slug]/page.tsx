import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NavMenu } from '@/components/nav-menu'
import { createClient } from '@/lib/supabase/server'
import { SortableTable } from './sortable-table'
import { BrandBlock } from './brand-block'

interface ComparisonRow {
  brand_slug: string
  brand_name: string
  price: number
  price_label: string
  range: string
  power: string
  countries: number
  warranty: string
  third_party: string
  rating: number
}

interface BrandBlockData {
  slug: string
  brand_name: string
  quick_take: string
  expert_quote: string
  expert_source: string
  why_vetted: string[]
  who_for: string[]
  gallery: string[]
}

interface FindInReport {
  id: number
  slug: string
  title: string
  subtitle: string
  category: string
  brand_count: number
  criteria_count: number
  source_count: number
  read_time_min: number
  last_verified: string
  published_at: string
  cover_image_url: string
  excerpt: string
  intro_text: string
  criteria_text: string[]
  brand_blocks: BrandBlockData[]
  methodology_text: string
  sources: string[]
  comparison_rows: ComparisonRow[]
}

export const revalidate = 60

export default async function FindInReportPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createClient()

  const { data: report, error } = await supabase
    .from('findin_reports')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single<FindInReport>()

  if (error || !report) {
    notFound()
  }

  // Default sort: price asc, Star Charge (price=0) last
  const initialRows = [...(report.comparison_rows || [])].sort((a, b) => {
    if (a.price === 0) return 1
    if (b.price === 0) return -1
    return a.price - b.price
  })

  // Build TOC
  const tocEntries = [
    { id: 'comparison', label: '1. Comparison table' },
    ...report.brand_blocks.map((b, i) => ({
      id: b.slug,
      label: `${i + 2}. ${b.brand_name}`,
    })),
    {
      id: 'methodology',
      label: `${report.brand_blocks.length + 2}. How we compared`,
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4 flex-nowrap">
          <Link href="/" className="flex items-center flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/findinchina-transparent.png" alt="FindInChina" className="h-9 w-auto" />
          </Link>
          <NavMenu />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-slate-50 border-b">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-xs text-slate-500 mb-6 flex items-center gap-2">
            <Link href="/findin" className="hover:text-brand-600">FindIn</Link>
            <span>›</span>
            <span className="text-slate-700">{report.title}</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-semibold text-brand-600 uppercase tracking-widest">
              {report.category} comparison
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              Published {report.published_at}
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-5">
            {report.title}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-7">{report.subtitle}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 pt-5 border-t border-slate-200">
            <span><strong className="text-slate-900">{report.brand_count}</strong> brands reviewed</span>
            <span><strong className="text-slate-900">{report.criteria_count}</strong> criteria scored</span>
            <span><strong className="text-slate-900">{report.source_count}</strong> sources cited</span>
            <span><strong className="text-slate-900">{report.read_time_min}</strong> min read</span>
            <span className="ml-auto">
              Last verified <strong className="text-slate-900">{report.last_verified}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Body: 3-col */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[200px_1fr_260px] gap-12">
          {/* LEFT: TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Contents
              </div>
              <ol className="space-y-2 text-sm">
                {tocEntries.map((entry) => (
                  <li key={entry.id}>
                    <a href={`#${entry.id}`} className="text-slate-600 hover:text-brand-600">
                      {entry.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          {/* CENTER */}
          <article className="min-w-0">
            {/* Intro drop-cap */}
            <div
              className="font-serif text-lg leading-relaxed text-slate-700 mb-12 first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:text-brand-600"
              style={{ whiteSpace: 'pre-line' }}
            >
              {report.intro_text}
            </div>

            {/* §1 Comparison */}
            <h2
              id="comparison"
              className="font-serif text-3xl font-bold mt-12 mb-2 pt-4 border-t border-slate-200 scroll-mt-6"
            >
              1. Comparison table
            </h2>
            <p className="text-slate-600 mb-5">
              Sorted by starting price (low → high) by default. Our rating is a composite of price, range, export, warranty and third-party reviews.
            </p>

            <SortableTable initialRows={initialRows} />

            <p className="text-xs text-slate-500 mt-3">
              * Rating: 30% price, 25% range, 20% export reach, 15% warranty, 10% third-party coverage.
              Methodology in §{report.brand_blocks.length + 2}.
            </p>

            {/* §2-§N Brand blocks */}
            {report.brand_blocks.map((b, i) => (
              <BrandBlock key={b.slug} block={b} index={i + 2} />
            ))}

            {/* §Last Methodology */}
            <h2
              id="methodology"
              className="font-serif text-3xl font-bold mt-16 mb-5 pt-4 border-t border-slate-200 scroll-mt-6"
            >
              {report.brand_blocks.length + 2}. How we compared
            </h2>
            <p
              className="text-slate-700 leading-relaxed mb-4"
              style={{ whiteSpace: 'pre-line' }}
            >
              {report.methodology_text}
            </p>

            {report.criteria_text && report.criteria_text.length > 0 && (
              <ol className="space-y-3 text-slate-700 mb-8">
                {report.criteria_text.map((c, i) => (
                  <li key={i}>
                    <strong className="text-slate-900">
                      {i + 1}. {c}.
                    </strong>
                  </li>
                ))}
              </ol>
            )}

            <div className="mt-10 p-6 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                Sources
              </div>
              <ul className="text-sm text-slate-600 space-y-1">
                {report.sources.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          </article>

          {/* RIGHT: meta */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-5">
              <div className="border border-slate-200 rounded-lg p-5">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                  In this report
                </div>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li className="flex items-center justify-between">
                    <span>Brands reviewed</span><strong>{report.brand_count}</strong>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Criteria scored</span><strong>{report.criteria_count}</strong>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>3rd-party sources</span><strong>{report.source_count}</strong>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Last verified</span><strong>{report.last_verified}</strong>
                  </li>
                </ul>
              </div>
              <div className="bg-brand-50 border border-brand-100 rounded-lg p-5">
                <div className="text-xs font-semibold text-brand-700 uppercase tracking-widest mb-2">
                  Subscribe
                </div>
                <p className="text-sm text-slate-700 mb-3">Get new findings every Monday.</p>
                <input
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded mb-2"
                  placeholder="you@email.com"
                />
                <button className="w-full py-2 text-sm bg-brand-600 text-white rounded font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-slate-500">
          <span>© 2026 FindInChina. Independent. Curated. Verified.</span>
          <div className="flex gap-6">
            <Link href="/">Home</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/findin">FindIn</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
