-- FindInChina: Update P1 brand_blocks gallery -> main_image (single product focus)
-- 2026-06-11
-- Report pages now show 1 main image (the recommended model) instead of carousel

-- ENGWE: Engine Pro 3.0 Boost
update findin_reports
set brand_blocks = (
  select jsonb_agg(
    case
      when b->>'slug' = 'engwe' then jsonb_set(b, '{gallery}', '["/brands/engwe/engwe-engine-pro-3.jpg"]'::jsonb)
      when b->>'slug' = 'himiway' then jsonb_set(b, '{gallery}', '["/brands/himiway/himiway-d5-2.jpg"]'::jsonb)
      when b->>'slug' = 'urtopia' then jsonb_set(b, '{gallery}', '["/brands/urtopia/urtopia-carbon-classic.jpg"]'::jsonb)
      when b->>'slug' = 'tenways' then jsonb_set(b, '{gallery}', '["/brands/tenways/tenways-cgo600.webp"]'::jsonb)
      when b->>'slug' = 'lankeleisi' then jsonb_set(b, '{gallery}', '["/brands/lankeleisi/lankeleisi-mg740plus.webp"]'::jsonb)
      when b->>'slug' = 'star-charge' then jsonb_set(b, '{gallery}', '["/brands/star-charge/starcharge-banner-1.jpg"]'::jsonb)
      else b
    end
  )
  from jsonb_array_elements(brand_blocks) as b
)
where slug = '6-chinese-ebike-brands-compared';

-- Verify
select slug, brand_blocks->0->>'slug' as first_brand, brand_blocks->0->'gallery' as first_gallery
from findin_reports
where slug = '6-chinese-ebike-brands-compared';
