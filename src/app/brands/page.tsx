import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { NavMenu } from '@/components/nav-menu'
import { CheckCircle2, ExternalLink, MapPin } from 'lucide-react'

interface PageProps {
  searchParams: { letter?: string; market?: string }
}

export const metadata = {
  title: 'All brands — FindInChina',
  description: 'Browse all verified Chinese brands on FindInChina. Filter by name, category, or export market.',
}

export const revalidate = 60

export default async function BrandsPage({ searchParams }: PageProps) {
  const supabase = createClient()
  const { letter, market } = searchParams

  let query = supabase
    .from('brands')
    .select('*')
    .eq('verified', true)
    .order('name_en', { ascending: true })

  const { data: brands } = await query

  // Client-side filter (Supabase JS doesn't have great letter-range support out of the box)
  let filtered = brands || []
  if (letter) {
    // letter param is "A-D" format
    const match = letter.match(/^([A-Z])-([A-Z])$/i)
    if (match) {
      const start = match[1].toUpperCase()
      const end = match[2].toUpperCase()
      filtered = filtered.filter((b) => {
        const first = (b.name_en || '').charAt(0).toUpperCase()
        return first >= start && first <= end
      })
    }
  }
  if (market) {
    filtered = filtered.filter((b) => {
      const countries = b.export_countries || []
      return countries.some((c: string) =>
        market === 'US' ? c === 'US' :
        market === 'EU' ? ['DE','FR','NL','IT','ES','PL','AT','BE','CH','IE','SE','FI','NO','DK'].includes(c) :
        market === 'UK' ? c === 'UK' :
        market === 'CA' ? c === 'CA' :
        market === 'APAC' ? ['JP','AU','APAC'].includes(c) :
        c === market
      )
    })
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4 flex-nowrap">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image src="/findinchina-icon.png" alt="FindInChina" width={36} height={36} priority className="h-9 w-9" />
            <span className="text-xl font-bold text-brand-600 tracking-tight">FindInChina</span>
          </Link>
          <NavMenu />
        </div>
      </header>

      {/* Hero */}
      <section className="border-b bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Brands</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            {letter ? `Brands starting with ${letter}` : market ? `Brands shipping to ${market}` : 'All verified brands'}
          </h1>
          <p className="text-lg text-gray-600 mt-3">
            {filtered.length} {filtered.length === 1 ? 'brand' : 'brands'}
            {(letter || market) && (
              <> · <Link href="/brands" className="text-brand-600 hover:underline">Clear filters</Link></>
            )}
          </p>
        </div>
      </section>

      {/* A-Z quick links */}
      <section className="py-6 border-b">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-gray-500">Jump to:</span>
            {['A-D', 'E-H', 'I-L', 'M-P', 'Q-T', 'U-Z'].map((range) => (
              <Link
                key={range}
                href={`/brands?letter=${range}`}
                className={`px-2 py-1 rounded ${
                  letter === range ? 'bg-brand-600 text-white' : 'text-gray-700 hover:text-brand-600'
                }`}
              >
                {range}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brands list */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group block border p-5 rounded hover:border-brand-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        {brand.subcategory || brand.category}
                      </div>
                      <h3 className="text-lg font-semibold mt-1 group-hover:text-brand-600">
                        {brand.name_en}
                      </h3>
                    </div>
                    {brand.verified && <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {brand.description}
                  </p>
                  {brand.export_countries && brand.export_countries.length > 0 && (
                    <p className="text-xs text-gray-500 mt-3 inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Ships to {brand.export_countries.length} countries
                    </p>
                  )}
                  {brand.website && (
                    <p className="text-xs text-brand-600 mt-2 inline-flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Visit site
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No brands match this filter. <Link href="/brands" className="text-brand-600 hover:underline">View all brands</Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div>© 2026 FindInChina. Independent. Curated. Verified.</div>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-brand-600">About</Link>
            <Link href="/blog" className="hover:text-brand-600">Blog</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
