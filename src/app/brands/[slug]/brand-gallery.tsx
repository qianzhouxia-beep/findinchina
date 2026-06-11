'use client'

import { useState } from 'react'
import Image from 'next/image'

interface GalleryItem {
  src: string
  model_name: string
  category: string
}

export function BrandGallery({
  brandName,
  gallery,
  fallbackSrc,
}: {
  brandName: string
  gallery: GalleryItem[]
  fallbackSrc: string
}) {
  const items = gallery && gallery.length > 0 ? gallery : [{ src: fallbackSrc, model_name: brandName, category: '' }]
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const active = items[activeIndex]

  return (
    <>
      <div className="relative aspect-square w-full bg-gray-100 overflow-hidden rounded">
        <Image
          src={active.src}
          alt={`${active.model_name} — ${brandName}`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain cursor-zoom-in"
          priority
          onClick={() => setLightbox(true)}
        />
        {/* Bottom model name strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
          <div className="text-[10px] font-semibold text-white/80 uppercase tracking-widest">
            {active.category}
          </div>
          <div className="font-serif text-xl font-bold text-white mt-0.5">
            {active.model_name}
          </div>
        </div>
      </div>
      {/* Thumbnail strip */}
      <div className="mt-3 grid grid-cols-5 gap-2">
        {items.slice(0, 5).map((it, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative aspect-square bg-gray-100 overflow-hidden rounded border-2 cursor-pointer ${
              i === activeIndex ? 'border-brand-600' : 'border-transparent hover:border-brand-300'
            }`}
            type="button"
            aria-label={`View ${it.model_name}`}
          >
            <Image
              src={it.src}
              alt={it.model_name}
              fill
              sizes="100px"
              className="object-contain"
            />
          </button>
        ))}
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
          <Image
            src={active.src}
            alt={active.model_name}
            width={1600}
            height={1200}
            className="max-w-full max-h-full rounded"
          />
          <div className="absolute bottom-5 text-white text-center">
            <div className="font-serif text-lg font-bold">{active.model_name}</div>
            <div className="text-sm text-white/80">{active.category}</div>
            <div className="text-xs text-white/60 mt-1">Click anywhere to close · {activeIndex + 1} of {items.length}</div>
          </div>
        </div>
      )}
    </>
  )
}
