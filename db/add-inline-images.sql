-- Fix two things in one UPDATE:
-- 1. Remove the Chinese characters "星星充电" (replace with "Star Charge")
-- 2. Insert {{IMAGE:slug}} markers after each brand's heading
-- 3. Add inline_images JSON column data
-- 4. Replace the body with the marked version (image markers inline)

-- First: add inline_images column if not present
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS inline_images JSONB DEFAULT '{}'::jsonb;

-- Then update inline_images with all 6 brand image paths
UPDATE public.blog_posts SET
  inline_images = '{
    "engwe": "/brands/engwe.jpg",
    "himiway": "/brands/himiway.jpg",
    "urtopia": "/brands/urtopia.jpg",
    "tenways": "/brands/tenways.jpg",
    "lankeleisi": "/brands/lankeleisi.jpg",
    "star-charge": "/brands/star-charge.jpg"
  }'::jsonb
WHERE slug = '6-best-chinese-ebike-brands-2026';

-- Fix the Chinese characters in the existing body
UPDATE public.blog_posts
SET body = REPLACE(body, 'Star Charge (星星充电)', 'Star Charge')
WHERE slug = '6-best-chinese-ebike-brands-2026';

-- Insert {{IMAGE:slug}} markers right after each brand's heading
UPDATE public.blog_posts SET body = REPLACE(body,
E'## 1. ENGWE — folding, fat-tire, moped-style\n\n',
E'## 1. ENGWE — folding, fat-tire, moped-style\n\n{{IMAGE:engwe}}\n\n'
)
WHERE slug = '6-best-chinese-ebike-brands-2026';

UPDATE public.blog_posts SET body = REPLACE(body,
E'## 2. Himiway — US-headquartered fat-tire specialist\n\n',
E'## 2. Himiway — US-headquartered fat-tire specialist\n\n{{IMAGE:himiway}}\n\n'
)
WHERE slug = '6-best-chinese-ebike-brands-2026';

UPDATE public.blog_posts SET body = REPLACE(body,
E'## 3. Urtopia — carbon fiber at sub-$2k\n\n',
E'## 3. Urtopia — carbon fiber at sub-$2k\n\n{{IMAGE:urtopia}}\n\n'
)
WHERE slug = '6-best-chinese-ebike-brands-2026';

UPDATE public.blog_posts SET body = REPLACE(body,
E'## 4. TENWAYS — designed for Europe\n\n',
E'## 4. TENWAYS — designed for Europe\n\n{{IMAGE:tenways}}\n\n'
)
WHERE slug = '6-best-chinese-ebike-brands-2026';

UPDATE public.blog_posts SET body = REPLACE(body,
E'## 5. Lankeleisi — 2000W dual-motor, 3-year warranty\n\n',
E'## 5. Lankeleisi — 2000W dual-motor, 3-year warranty\n\n{{IMAGE:lankeleisi}}\n\n'
)
WHERE slug = '6-best-chinese-ebike-brands-2026';

UPDATE public.blog_posts SET body = REPLACE(body,
E'## 6. Star Charge — EV charging infrastructure\n\n',
E'## 6. Star Charge — EV charging infrastructure\n\n{{IMAGE:star-charge}}\n\n'
)
WHERE slug = '6-best-chinese-ebike-brands-2026';
