-- FindIn: findin_reports table
-- One row per "findin" report. Independent from blog_posts.
-- 2026-06-11

create table if not exists findin_reports (
  id bigint generated always as identity primary key,
  slug text unique not null,
  title text not null,
  subtitle text,
  category text not null,                  -- e.g. "E-bike", "EV charging"
  status text not null default 'published',-- 'published' | 'in_research' | 'draft'
  brand_count int default 0,
  criteria_count int default 4,
  source_count int default 0,
  read_time_min int default 0,
  last_verified date,
  published_at date default current_date,
  cover_image_url text,                    -- big hero image
  excerpt text,                            -- one-line teaser for list card

  -- Body
  intro_text text,                         -- first paragraph, drop-cap
  criteria_text jsonb default '[]'::jsonb, -- ["Real export op", "Working warranty", ...]
  brand_blocks jsonb default '[]'::jsonb,  -- [{slug, hero_take, expert_quote, expert_source, why_vetted:[], who_for:[], gallery:[url1,url2,url3,url4,url5]}]
  methodology_text text,                   -- section §8
  sources jsonb default '[]'::jsonb,       -- ["VICE 2026 ...", ...]

  -- Comparison table: rows of brand data
  comparison_rows jsonb default '[]'::jsonb, -- [{brand_slug, brand_name, price, range, power, countries, warranty, third_party, rating}]

  created_at timestamptz default now()
);

-- RLS: public read for published
alter table findin_reports enable row level security;
drop policy if exists "Public read findin_reports" on findin_reports;
create policy "Public read findin_reports"
  on findin_reports for select
  using (status = 'published');

-- Index on slug
create index if not exists idx_findin_slug on findin_reports(slug);
create index if not exists idx_findin_status on findin_reports(status);
create index if not exists idx_findin_published on findin_reports(published_at desc);
