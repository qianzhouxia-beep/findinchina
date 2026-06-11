import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, MapPin, ExternalLink } from 'lucide-react'
import { brandFallback } from '@/lib/brand-fallback'

interface BrandCardProps {
  brand: any
  variant?: 'default' | 'feature' | 'compact'
}

export function BrandCard({ brand, variant = 'default' }: BrandCardProps) {
  const gallery = brand.gallery as Array<{ src: string }> | null
  const imgPath = gallery?.[0]?.src || brandFallback(brand.slug)

  if (variant === 'feature') {
    return (
      <Link
        href={`/brands/${brand.slug}`}
        className="group block relative overflow-hidden bg-black rounded"
      >
        <div className="relative aspect-square w-full">
          <Image
            src={imgPath}
            alt={brand.name_en}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            {brand.verified && (
              <span className="inline-flex items-center gap-1 text-xs bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full mb-3">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            )}
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
              {brand.name_en}
            </h3>
            <p className="text-sm md:text-base opacity-90 mt-1">
              {brand.subcategory || brand.category}
            </p>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/brands/${brand.slug}`}
        className="group flex gap-4 hover:bg-gray-50 -mx-3 px-3 py-3 rounded-md transition-colors"
      >
        <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 overflow-hidden rounded">
          <Image
            src={imgPath}
            alt={brand.name_en}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold truncate">{brand.name_en}</h4>
            {brand.verified && <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {brand.export_countries?.length || 0} countries
          </p>
          <p className="text-sm text-gray-700 mt-1 line-clamp-2">
            {brand.description?.slice(0, 80)}…
          </p>
        </div>
      </Link>
    )
  }

  // default: large card with image
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group block"
    >
      <div className="relative aspect-square w-full bg-gray-100 overflow-hidden rounded">
        <Image
          src={imgPath}
          alt={brand.name_en}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {brand.verified && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs bg-white/95 backdrop-blur-sm text-gray-900 px-2.5 py-1 rounded-full font-medium">
            <CheckCircle2 className="h-3 w-3 text-green-600" />
            Verified
          </span>
        )}
      </div>
      <div className="pt-4">
        <h3 className="text-lg font-semibold tracking-tight">
          {brand.name_en}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          {brand.subcategory || brand.category}
        </p>
        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
          {brand.description}
        </p>
        {brand.export_countries && brand.export_countries.length > 0 && (
          <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Ships to {brand.export_countries.length} countries
          </p>
        )}
      </div>
    </Link>
  )
}