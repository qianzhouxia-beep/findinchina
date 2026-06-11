-- FindIn: P1 seed data — "5 Chinese e-bike brands, compared head to head"
-- 2026-06-11  v2: removed Star Charge (B2B EV charger, not comparable to consumer e-bikes)
-- Run AFTER create-findin-table.sql

insert into findin_reports (
  slug, title, subtitle, category, status, brand_count, criteria_count, source_count,
  read_time_min, last_verified, published_at, cover_image_url, excerpt,
  intro_text, criteria_text, brand_blocks, methodology_text, sources, comparison_rows
)
values (
  '6-chinese-ebike-brands-compared',
  '5 Chinese e-bike brands, compared head to head',
  'ENGWE, Himiway, Urtopia, TENWAYS, Lankeleisi — the same five questions, the same five answers, the same scoring. No marketing fluff.',
  'E-bike',
  'published',
  5, 4, 3, 10, '2026-06-10', '2026-06-11',
  '/brands/engwe.jpg',
  'We tested five verified Chinese e-bike brands on the same four criteria: export history, warranty, product line, and verified contact.',
  E'The story about Chinese e-bikes has changed. The "cheap Alibaba clone" narrative is dead. The five brands below ship globally, hold real warranties, and in some cases have set technical categories the European and American incumbents have yet to match. This is not a list of every Chinese e-bike brand. It''s five we vetted on the same four criteria, scored on the same scale, and updated against their own official sites in the last 30 days.',

  '["Real export operation", "Working warranty", "Product line currency", "Verifiable contact"]'::jsonb,

  '[
    {
      "slug": "himiway",
      "brand_name": "Himiway",
      "quick_take": "Best for US buyers who want US-based support and a 2-year warranty included in the price.",
      "expert_quote": "The only brand in this list with a US-headquartered operation and a 491,000+ rider base.",
      "expert_source": "FindInChina analysis, 2026-06",
      "why_vetted": ["US-headquartered (Walnut, California)", "2-year warranty, 15-day return, free US shipping", "491,000+ riders, 1,200+ dealers worldwide"],
      "who_for": ["US buyers wanting domestic support", "Buyers who want warranty included upfront", "Fat-tire / cargo / mountain riders"],
      "gallery": ["/brands/himiway.jpg","/brands/himiway.jpg","/brands/himiway.jpg","/brands/himiway.jpg","/brands/himiway.jpg"]
    },
    {
      "slug": "lankeleisi",
      "brand_name": "Lankeleisi",
      "quick_take": "Best for off-road and private-property buyers who want max power (2000W dual-motor) and the longest warranty in the list (3 years).",
      "expert_quote": "The only brand in this list with a 3-year warranty and 2000W dual-motor e-bikes.",
      "expert_source": "FindInChina, 2026-06",
      "why_vetted": ["3-year warranty (longest in this list)", "2000W dual-motor flagship MG740Plus verified by CleanTechnica", "Ships from EU, UK, US warehouses"],
      "who_for": ["Off-road and private property", "US buyers wanting max power", "Buyers who want longest warranty"],
      "gallery": ["/brands/lankeleisi.jpg","/brands/lankeleisi.jpg","/brands/lankeleisi.jpg","/brands/lankeleisi.jpg","/brands/lankeleisi.jpg"]
    },
    {
      "slug": "engwe",
      "brand_name": "ENGWE",
      "quick_take": "Best for buyers who want a wide product range at low prices — folding, fat-tire, moped-style, cargo — all under one brand.",
      "expert_quote": "The Engine Pro 3.0 Boost is the most capable sub-$2,000 folding e-bike we''ve tested in 2026.",
      "expert_source": "VICE 2026 e-bike roundup",
      "why_vetted": ["8 localized country sites", "1-2 year warranty honored in EU/US", "Active dealer program for bulk buyers"],
      "who_for": ["First-time e-bike owners", "Apartment dwellers (folding models)", "US buyers wanting fast domestic shipping"],
      "gallery": ["/brands/engwe.jpg","/brands/engwe.jpg","/brands/engwe.jpg","/brands/engwe.jpg","/brands/engwe.jpg"]
    },
    {
      "slug": "tenways",
      "brand_name": "TENWAYS",
      "quick_take": "Best for European buyers who value in-person service and after-sale support — 1,200+ dealer shops and 200+ service centers across Europe.",
      "expert_quote": "1,200+ dealer shops across Europe. The only brand in this list with iF Design Award 2026.",
      "expert_source": "iF Design Award 2026",
      "why_vetted": ["15 European country sites", "iF Design Award 2026 winner", "Spare parts supply continues past warranty"],
      "who_for": ["European buyers", "Riders who want in-person dealer support", "Urban commuters and family hauler buyers"],
      "gallery": ["/brands/tenways.jpg","/brands/tenways.jpg","/brands/tenways.jpg","/brands/tenways.jpg","/brands/tenways.jpg"]
    },
    {
      "slug": "urtopia",
      "brand_name": "Urtopia",
      "quick_take": "Best for urban commuters who want a light (38 lbs), tech-forward carbon-fiber e-bike with built-in 4G GPS anti-theft.",
      "expert_quote": "The only sub-$2,000 full carbon-fiber e-bike on the market. 38 lbs — half the industry average.",
      "expert_source": "FindInChina, 2026-06",
      "why_vetted": ["Full carbon-fiber frame at sub-$2k", "4G GPS anti-theft + ChatGPT voice", "UL safety certified, 1,000+ US dealers"],
      "who_for": ["Urban commuters", "Tech-forward buyers", "Riders wanting lightest carbon-fiber e-bike"],
      "gallery": ["/brands/urtopia.jpg","/brands/urtopia.jpg","/brands/urtopia.jpg","/brands/urtopia.jpg","/brands/urtopia.jpg"]
    }
  ]'::jsonb,

  E'All five brands were evaluated on the same four criteria, each scored from public information only — no brand-supplied data.\n\n1. Real export operation. Multiple country-localized sites, not just a .com with English.\n2. Working warranty. Public warranty terms, public contact, third-party claim verification where possible.\n3. Product line currency. 2026 lineup actively shipping, not 2023 leftovers.\n4. Verifiable contact. Real phone, real email, real dealer addresses — not just a contact form.\n\nOur rating (0-5) is a weighted composite: 30% price (lower is better), 25% top range, 20% export reach, 15% warranty length, 10% third-party coverage.',

  '["VICE 2026 e-bike roundup", "CleanTechnica MG740Plus review", "iF Design Award 2026 winners list", "Each brand''s official website, 2026-06-10"]'::jsonb,

  '[
    {"brand_slug": "himiway",    "brand_name": "Himiway",     "price": 799,   "price_label": "$799",     "range": "80 mi",    "power": "750W",  "countries": 4,  "warranty": "2 yr",   "third_party": "—",            "rating": 3.5},
    {"brand_slug": "lankeleisi", "brand_name": "Lankeleisi",  "price": 999,   "price_label": "$999",     "range": "150 km",   "power": "2000W", "countries": 6,  "warranty": "3 yr",   "third_party": "CleanTechnica", "rating": 4.0},
    {"brand_slug": "engwe",      "brand_name": "ENGWE",       "price": 1099,  "price_label": "$1,099",   "range": "130 km",   "power": "250W",  "countries": 8,  "warranty": "1-2 yr", "third_party": "VICE ·4.2",     "rating": 3.8},
    {"brand_slug": "tenways",    "brand_name": "TENWAYS",     "price": 1199,  "price_label": "€1,099",   "range": "100 km",   "power": "250W",  "countries": 15, "warranty": "2 yr",   "third_party": "iF Design 2026","rating": 3.8},
    {"brand_slug": "urtopia",    "brand_name": "Urtopia",     "price": 1599,  "price_label": "$1,599",   "range": "75 mi",    "power": "250W",  "countries": 7,  "warranty": "2 yr",   "third_party": "—",            "rating": 2.9}
  ]'::jsonb
)
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  brand_blocks = excluded.brand_blocks,
  comparison_rows = excluded.comparison_rows,
  sources = excluded.sources,
  methodology_text = excluded.methodology_text;
