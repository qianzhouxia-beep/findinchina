import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { CheckCircle2, MapPin, Mail, Phone, ExternalLink, ArrowLeft, Package, Globe, Award, Shield, ArrowRight } from 'lucide-react'
import { NavMenu } from '@/components/nav-menu'
import { BrandGallery } from './brand-gallery'

interface BrandPageProps {
  params: { slug: string }
}

export const revalidate = 60

export default async function BrandPage({ params }: BrandPageProps) {
  const supabase = createClient()

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!brand) {
    notFound()
  }

  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .eq('brand_id', brand.id)
    .limit(20)

  // Detail page gallery: use the main product image + a few contextual shots
  // (real data we don't have yet, so we show the main one and a styled fallback grid)
  const heroImage = `/brands/${brand.slug}.jpg`

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4 flex-nowrap">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="FindInChina home">
            <Image
              src="/findinchina-icon.png"
              alt="FindInChina"
              width={36}
              height={36}
              priority
              className="h-9 w-9"
            />
            <span className="text-xl font-bold text-brand-600 tracking-tight">FindInChina</span>
          </Link>
          <NavMenu />
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-3 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/brands" className="hover:text-brand-600 inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            All brands
          </Link>
          <span>/</span>
          <span className="text-gray-900">{brand.name_en}</span>
        </div>
      </div>

      {/* Hero - photo-led, multi-image gallery */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <BrandGallery
                brandName={brand.name_en}
                gallery={(brand.gallery as Array<{ src: string; model_name: string; category: string }>) || []}
                fallbackSrc={heroImage}
              />
              {brand.verified && (
                <div className="mt-3 inline-flex items-center gap-1.5 text-sm bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified by FindInChina
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                {brand.subcategory || brand.category}
                {brand.country_origin ? ` · Made in ${brand.country_origin}` : ''}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mt-2 text-balance">
                {brand.name_en}
              </h1>
              {brand.name && brand.name !== brand.name_en && (
                <div className="text-lg text-gray-500 mt-1">{brand.name}</div>
              )}

              {/* Quick stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {brand.price_min && brand.price_max && (
                  <div className="border-l-2 border-brand-600 pl-3">
                    <div className="text-xs text-gray-500">International retail</div>
                    <div className="text-lg font-semibold">
                      ${brand.price_min.toLocaleString()} – ${brand.price_max.toLocaleString()}
                    </div>
                  </div>
                )}
                {brand.export_countries && (
                  <div className="border-l-2 border-gray-200 pl-3">
                    <div className="text-xs text-gray-500">Export markets</div>
                    <div className="text-lg font-semibold">
                      {brand.export_countries.length}+ countries
                    </div>
                  </div>
                )}
                {brand.warranty && (
                  <div className="border-l-2 border-gray-200 pl-3">
                    <div className="text-xs text-gray-500">Warranty</div>
                    <div className="text-lg font-semibold">{brand.warranty}</div>
                  </div>
                )}
                {brand.founded_year && (
                  <div className="border-l-2 border-gray-200 pl-3">
                    <div className="text-xs text-gray-500">Founded</div>
                    <div className="text-lg font-semibold">{brand.founded_year}</div>
                  </div>
                )}
              </div>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors rounded-md"
                  >
                    Visit official site
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {brand.contact_email && (
                  <a
                    href={`mailto:${brand.contact_email}`}
                    className="inline-flex items-center gap-2 px-5 py-3 border border-gray-300 hover:border-brand-600 hover:text-brand-600 font-medium transition-colors rounded-md"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details - 4 sections reserved for future */}
      <section className="py-14 md:py-20 border-b">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            What this brand makes
          </h2>
          <p className="text-gray-600 mt-2">
            Product line overview. For each model: price, key spec, who it's for.
          </p>

          {/* Reserved: spec table (we'll fill once we have 3+ verified products) */}
          <div className="mt-8 p-6 border-2 border-dashed border-gray-200 rounded-md bg-gray-50">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Reserved section</div>
            <h3 className="font-semibold mt-1 text-gray-700">Product comparison table</h3>
            <p className="text-sm text-gray-500 mt-1">
              Will list 3-6 top-selling models with: model name, price, range, motor, weight, warranty. Will be filled as we add more verified products.
            </p>
          </div>
        </div>
      </section>

      {/* Compare with similar - cross-brand comparison */}
      <section className="py-14 md:py-20 bg-gray-50 border-b">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            How it compares
          </h2>
          <p className="text-gray-600 mt-2">
            Side-by-side with similar brands in the same category. Quick read, no marketing.
          </p>
          <div className="mt-8 p-6 border-2 border-dashed border-gray-200 rounded-md bg-white">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Reserved section</div>
            <h3 className="font-semibold mt-1 text-gray-700">3-way comparison table</h3>
            <p className="text-sm text-gray-500 mt-1">
              Will show {brand.name_en} alongside 2-3 competitors in the same price range. Columns: price, key spec, warranty, export markets, where to buy.
            </p>
            <div className="mt-4">
              <Link
                href="/compare"
                className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
              >
                See all comparisons
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">About</h2>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed">
            {brand.description}
          </p>
          {brand.description_cn && (
            <p className="mt-4 text-base text-gray-600 leading-relaxed pl-4 border-l-2 border-gray-200">
              {brand.description_cn}
            </p>
          )}
        </div>
      </section>

      {/* Expert Review + User Quotes */}
      {(brand.expert_review_source || (brand.user_quotes && brand.user_quotes.length > 0)) && (
        <section className="py-14 md:py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Independent reviews
            </h2>
            <p className="text-gray-600 mt-2">
              What third-party reviewers and real buyers say. Not the brand's own marketing.
            </p>

            <div className="mt-8 grid lg:grid-cols-3 gap-6">
              {/* Expert review card */}
              {brand.expert_review_source && (
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide">
                    <span>Expert review</span>
                    {brand.expert_review_rating && (
                      <span className="ml-auto text-base font-semibold text-gray-900 normal-case tracking-normal">
                        {brand.expert_review_rating}/100
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {brand.expert_review_source}
                  </div>
                  {brand.expert_review_quote && (
                    <blockquote className="mt-4 text-lg text-gray-800 leading-relaxed border-l-4 border-brand-600 pl-4">
                      "{brand.expert_review_quote}"
                    </blockquote>
                  )}
                  {brand.expert_review_url && (
                    <a
                      href={brand.expert_review_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline"
                    >
                      Read the full review
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* User quotes */}
              {brand.user_quotes && brand.user_quotes.length > 0 && (
                <div className="space-y-4">
                  {brand.user_quotes.slice(0, 2).map((q: any, i: number) => (
                    <div key={i} className="bg-white p-5 rounded-md">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Buyer</div>
                      <div className="mt-1 font-semibold">{q.author || 'Anonymous buyer'}</div>
                      <blockquote className="mt-3 text-sm text-gray-700 leading-relaxed">
                        "{q.quote}"
                      </blockquote>
                      {q.source && (
                        <div className="mt-2 text-xs text-gray-500">via {q.source}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Why we verified this brand - value proposition */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            What we verified
          </h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-md">
              <Globe className="h-5 w-5 text-brand-600" />
              <h3 className="font-semibold mt-3">Real export operation</h3>
              <p className="text-sm text-gray-600 mt-1">
                Ships to {brand.export_countries?.length || 0}+ countries with localized sites.
              </p>
            </div>
            <div className="bg-white p-5 rounded-md">
              <Shield className="h-5 w-5 text-brand-600" />
              <h3 className="font-semibold mt-3">Warranty honored</h3>
              <p className="text-sm text-gray-600 mt-1">
                {brand.warranty || 'Warranty terms published and tracked.'}
              </p>
            </div>
            <div className="bg-white p-5 rounded-md">
              <Package className="h-5 w-5 text-brand-600" />
              <h3 className="font-semibold mt-3">Product line current</h3>
              <p className="text-sm text-gray-600 mt-1">
                Active 2026 product line, not a discontinued brand.
              </p>
            </div>
            <div className="bg-white p-5 rounded-md">
              <Award className="h-5 w-5 text-brand-600" />
              <h3 className="font-semibold mt-3">Direct contact available</h3>
              <p className="text-sm text-gray-600 mt-1">
                {brand.contact_email || 'Contact form on the official site.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations / Dealers */}
      {locations && locations.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Authorized dealers ({locations.length})
            </h2>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {locations.map((loc) => (
                <div key={loc.id} className="border p-5 rounded-md">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold">{loc.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{loc.type}</div>
                    </div>
                    {loc.verified && <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />}
                  </div>
                  {loc.address && <div className="text-sm text-gray-600 mt-3">{loc.address}</div>}
                  <div className="text-sm text-gray-600">{loc.city}, {loc.country}</div>
                  {loc.phone && <div className="text-sm text-gray-600 mt-2">📞 {loc.phone}</div>}
                  {loc.email && <div className="text-sm text-gray-600">✉️ {loc.email}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tags */}
      {brand.tags && brand.tags.length > 0 && (
        <section className="py-10 border-t">
          <div className="mx-auto max-w-7xl px-6 flex flex-wrap gap-2">
            {brand.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t py-10 mt-8">
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