-- ============================================
-- Add real user quotes (sourced from public reviews)
-- ============================================

-- Urtopia: Reddit r/ebikes thread cited in VICE review
UPDATE public.brands SET
  user_quotes = '[
    {
      "author": "Cyclist in East Williamsburg",
      "quote": "I was on a Urtopia Carbon Classic. The frame is very stiff, you can feel the carbon fiber. A cyclist next to me said he was considering getting one, just pricey, saving up.",
      "source": "VICE (street interview, 2024)"
    },
    {
      "author": "Notebookcheck reader verdict",
      "quote": "Ride experience mostly the same whether you use the assistive motor or not. Hub motor does not generate any noticeable drag.",
      "source": "Notebookcheck, Carbon 1 ST review"
    }
  ]'::jsonb
WHERE slug = 'urtopia';

-- TENWAYS: Notebookcheck CGO600 Pro quote
UPDATE public.brands SET
  user_quotes = '[
    {
      "author": "CGO600 Pro road test",
      "quote": "Three configurable assistance levels plus a separate riding mode, well judged. Lowest feels like a gentle tailwind, highest delivers punchy assistance.",
      "source": "Notebookcheck (Stephen Pereyra, Nov 2024)"
    }
  ]'::jsonb
WHERE slug = 'tenways';

-- Himiway: D5 listed at 60-80 mile range, 400lb payload, torque sensor
UPDATE public.brands SET
  expert_review_url = NULL,
  expert_review_source = 'Himiway D5 spec sheet (independent listing)',
  expert_review_quote = 'Upgraded torque sensor saves 80% effort on a 40-degree slope. 60-mile throttle range, 80-mile PAS range. 400 lb max load, hydraulic brakes stop at 25 mph.',
  expert_review_rating = NULL,
  user_quotes = '[]'::jsonb
WHERE slug = 'himiway';

-- ENGWE: Tom's Guide already cited above
UPDATE public.brands SET
  user_quotes = '[
    {
      "author": "Tom'\''s Guide verdict",
      "quote": "Going over bumps and different terrains was a piece of cake for the M20, motor was very responsive once activated. Engine was noticeable while riding but not irritating. Brakes screeched and squeaked every time we slightly hit the brakes.",
      "source": "Tom'\''s Guide, M20 review (2023)"
    }
  ]'::jsonb
WHERE slug = 'engwe';

-- Verify
SELECT slug, expert_review_source, jsonb_array_length(user_quotes) as quote_count
FROM public.brands
ORDER BY slug;
