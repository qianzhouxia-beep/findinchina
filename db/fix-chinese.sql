-- Remove Chinese characters from article body
-- Single-line replacement
UPDATE public.blog_posts
SET body = REPLACE(body, 'Star Charge (星星充电)', 'Star Charge')
WHERE slug = '6-best-chinese-ebike-brands-2026';
