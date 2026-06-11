// Default first image per brand slug (used as fallback when DB gallery is null)
const BRAND_FALLBACK_IMAGE: Record<string, string> = {
  engwe: '/brands/engwe/engwe-engine-pro-3.jpg',
  himiway: '/brands/himiway/himiway-d5-camo.jpg',
  urtopia: '/brands/urtopia/urtopia-carbon-1-pro.webp',
  tenways: '/brands/tenways/tenways-cgo600.webp',
  lankeleisi: '/brands/lankeleisi/lankeleisi-mg740plus.webp',
  'star-charge': '/brands/star-charge/starcharge-banner-2.jpg',
}

export function brandFallback(slug: string): string {
  return BRAND_FALLBACK_IMAGE[slug] || `/brands/${slug}/${slug}-1.jpg`
}
