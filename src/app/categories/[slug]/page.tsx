import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NavMenu } from '@/components/nav-menu'
import { BrandCard } from '@/components/brand-card'
import { Bike, Zap, Headphones, Battery } from 'lucide-react'

const CATEGORY_META: Record<string, { name: string; description: string; icon: any; subcategories: { name: string; slug: string }[] }> = {
  'e-bike': {
    name: 'E-bike',
    description: 'Folding, fat-tire, moped, and carbon-fiber e-bikes. We verify each brand by checking export history, manufacturing capacity, and warranty terms.',
    icon: Bike,
    subcategories: [
      { name: 'Folding e-bikes', slug: 'folding' },
      { name: 'Fat-tire e-bikes', slug: 'fat-tire' },
      { name: 'Moped-style', slug: 'moped' },
      { name: 'Cargo / family', slug: 'cargo' },
      { name: 'Carbon road', slug: 'carbon' },
    ],
  },
  'ev-charging': {
    name: 'EV charging',
    description: 'Home, business, and commercial EV chargers from Chinese manufacturers.',
    icon: Zap,
    subcategories: [
      { name: 'Home / residential', slug: 'home' },
      { name: 'Business / commercial', slug: 'commercial' },
      { name: 'Energy storage', slug: 'storage' },
    ],
  },
  audio: {
    name: 'Audio',
    description: 'TWS earbuds, headphones, and DACs from Chinese audio brands.',
    icon: Headphones,
    subcategories: [
      { name: 'TWS earbuds', slug: 'tws' },
      { name: 'Over-ear headphones', slug: 'over-ear' },
      { name: 'Wired IEMs', slug: 'iem' },
      { name: 'DACs & amps', slug: 'dac' },
    ],
  },
  power: {
    name: 'Power & charging',
    description: 'Power banks, wall chargers, and solar panels from Chinese brands.',
    icon: Battery,
    subcategories: [
      { name: 'Power banks', slug: 'powerbank' },
      { name: 'Wall chargers', slug: 'wall' },
      { name: 'Solar panels', slug: 'solar' },
    ],
  },
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const meta = CATEGORY_META[params.slug]
  if (!meta) return { title: 'Category — FindInChina' }
  return {
    title: `${meta.name} — FindInChina`,
    description: meta.description,
  }
}

export const revalidate = 60

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const meta = CATEGORY_META[params.slug]
  if (!meta) notFound()

  const supabase = createClient()
  // Map slug -> category field in DB
  // For now, fetch all verified and filter by description content (since category field is in Chinese)
  // TODO: when category field is fixed to English, filter by category directly
  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('verified', true)
    .order('rating_avg', { ascending: false })

  // For e-bike category, show all 5 e-bike brands (not star-charge)
  // For ev-charging, show star-charge
  // For audio/power, no brands yet
  let filteredBrands = brands || []
  if (params.slug === 'e-bike') {
    filteredBrands = filteredBrands.filter((b) => b.slug !== 'star-charge')
  } else if (params.slug === 'ev-charging') {
    filteredBrands = filteredBrands.filter((b) => b.slug === 'star-charge')
  } else {
    filteredBrands = []
  }

  const Icon = meta.icon

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
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900">{meta.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-brand-100 flex items-center justify-center rounded">
              <Icon className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{meta.name}</h1>
              <p className="text-gray-600 mt-1">
                {filteredBrands.length > 0
                  ? `${filteredBrands.length} verified ${filteredBrands.length === 1 ? 'brand' : 'brands'}`
                  : 'No verified brands yet — check back soon'}
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-700 mt-5 max-w-3xl leading-relaxed">
            {meta.description}
          </p>
        </div>
      </section>

      {/* Subcategories */}
      {meta.subcategories.length > 0 && (
        <section className="py-6 border-b">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap gap-2">
              {meta.subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/categories/${params.slug}/${sub.slug}`}
                  className="px-4 py-2 border rounded hover:border-brand-600 hover:bg-brand-50 text-sm transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands list */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          {filteredBrands.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredBrands.map((brand) => (
                <BrandCard key={brand.id} brand={brand} variant="default" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 max-w-2xl mx-auto">
              <p className="text-gray-500">
                We don't have any verified brands in this category yet. We're working on it — expect 3-5 brands in the next 30 days.
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
