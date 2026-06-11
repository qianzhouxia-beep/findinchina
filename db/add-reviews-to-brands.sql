-- ============================================
-- FindInChina: Add review/quote columns to brands
-- Run in Supabase SQL Editor
-- ============================================

ALTER TABLE public.brands
  ADD COLUMN IF NOT EXISTS expert_review_url TEXT,
  ADD COLUMN IF NOT EXISTS expert_review_source TEXT,
  ADD COLUMN IF NOT EXISTS expert_review_quote TEXT,
  ADD COLUMN IF NOT EXISTS expert_review_rating NUMERIC,
  ADD COLUMN IF NOT EXISTS user_quotes JSONB DEFAULT '[]'::jsonb;

-- Seed with REAL review data (sourced June 2026)
UPDATE public.brands SET
  expert_review_url = 'https://www.vice.com/en/via/urtopia-carbon-classic-review/',
  expert_review_source = 'VICE',
  expert_review_quote = 'Carbon frame is very stiff, $1,999 is on the lower end of mid-priced for an electric bike. Other cyclists recognized the brand on sight.',
  expert_review_rating = NULL
WHERE slug = 'urtopia';

UPDATE public.brands SET
  expert_review_url = 'https://www.notebookcheck.net/Tenways-CGO600-Pro-Review-A-sleek-and-modern-entry-level-e-bike.913551.0.html',
  expert_review_source = 'Notebookcheck (Stephen Pereyra, Nov 2024)',
  expert_review_quote = 'Cost-effective and minimalist e-bike with several great features. Gates carbon belt drive is responsive, ride experience mostly the same with or without assistive motor.',
  expert_review_rating = 84
WHERE slug = 'tenways';

UPDATE public.brands SET
  expert_review_url = NULL,
  expert_review_source = 'Tom''s Guide (2023 review)',
  expert_review_quote = 'Powerful motor, USB-A port in the battery, quick brakes, bright headlights. Screeched when braking, no accompanying app, no water bottle holder.',
  expert_review_rating = 3.5
WHERE slug = 'engwe';

-- Verify
SELECT slug, expert_review_source, expert_review_rating
FROM public.brands
WHERE expert_review_source IS NOT NULL;
