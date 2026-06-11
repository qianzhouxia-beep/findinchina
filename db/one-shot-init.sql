-- ============================================
-- FindInChina 数据库 - 一次性全部跑
-- ============================================
-- 使用方法：复制下面所有 SQL，粘贴到 Supabase SQL Editor，点 Run
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TABLE IF NOT EXISTS brands (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 name TEXT NOT NULL,
 name_en TEXT,
 slug TEXT UNIQUE NOT NULL,
 logo_url TEXT,
 description TEXT,
 description_cn TEXT,
 category TEXT NOT NULL,
 subcategory TEXT,
 tags TEXT[] DEFAULT '{}',
 website TEXT,
 contact_email TEXT,
 contact_phone TEXT,
 contact_wechat TEXT,
 country_origin TEXT DEFAULT 'China',
 export_countries TEXT[] DEFAULT '{}',
 verified BOOLEAN DEFAULT FALSE,
 verified_by TEXT,
 verified_at TIMESTAMPTZ,
 source_urls TEXT[] DEFAULT '{}',
 view_count INTEGER DEFAULT 0,
 rating_avg NUMERIC(3,2),
 rating_count INTEGER DEFAULT 0,
 is_featured BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brands_category ON brands(category);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_verified ON brands(verified);
CREATE INDEX IF NOT EXISTS idx_brands_featured ON brands(is_featured);
CREATE INDEX IF NOT EXISTS idx_brands_name_trgm ON brands USING gin(name gin_trgm_ops);

CREATE TABLE IF NOT EXISTS locations (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 type TEXT NOT NULL,
 country TEXT NOT NULL,
 city TEXT,
 address TEXT,
 lat NUMERIC(10,6),
 lng NUMERIC(10,6),
 phone TEXT,
 email TEXT,
 website TEXT,
 hours TEXT,
 languages TEXT[] DEFAULT '{}',
 verified BOOLEAN DEFAULT FALSE,
 rating NUMERIC(3,2),
 reviews_count INTEGER DEFAULT 0,
 notes TEXT,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_locations_brand ON locations(brand_id);
CREATE INDEX IF NOT EXISTS idx_locations_country ON locations(country);
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);
CREATE INDEX IF NOT EXISTS idx_locations_type ON locations(type);

CREATE TABLE IF NOT EXISTS products (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 name_cn TEXT,
 category TEXT,
 description TEXT,
 description_cn TEXT,
 image_urls TEXT[] DEFAULT '{}',
 price_cny NUMERIC(12,2),
 price_usd NUMERIC(12,2),
 price_savings_pct NUMERIC(5,2),
 specs JSONB DEFAULT '{}',
 availability TEXT DEFAULT 'available',
 export_ready BOOLEAN DEFAULT FALSE,
 verified BOOLEAN DEFAULT FALSE,
 view_count INTEGER DEFAULT 0,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_export ON products(export_ready);

CREATE TABLE IF NOT EXISTS contents (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 title TEXT NOT NULL,
 slug TEXT UNIQUE NOT NULL,
 type TEXT NOT NULL,
 body TEXT,
 excerpt TEXT,
 cover_image TEXT,
 author_id UUID,
 status TEXT DEFAULT 'draft',
 published_at TIMESTAMPTZ,
 tags TEXT[] DEFAULT '{}',
 seo_title TEXT,
 seo_description TEXT,
 seo_keywords TEXT[] DEFAULT '{}',
 related_brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
 related_product_ids UUID[] DEFAULT '{}',
 newsletter_sent_at TIMESTAMPTZ,
 view_count INTEGER DEFAULT 0,
 read_time_min INTEGER,
 is_premium BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(type);
CREATE INDEX IF NOT EXISTS idx_contents_status ON contents(status);
CREATE INDEX IF NOT EXISTS idx_contents_slug ON contents(slug);
CREATE INDEX IF NOT EXISTS idx_contents_published ON contents(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_contents_brand ON contents(related_brand_id);
CREATE INDEX IF NOT EXISTS idx_contents_tags ON contents USING gin(tags);

CREATE TABLE IF NOT EXISTS subscribers (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 email TEXT UNIQUE NOT NULL,
 name TEXT,
 source TEXT,
 beehiiv_id TEXT,
 status TEXT DEFAULT 'active',
 tags TEXT[] DEFAULT '{}',
 is_premium BOOLEAN DEFAULT FALSE,
 subscribed_at TIMESTAMPTZ DEFAULT NOW(),
 unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);

CREATE TABLE IF NOT EXISTS inquiries (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 user_email TEXT NOT NULL,
 user_name TEXT,
 user_country TEXT,
 brand_id UUID REFERENCES brands(id),
 location_id UUID REFERENCES locations(id),
 product_id UUID REFERENCES products(id),
 message TEXT,
 status TEXT DEFAULT 'pending',
 created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_brand ON inquiries(brand_id);

CREATE TABLE IF NOT EXISTS reviews (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 user_email TEXT,
 user_name TEXT,
 brand_id UUID REFERENCES brands(id),
 location_id UUID REFERENCES locations(id),
 rating INTEGER CHECK (rating >= 1 AND rating <= 5),
 title TEXT,
 body TEXT,
 verified BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_brand ON reviews(brand_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
 NEW.updated_at = NOW();
 RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_brands_updated_at ON brands;
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_locations_updated_at ON locations;
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contents_updated_at ON contents;
CREATE TRIGGER update_contents_updated_at BEFORE UPDATE ON contents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read brands" ON brands;
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read locations" ON locations;
CREATE POLICY "Public read locations" ON locations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read published contents" ON contents;
CREATE POLICY "Public read published contents" ON contents FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Anyone can subscribe" ON subscribers;
CREATE POLICY "Anyone can subscribe" ON subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can inquire" ON inquiries;
CREATE POLICY "Anyone can inquire" ON inquiries FOR INSERT WITH CHECK (true);

TRUNCATE brands CASCADE;

INSERT INTO brands (name, name_en, slug, description, description_cn, category, subcategory, website, country_origin, verified, is_featured) VALUES
('雅迪科技集团', 'Yadea', 'yadea', 'World''s #1 e-bike maker, 10M+ units sold in 2025, listed in HKEX, expanding rapidly in Europe and Southeast Asia.', '全球第一电动两轮车品牌，2025年销量突破1000万辆，港股上市。', '出行', '电动自行车', 'https://www.yadea.com.cn', 'China', TRUE, TRUE),
('爱玛科技', 'AIMA', 'aima', 'Top 5 global e-bike manufacturer, A-share listed, 50M+ units lifetime sales, strong export presence in 60+ countries.', '全球前五大电动两轮车制造商，A股上市，累计销量5000万辆+。', '出行', '电动自行车', 'https://www.aima.com.cn', 'China', TRUE, TRUE),
('优途科技', 'Urtopia', 'urtopia', 'Premium DTC e-bike brand with carbon fiber frames, won Red Dot Design Award, loved by US/EU urban commuters.', '高端DTC电动自行车品牌，全碳纤维车架，获红点设计奖。', '出行', '电动自行车', 'https://newurtopia.com', 'China', TRUE, TRUE),
('ENGWE', 'ENGWE', 'engwe', 'Top-selling folding e-bike brand on Amazon US/EU, fat tire specialists, direct-to-consumer with global warehouses.', '亚马逊美/欧销量第一的折叠电动自行车品牌，专攻胖胎车。', '出行', '电动自行车', 'https://engwe.com', 'China', TRUE, TRUE),
('Himiway', 'Himiway', 'himiway', 'Premium fat tire e-bike DTC brand, made in Shenzhen, big US market share in long-range commuter segment.', '高端胖胎电动自行车DTC品牌，深圳制造。', '出行', '电动自行车', 'https://www.himiwaybike.com', 'China', TRUE, TRUE),
('大疆（Avinox）', 'DJI Avinox', 'dji-avinox', 'Premium eMTB drive system from DJI, won 2025 design awards, 1000W peak power, game-changer for high-end e-bikes.', '大疆高端电助力山地车驱动系统，峰值功率1000W。', '出行', '电动自行车', 'https://www.dji.com/avinox', 'China', TRUE, TRUE),
('TENWAYS', 'TENWAYS', 'tenways', 'European-focused premium e-bike brand, sleek urban design, strong presence in Netherlands/Belgium/Germany.', '面向欧洲市场的高端电动自行车品牌。', '出行', '电动自行车', 'https://www.tenways.com', 'China', TRUE, TRUE),
('兰克雷司', 'Lankeleisi', 'lankeleisi', 'High-performance budget e-bike brand, G660/GT800 popular models, exported to 30+ countries via Amazon.', '高性价比电动自行车品牌，亚马逊销往30+国家。', '出行', '电动自行车', 'https://www.lankeleisi.com', 'China', TRUE, TRUE),
('小刀电动车', 'XDAO', 'xdao', 'Mid-tier mass market e-bike brand, strong in tier 2-3 China cities, growing export to LATAM and SEA.', '中端大众市场电动自行车品牌。', '出行', '电动自行车', 'https://www.xdao.com', 'China', TRUE, FALSE),
('泰麟电动车', 'Tailing', 'tailing', 'Export-focused e-bike manufacturer, OEM/ODM for European brands, 15 years experience, 2M units/year capacity.', '出口导向电动自行车制造商，为欧洲品牌代工。', '出行', '电动自行车', 'https://www.tailing-bike.com', 'China', TRUE, FALSE),
('星星充电', 'Star Charge', 'star-charge', 'China''s #1 EV charging network operator, 500K+ public chargers, expanding to EU with premium home chargers.', '中国第一大电动汽车充电网络运营商，50万+公共充电桩。', '出行', '充电桩', 'https://www.starcharge.com', 'China', TRUE, TRUE),
('特来电', 'TELD', 'teld', 'Top 3 EV charging network in China, 400K+ public chargers, parent company TGOOD, listed company.', '中国第三大电动汽车充电网络，40万+公共充电桩。', '出行', '充电桩', 'https://www.teld.cn', 'China', TRUE, TRUE),
('小蜂充电', 'Besen', 'besen', 'Portable EV charger specialist, 100+ countries export, Amazon best-seller in portable EVSE category.', '便携式电动汽车充电桩专家，出口100+国家。', '出行', '充电桩', 'https://www.besen-group.com', 'China', TRUE, TRUE),
('挚达科技', 'Zhida', 'zhida', 'Leading home EV charging brand in China, smart app control, exporting under white-label to EU/US brands.', '中国领先家用电动汽车充电品牌，智能App控制。', '出行', '充电桩', 'https://www.zhida-auto.com', 'China', TRUE, FALSE),
('EVOCharge', 'EVOCharge', 'evocharge', 'Compact EV home charger brand, Level 1/Level 2, popular in NA market, OEM for major US distributors.', '紧凑型家用电动汽车充电桩品牌，北美市场受欢迎。', '出行', '充电桩', 'https://www.evocharge.com', 'China', TRUE, FALSE)
ON CONFLICT (slug) DO NOTHING;

SELECT category, subcategory, COUNT(*) as brand_count FROM brands GROUP BY category, subcategory ORDER BY category, subcategory;