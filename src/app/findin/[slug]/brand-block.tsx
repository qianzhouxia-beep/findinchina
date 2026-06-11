'use client'

import { useState } from 'react'
import { brandFallback } from '@/lib/brand-fallback'

interface BrandBlock {
  slug: string
  brand_name: string
  quick_take: string
  expert_quote: string
  expert_source: string
  why_vetted: string[]
  who_for: string[]
  // gallery kept for main_image fallback; report page shows 1 main image only
  gallery?: string[]
  main_image?: string
}

export function BrandBlock({ block, index }: { block: BrandBlock; index: number }) {
  const [lightbox, setLightbox] = useState(false)
  const mainImage =
    block.main_image ||
    (block.gallery && block.gallery[0]) ||
    brandFallback(block.slug)

  return (
    <>
      <h2
        id={block.slug}
        className="font-serif text-3xl font-bold mt-16 mb-2 pt-4 border-t border-slate-200 scroll-mt-6"
      >
        {index}. {block.brand_name}
      </h2>
      <div className="flex items-center gap-3 mb-6 text-sm">
        <a href={`/brands/${block.slug}`} className="text-brand-600 hover:underline">
          View full profile →
        </a>
      </div>

      {/* Single main image (one specific product, not a carousel) — 1:1 white-bg, matches brand-page gallery style */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden rounded mb-6 max-h-[520px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mainImage}
          alt={block.brand_name}
          onClick={() => setLightbox(true)}
          className="w-full h-full object-contain p-3 cursor-zoom-in"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
          <div className="text-[10px] font-semibold text-white/80 uppercase tracking-widest">
            {block.brand_name} — recommended model
          </div>
        </div>
      </div>

      {/* Quick take */}
      <div className="bg-brand-50 border-l-4 border-brand-600 px-5 py-4 mb-5 rounded-r">
        <div className="text-[10px] font-semibold text-brand-700 uppercase tracking-widest mb-1">
          Quick take
        </div>
        <p className="font-serif text-lg leading-relaxed text-slate-800">{block.quick_take}</p>
      </div>

      {/* Expert quote */}
      <blockquote className="border-l-4 border-slate-300 pl-5 py-2 mb-6">
        <p className="font-serif text-lg italic text-slate-700 mb-2">
          &ldquo;{block.expert_quote}&rdquo;
        </p>
        <footer className="text-sm text-slate-500">— {block.expert_source}</footer>
      </blockquote>

      {/* Two-column: Why vetted / Who for */}
      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Why we vetted
          </h3>
          <ul className="text-sm text-slate-700 space-y-1.5">
            {block.why_vetted.map((v, i) => (
              <li key={i}>✓ {v}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Who it&rsquo;s for
          </h3>
          <ul className="text-sm text-slate-700 space-y-1.5">
            {block.who_for.map((v, i) => (
              <li key={i}>→ {v}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm grid place-items-center p-6"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-5 right-5 text-white text-3xl"
            onClick={() => setLightbox(false)}
            type="button"
            aria-label="Close"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mainImage}
            alt={block.brand_name}
            className="max-w-full max-h-full rounded"
          />
          <div className="absolute bottom-5 text-white text-sm">
            Click anywhere to close
          </div>
        </div>
      )}
    </>
  )
}
