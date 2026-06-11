-- ============================================
-- FindInChina 数据库 Schema
-- ============================================
-- 在 Supabase SQL Editor 中运行此文件
-- 适用：Postgres 15+
-- ============================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- 用于全文搜索

-- ============================================
-- 1. brands 表 — 品牌 / 公司
-- ============================================
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,                          -- 中文名
    name_en TEXT,                                 -- 英文名
    slug TEXT UNIQUE NOT NULL,                    -- URL 友好名
    logo_url TEXT,
    description TEXT,                             -- 英文简介
    description_cn TEXT,                          -- 中文简介
    category TEXT NOT NULL,                       -- 汽车 / 3C / 家居 / 美妆
    subcategory TEXT,                             -- 子类（如 "电动车"）
    tags TEXT[] DEFAULT '{}',                     -- 标签数组
    website TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    contact_wechat TEXT,
    country_origin TEXT DEFAULT 'China',
    export_countries TEXT[] DEFAULT '{}',         -- 可出口国家
    verified BOOLEAN DEFAULT FALSE,               -- 是否经过验证
    verified_by TEXT,
    verified_at TIMESTAMPTZ,
    source_urls TEXT[] DEFAULT '{}',              -- 信息来源 URL
    view_count INTEGER DEFAULT 0,
    rating_avg NUMERIC(3, 2),                     -- 平均评分
    rating_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,            -- 是否精选
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_brands_category ON brands(category);
CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_verified ON brands(verified);
CREATE INDEX idx_brands_featured ON brands(is_featured);
CREATE INDEX idx_brands_name_trgm ON brands USING gin(name gin_trgm_ops);

COMMENT ON TABLE brands IS '中国优质品牌 / 公司档案';

-- ============================================
-- 2. locations 表 — 销售点 / 4S店 / 经销商
-- ============================================
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,                           -- 4S / 经销商 / 出口代理 / 海外代理
    country TEXT NOT NULL,
    city TEXT,
    address TEXT,
    lat NUMERIC(10, 6),
    lng NUMERIC(10, 6),
    phone TEXT,
    email TEXT,
    website TEXT,
    hours TEXT,                                   -- 营业时间
    languages TEXT[] DEFAULT '{}',                -- 支持语言
    verified BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3, 2),
    reviews_count INTEGER DEFAULT 0,
    notes TEXT,                                   -- 备注
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_locations_brand ON locations(brand_id);
CREATE INDEX idx_locations_country ON locations(country);
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_locations_type ON locations(type);

COMMENT ON TABLE locations IS '销售点 / 4S店 / 经销商位置';

-- ============================================
-- 3. products 表 — 产品 / 车型
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_cn TEXT,
    category TEXT,
    description TEXT,
    description_cn TEXT,
    image_urls TEXT[] DEFAULT '{}',
    price_cny NUMERIC(12, 2),                     -- 国内参考价 ¥
    price_usd NUMERIC(12, 2),                     -- 海外参考价 $
    price_savings_pct NUMERIC(5, 2),              -- 节省百分比（vs 海外）
    specs JSONB DEFAULT '{}',                     -- 规格参数（jsonb）
    availability TEXT DEFAULT 'available',
    export_ready BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_export ON products(export_ready);

COMMENT ON TABLE products IS '产品 / 车型';

-- ============================================
-- 4. contents 表 — 内容 / 文章 / Newsletter
-- ============================================
CREATE TABLE IF NOT EXISTS contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,                           -- blog / newsletter / review / guide
    body TEXT,                                    -- Markdown 内容
    excerpt TEXT,                                 -- 摘要
    cover_image TEXT,
    author_id UUID,
    status TEXT DEFAULT 'draft',                  -- draft / published / archived
    published_at TIMESTAMPTZ,
    tags TEXT[] DEFAULT '{}',
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[] DEFAULT '{}',
    related_brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    related_product_ids UUID[] DEFAULT '{}',
    newsletter_sent_at TIMESTAMPTZ,
    view_count INTEGER DEFAULT 0,
    read_time_min INTEGER,                        -- 阅读时长
    is_premium BOOLEAN DEFAULT FALSE,             -- Premium 内容
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contents_type ON contents(type);
CREATE INDEX idx_contents_status ON contents(status);
CREATE INDEX idx_contents_slug ON contents(slug);
CREATE INDEX idx_contents_published ON contents(published_at DESC);
CREATE INDEX idx_contents_brand ON contents(related_brand_id);
CREATE INDEX idx_contents_tags ON contents USING gin(tags);

COMMENT ON TABLE contents IS '内容 / 文章 / Newsletter';

-- ============================================
-- 5. subscribers 表 — Newsletter 订阅者
-- ============================================
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    source TEXT,                                  -- 来源（首页 / 弹窗 / Reddit 等）
    beehiiv_id TEXT,                              -- Beehiiv 同步 ID
    status TEXT DEFAULT 'active',                 -- active / unsubscribed / bounced
    tags TEXT[] DEFAULT '{}',
    is_premium BOOLEAN DEFAULT FALSE,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);

COMMENT ON TABLE subscribers IS 'Newsletter 订阅者';

-- ============================================
-- 6. inquiries 表 — 用户询盘（双向市场阶段用）
-- ============================================
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT NOT NULL,
    user_name TEXT,
    user_country TEXT,
    brand_id UUID REFERENCES brands(id),
    location_id UUID REFERENCES locations(id),
    product_id UUID REFERENCES products(id),
    message TEXT,
    status TEXT DEFAULT 'pending',                -- pending / sent / closed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_brand ON inquiries(brand_id);

COMMENT ON TABLE inquiries IS '用户询盘（后期商家端用）';

-- ============================================
-- 7. reviews 表 — 用户评价（后期）
-- ============================================
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

CREATE INDEX idx_reviews_brand ON reviews(brand_id);

COMMENT ON TABLE reviews IS '用户评价（后期）';

-- ============================================
-- 触发器：自动更新 updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contents_updated_at BEFORE UPDATE ON contents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 行级安全策略（RLS）
-- ============================================
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 公开读取策略
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Public read locations" ON locations FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read published contents" ON contents
    FOR SELECT USING (status = 'published');

-- 订阅者可以插入
CREATE POLICY "Anyone can subscribe" ON subscribers FOR INSERT WITH CHECK (true);

-- 询盘可以插入
CREATE POLICY "Anyone can inquire" ON inquiries FOR INSERT WITH CHECK (true);

-- ============================================
-- 初始数据：首批 5 个核心品牌（手动添加）
-- ============================================
INSERT INTO brands (name, name_en, slug, description, category, subcategory, website, country_origin, verified, is_featured) VALUES
('比亚迪', 'BYD', 'byd', '全球领先的新能源汽车制造商，中国电动车销量第一', '汽车', '电动车', 'https://www.bydglobal.com', 'China', TRUE, TRUE),
('蔚来', 'NIO', 'nio', '中国高端电动汽车品牌，主打换电技术与豪华体验', '汽车', '电动车', 'https://www.nio.com', 'China', TRUE, TRUE),
('小鹏汽车', 'XPeng', 'xpeng', '中国领先的智能电动汽车制造商', '汽车', '电动车', 'https://www.xiaopeng.com', 'China', TRUE, TRUE),
('理想汽车', 'Li Auto', 'li-auto', '中国增程式电动汽车开创者，主打家庭 SUV', '汽车', '电动车', 'https://www.lixiang.com', 'China', TRUE, TRUE),
('极氪', 'Zeekr', 'zeekr', '吉利旗下高端电动车品牌', '汽车', '电动车', 'https://www.zeekrlife.com', 'China', TRUE, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Schema 创建完成
-- ============================================
SELECT 'FindInChina schema initialized successfully!' AS status;