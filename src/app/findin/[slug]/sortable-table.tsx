'use client'

import { useState } from 'react'

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

export function SortableTable({ initialRows }: { initialRows: ComparisonRow[] }) {
  const [rows, setRows] = useState<ComparisonRow[]>(initialRows)
  const [active, setActive] = useState<'asc' | 'desc' | 'rating-desc'>('asc')

  const applySort = (dir: 'asc' | 'desc' | 'rating-desc') => {
    setActive(dir)
    const sorted = [...rows].sort((a, b) => {
      // Star Charge (price=0) always last
      if (dir === 'rating-desc') {
        if (a.rating === b.rating) return 0
        return b.rating - a.rating
      }
      if (a.price === 0) return 1
      if (b.price === 0) return -1
      return dir === 'asc' ? a.price - b.price : b.price - a.price
    })
    setRows(sorted)
  }

  const btnClass = (dir: 'asc' | 'desc' | 'rating-desc') =>
    `px-3 py-1.5 rounded-full text-xs font-semibold ${
      active === dir
        ? 'bg-slate-900 text-white'
        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
    }`

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-5 text-sm">
        <span className="text-slate-500 mr-1">Sort by price:</span>
        <button className={btnClass('asc')} onClick={() => applySort('asc')} type="button">
          Low → High
        </button>
        <button className={btnClass('desc')} onClick={() => applySort('desc')} type="button">
          High → Low
        </button>
        <span className="mx-2 text-slate-300">|</span>
        <span className="text-slate-500 mr-1">Sort by rating:</span>
        <button className={btnClass('rating-desc')} onClick={() => applySort('rating-desc')} type="button">
          Best → Worst
        </button>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-x-auto">
        <table className="w-full text-[15px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left">
              <th className="px-5 py-4 font-semibold">Brand</th>
              <th className="px-5 py-4 font-semibold">Starting price</th>
              <th className="px-5 py-4 font-semibold">Top range</th>
              <th className="px-5 py-4 font-semibold">Power</th>
              <th className="px-5 py-4 font-semibold">Export</th>
              <th className="px-5 py-4 font-semibold">Warranty</th>
              <th className="px-5 py-4 font-semibold">3rd-party</th>
              <th className="px-5 py-4 font-semibold">Our rating</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.brand_slug} className="border-b border-slate-100 last:border-0 hover:bg-brand-50">
                <td className="px-5 py-4 font-semibold">
                  <a href={`/brands/${row.brand_slug}`} className="hover:text-brand-600">
                    {row.brand_name}
                  </a>
                </td>
                <td className="px-5 py-4">{row.price_label}</td>
                <td className="px-5 py-4">{row.range}</td>
                <td className="px-5 py-4">{row.power}</td>
                <td className="px-5 py-4">{row.countries}</td>
                <td className="px-5 py-4">{row.warranty}</td>
                <td className="px-5 py-4 text-slate-600">{row.third_party}</td>
                <td className="px-5 py-4">
                  <RatingStars rating={row.rating} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function RatingStars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  const empty = 5 - full - (hasHalf ? 1 : 0)
  return (
    <span>
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f${i}`} className="text-amber-500">★</span>
      ))}
      {hasHalf && <span className="text-amber-500">⯨</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e${i}`} className="text-slate-300">★</span>
      ))}{' '}
      <span className="text-xs text-slate-500">
        {rating.toFixed(1)}/5
      </span>
    </span>
  )
}
