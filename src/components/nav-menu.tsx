'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown, Bike, Zap, Headphones, Battery, ArrowRight, Globe, Award, Shield, Package } from 'lucide-react'

interface SubCategory {
  name: string
  href: string
  count?: number
}

interface Category {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  shortDesc: string
  subcategories: SubCategory[]
}

const CATEGORIES: Category[] = [
  {
    name: 'E-bike',
    href: '/categories/e-bike',
    icon: Bike,
    shortDesc: 'Folding, fat-tire, moped, road',
    subcategories: [
      { name: 'Folding e-bikes', href: '/categories/e-bike/folding', count: 2 },
      { name: 'Fat-tire e-bikes', href: '/categories/e-bike/fat-tire', count: 3 },
      { name: 'Moped-style', href: '/categories/e-bike/moped', count: 2 },
      { name: 'Cargo / family', href: '/categories/e-bike/cargo', count: 1 },
      { name: 'Carbon road', href: '/categories/e-bike/carbon', count: 1 },
    ],
  },
  {
    name: 'EV charging',
    href: '/categories/ev-charging',
    icon: Zap,
    shortDesc: 'Home, business, fleet',
    subcategories: [
      { name: 'Home / residential', href: '/categories/ev-charging/home' },
      { name: 'Business / commercial', href: '/categories/ev-charging/commercial' },
      { name: 'Energy storage', href: '/categories/ev-charging/storage' },
    ],
  },
  {
    name: 'Audio',
    href: '/categories/audio',
    icon: Headphones,
    shortDesc: 'Earbuds, headphones, DACs',
    subcategories: [
      { name: 'TWS earbuds', href: '/categories/audio/tws' },
      { name: 'Over-ear headphones', href: '/categories/audio/over-ear' },
      { name: 'Wired IEMs', href: '/categories/audio/iem' },
      { name: 'DACs & amps', href: '/categories/audio/dac' },
    ],
  },
  {
    name: 'Power & charging',
    href: '/categories/power',
    icon: Battery,
    shortDesc: 'Power banks, wall chargers',
    subcategories: [
      { name: 'Power banks', href: '/categories/power/powerbank' },
      { name: 'Wall chargers', href: '/categories/power/wall' },
      { name: 'Solar panels', href: '/categories/power/solar' },
    ],
  },
]

const BRAND_BROWSE = [
  {
    name: 'Browse by name',
    items: [
      { name: 'A–D', href: '/brands?letter=A-D' },
      { name: 'E–H', href: '/brands?letter=E-H' },
      { name: 'I–L', href: '/brands?letter=I-L' },
      { name: 'M–P', href: '/brands?letter=M-P' },
      { name: 'Q–T', href: '/brands?letter=Q-T' },
      { name: 'U–Z', href: '/brands?letter=U-Z' },
    ],
  },
  {
    name: 'Browse by category',
    items: CATEGORIES.map((c) => ({ name: c.name, href: c.href, count: c.subcategories.reduce((sum, s) => sum + (s.count || 0), 0) })),
  },
  {
    name: 'Browse by export market',
    items: [
      { name: 'Ships to United States', href: '/brands?market=US' },
      { name: 'Ships to Europe (EU)', href: '/brands?market=EU' },
      { name: 'Ships to United Kingdom', href: '/brands?market=UK' },
      { name: 'Ships to Canada', href: '/brands?market=CA' },
      { name: 'Ships to Asia-Pacific', href: '/brands?market=APAC' },
    ],
  },
]

// Issue 5 fix: use ref + 200ms delay to avoid flicker when mouse moves from trigger to dropdown
function useDropdown() {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<NodeJS.Timeout | null>(null)

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150)
  }

  return { open, handleEnter, handleLeave }
}

function CategoryMenu() {
  const { open, handleEnter, handleLeave } = useDropdown()
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].name)
  const active = CATEGORIES.find((c) => c.name === activeCategory)!

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        className="flex items-center gap-1 text-gray-700 hover:text-brand-600 whitespace-nowrap"
      >
        Categories
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute top-full right-0 pt-2 z-50">
          <div className="bg-white border rounded shadow-lg w-[640px] grid grid-cols-[180px_1fr]">
            {/* Left: 4 big categories */}
            <div className="bg-gray-50 p-3 border-r">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon
                const isActive = activeCategory === cat.name
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onMouseEnter={() => setActiveCategory(cat.name)}
                    onClick={() => { window.location.href = cat.href }}
                    className={`w-full flex items-start gap-2.5 p-2.5 text-left rounded transition-colors ${
                      isActive ? 'bg-white shadow-sm' : 'hover:bg-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isActive ? 'text-brand-600' : 'text-gray-500'}`} />
                    <div className="min-w-0">
                      <div className={`text-sm font-semibold ${isActive ? 'text-brand-600' : 'text-gray-900'}`}>
                        {cat.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {cat.shortDesc}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Right: subcategories of active category */}
            <div className="p-5">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">
                Browse {active.name}
              </div>
              <ul className="space-y-1">
                {active.subcategories.map((sub) => (
                  <li key={sub.href}>
                    <Link
                      href={sub.href}
                      className="flex items-center justify-between py-1.5 px-2 -mx-2 text-sm text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded transition-colors group"
                    >
                      <span className="flex items-center gap-2">
                        {sub.name}
                        {sub.count !== undefined && (
                          <span className="text-xs text-gray-400">({sub.count})</span>
                        )}
                      </span>
                      <ArrowRight className="h-3 w-3 text-gray-300 group-hover:text-brand-600" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t">
                <Link
                  href={active.href}
                  className="text-sm text-brand-600 font-medium hover:underline"
                >
                  See all {active.name.toLowerCase()} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BrandMenu() {
  const { open, handleEnter, handleLeave } = useDropdown()

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        className="flex items-center gap-1 text-gray-700 hover:text-brand-600 whitespace-nowrap"
      >
        All brands
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute top-full right-0 pt-2 z-50">
          <div className="bg-white border rounded shadow-lg w-[640px] grid grid-cols-3">
            {BRAND_BROWSE.map((section) => (
              <div key={section.name} className="p-5 border-r last:border-r-0">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">
                  {section.name}
                </div>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between py-1.5 px-2 -mx-2 text-sm text-gray-700 hover:text-brand-600 hover:bg-gray-50 rounded transition-colors group"
                      >
                        <span className="flex items-center gap-2">
                          {item.name}
                          {'count' in item && item.count !== undefined && (
                            <span className="text-xs text-gray-400">({item.count})</span>
                          )}
                        </span>
                        <ArrowRight className="h-3 w-3 text-gray-300 group-hover:text-brand-600" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-3 p-4 bg-gray-50 border-t flex items-center gap-3">
              <Award className="h-5 w-5 text-brand-600" />
              <div className="flex-1 text-sm text-gray-600">
                6 verified brands. Each one reviewed by our editorial team.
              </div>
              <Link
                href="/brands"
                className="text-sm text-brand-600 font-medium hover:underline"
              >
                See all 6 brands →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function NavMenu() {
  return (
    <nav className="flex items-center gap-5 text-sm flex-shrink-0">
      <CategoryMenu />
      <BrandMenu />
      <Link href="/findin" className="text-gray-700 hover:text-brand-600 whitespace-nowrap">
        FindIn
      </Link>
      <Link href="/blog" className="text-gray-700 hover:text-brand-600 whitespace-nowrap">
        Blog
      </Link>
      <Link
        href="#newsletter"
        className="px-4 py-2 bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors whitespace-nowrap rounded-md"
      >
        Subscribe
      </Link>
    </nav>
  )
}
