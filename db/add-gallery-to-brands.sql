-- FindInChina: gallery field for all 6 brands
-- 2026-06-11
-- Each brand has 5+ real official product photos in /brands/<slug>/

alter table brands
  add column if not exists gallery jsonb default '[]'::jsonb;

-- ENGWE: 5 models
update brands set gallery = '[
  {"src": "/brands/engwe/engwe-engine-pro-3.jpg", "model_name": "Engine Pro 3.0 Boost", "category": "folding fat-tire full-suspension"},
  {"src": "/brands/engwe/engwe-m1.jpg",           "model_name": "M1",                 "category": "moped-style fat-tire"},
  {"src": "/brands/engwe/engwe-m20.jpg",          "model_name": "M20",                "category": "full-suspension fat-tire moped"},
  {"src": "/brands/engwe/engwe-l20-boost.jpg",    "model_name": "L20 Boost",          "category": "fat-tire utility"},
  {"src": "/brands/engwe/engwe-ep-2-boost.jpg",   "model_name": "EP-2 Boost",         "category": "folding all-terrain"}
]'::jsonb
where slug = 'engwe';

-- Himiway: 6 models
update brands set gallery = '[
  {"src": "/brands/himiway/himiway-d5-2.jpg",     "model_name": "D5 2.0 (20\")",     "category": "full-suspension fat-tire"},
  {"src": "/brands/himiway/himiway-d5-st.jpg",    "model_name": "D5 ST",              "category": "step-thru fat-tire"},
  {"src": "/brands/himiway/himiway-d5-camo.jpg",  "model_name": "D5 ST Camo",         "category": "camo hunting edition"},
  {"src": "/brands/himiway/himiway-d7-pro.jpg",   "model_name": "D7 Pro (Cobra)",     "category": "1000W hunting mountain"},
  {"src": "/brands/himiway/himiway-a7.jpg",       "model_name": "A7",                 "category": "commuter"},
  {"src": "/brands/himiway/himiway-c1-kids.jpg",  "model_name": "C1 Kids",            "category": "kids 4-12"}
]'::jsonb
where slug = 'himiway';

-- Urtopia: 5 models
update brands set gallery = '[
  {"src": "/brands/urtopia/urtopia-carbon-classic.jpg",     "model_name": "Carbon Classic",     "category": "38 lbs flagship carbon fiber"},
  {"src": "/brands/urtopia/urtopia-carbon-1-pro.webp",     "model_name": "Carbon 1 Pro",       "category": "gravel long range"},
  {"src": "/brands/urtopia/urtopia-carbon-fold.png",       "model_name": "Carbon Fold",        "category": "folding step-thru"},
  {"src": "/brands/urtopia/urtopia-carbon-joy.png",        "model_name": "Carbon Joy",         "category": "fat-tire"},
  {"src": "/brands/urtopia/urtopia-carbon-fusion-pro.jpg", "model_name": "Carbon Fusion Pro",  "category": "long range"}
]'::jsonb
where slug = 'urtopia';

-- TENWAYS: 5 models
update brands set gallery = '[
  {"src": "/brands/tenways/tenways-cgo600.webp",       "model_name": "CGO600",      "category": "city belt-drive 15kg"},
  {"src": "/brands/tenways/tenways-cgo600-pro.webp",   "model_name": "CGO600 Pro",  "category": "city belt-drive upgrade"},
  {"src": "/brands/tenways/tenways-cgo800s.webp",      "model_name": "CGO800S",     "category": "city 27% larger battery"},
  {"src": "/brands/tenways/tenways-ago-t.webp",        "model_name": "AGO T",       "category": "mid-drive hybrid"},
  {"src": "/brands/tenways/tenways-longtail.webp",     "model_name": "Longtail",    "category": "family cargo iF Award"}
]'::jsonb
where slug = 'tenways';

-- Lankeleisi: 5 models
update brands set gallery = '[
  {"src": "/brands/lankeleisi/lankeleisi-mg740plus.webp",     "model_name": "MG740Plus",      "category": "2000W dual-motor flagship"},
  {"src": "/brands/lankeleisi/lankeleisi-mg600plus.webp",     "model_name": "MG600Plus",      "category": "2000W dual-motor step-thru"},
  {"src": "/brands/lankeleisi/lankeleisi-wombat-1.webp",      "model_name": "Wombat-1",       "category": "1000W fat-tire cargo"},
  {"src": "/brands/lankeleisi/lankeleisi-x3000-max.webp",     "model_name": "X3000 MAX",      "category": "2000W foldable mountain"},
  {"src": "/brands/lankeleisi/lankeleisi-x-black-knight.webp","model_name": "X-Black Knight", "category": "2000W 280km range"}
]'::jsonb
where slug = 'lankeleisi';

-- Star Charge: 5 official images (home + 4 banners)
update brands set gallery = '[
  {"src": "/brands/star-charge/starcharge-home.jpg",     "model_name": "StarCharge HQ",        "category": "company overview"},
  {"src": "/brands/star-charge/starcharge-banner-1.jpg", "model_name": "Taurus 4th Gen",      "category": "home / business charger"},
  {"src": "/brands/star-charge/starcharge-banner-2.jpg", "model_name": "Aurora",              "category": "commercial charging"},
  {"src": "/brands/star-charge/starcharge-banner-3.jpg", "model_name": "eBox 261",            "category": "compact residential"},
  {"src": "/brands/star-charge/starcharge-banner-4.jpg", "model_name": "5 MWh Storage",       "category": "industrial energy storage"}
]'::jsonb
where slug = 'star-charge';

-- Verification
select slug, jsonb_array_length(gallery) as gallery_count
from brands
where verified = true
order by slug;
