-- Update gallery[0] for 3 brands to use white-bg product images
-- This makes the 6 brand cards on the homepage visually consistent

UPDATE brands
SET gallery = jsonb_set(gallery, '{0,src}', '"/brands/himiway/himiway-d5-camo.jpg"')
WHERE slug = 'himiway';

UPDATE brands
SET gallery = jsonb_set(gallery, '{0,src}', '"/brands/urtopia/urtopia-carbon-1-pro.webp"')
WHERE slug = 'urtopia';

UPDATE brands
SET gallery = jsonb_set(gallery, '{0,src}', '"/brands/star-charge/starcharge-banner-2.jpg"')
WHERE slug = 'star-charge';

-- Verify
SELECT slug, gallery->0->>'src' as first_image
FROM brands
WHERE slug IN ('himiway', 'urtopia', 'star-charge');
