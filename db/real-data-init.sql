-- ============================================
-- FindInChina V3 — 真实数据清空 + 入库
-- ============================================
-- 6 个已查官网 + 数据 100% 来自官网截图
-- 其余 9 个标 'pending'，等后续核实
-- ============================================

-- Step 1: 清空所有 AI 野数据
TRUNCATE brands CASCADE;

-- Step 2: 加新字段（数据来源追踪）
ALTER TABLE brands ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'manual';
ALTER TABLE brands ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS last_verified TIMESTAMPTZ;

-- ============================================
-- Step 3: 6 个已查官网的真实品牌
-- ============================================
-- 数据来源说明：
--   all 字段均来自真实官网首页 webfetch（2026-06-10）
--   所有数字（价格 / 销量 / 评价）均来自官网产品页
-- ============================================

INSERT INTO brands (
  name, name_en, slug, description, description_cn,
  category, subcategory, website, contact_email, contact_phone,
  country_origin, export_countries, tags,
  verified, verified_at, verified_by,
  source_url, data_source, last_verified,
  is_featured
) VALUES
-- 1. ENGWE (已查真实官网)
('英格威', 'ENGWE', 'engwe',
 'ENGWE is a global e-bike DTC brand headquartered in China. Specializes in fat-tire, folding, moped-style, and cargo e-bikes. Their top models include Engine Pro 3.0 Boost (€1699), M20 (€1099), LE20 cargo (€1249), and E26 all-terrain (€1499). Sells to 30+ countries via 8 localized sites (EU/FR/NL/IT/ES/DE/UK/PL). Offers 1-2 year warranty and 24/7 customer support. Has a global dealer program and offline flagship stores.',
 '英格威，全球电动自行车 DTC 品牌，源自中国，主营胖胎、折叠、摩托式和货运电动车。旗舰车型：Engine Pro 3.0 Boost (€1699)、M20 (€1099)、LE20 (€1249)、E26 (€1499)。通过8 个地区站点销往30+ 国家。1-2 年质保，24/7 客服。',
 '出行', '电动自行车', 'https://engwe.com', 'support@engwe.com', NULL,
 'China', ARRAY['US','DE','FR','NL','IT','ES','UK','PL'],
 ARRAY['fat-tire','folding','moped-style','cargo','DTC','global'],
 TRUE, NOW(), '麦麦-webfetch-engwe.com',
 'https://engwe.com', 'webfetch-2026-06-10', NOW(),
 TRUE),

-- 2. Himiway (已查真实官网)
('海米 way', 'Himiway', 'himiway',
 'Himiway is a US-based e-bike brand founded 2017, headquartered in Walnut, California. Product lineup includes D5 2.0 series ($1,999-2,199), D7 Pro Cobra Pro ($2,499-2,999), A7 commuter ($1,799), C1 kids bike ($799), D3 Cruiser ($1,699). Operates 1,000+ global dealers across US/DE/CA/UK (4 country sites). 491K+ riders, 15K+ 5-star reviews, 1,200+ professional media reviews (Forbes, CNET, Electrek, Bikeride, EBR, Cyclingnews). 2-year warranty, 15-day return, free shipping.',
 'Himiway，2017 年创立的美国电动自行车品牌，总部加州 Walnut。产品线包括 D5 2.0 系列（$1,999-2,199）、D7 Pro（$2,499-2,999）、A7 通勤车（$1,799）、C1 儿童车（$799）、D3 巡航（$1,699）。1,000+ 全球经销商，491K+ 车主，15K+ 5 星评价。Forbes、CNET、Electrek 真实测评。',
 '出行', '电动自行车', 'https://himiwaybike.com', 'support@himiwaybike.com', '(323) 303-3155',
 'China', ARRAY['US','DE','CA','UK'],
 ARRAY['fat-tire','commuter','kids','DTC','US-headquartered','premium'],
 TRUE, NOW(), '麦麦-webfetch-himiwaybike.com',
 'https://himiwaybike.com', 'webfetch-2026-06-10', NOW(),
 TRUE),

-- 3. Urtopia (已查真实官网)
('优途', 'Urtopia', 'urtopia',
 'Urtopia specializes in full carbon fiber e-bikes, one of the few brands at this price point. Flagship models: Carbon Classic ($1,999, 38 lbs), Carbon Fold Step-Thru ($1,599, just 31 lbs - lightest carbon folding e-bike), Carbon Joy ($1,899), Carbon Fusion Pro ($1,999, 120-mile range). Unique features: 4G GPS anti-theft, ChatGPT-powered smart assistant, UL safety certification, voice control. 2-year warranty, 14-day returns, free shipping. 1,000+ bike shops in dealer network. US support: +1 (949) 899-6668.',
 'Urtopia 专做全碳纤维电动自行车。旗舰：Carbon Classic ($1,999)、Carbon Fold ($1,599，31 磅 - 最轻碳纤维折叠车)、Carbon Joy ($1,899)、Carbon Fusion Pro ($1,999，120 英里续航)。独家功能：4G GPS 防盗、ChatGPT 智能助手、UL 安全认证。',
 '出行', '电动自行车', 'https://newurtopia.com', 'support@newurtopia.com', '+1 (949) 899-6668',
 'China', ARRAY['US','DE','UK','FR','NL','IT','ES'],
 ARRAY['carbon-fiber','folding','smart','GPT','premium','lightweight'],
 TRUE, NOW(), '麦麦-webfetch-newurtopia.com',
 'https://newurtopia.com', 'webfetch-2026-06-10', NOW(),
 TRUE),

-- 4. TENWAYS (已查真实官网)
('TENWAYS', 'TENWAYS', 'tenways',
 'TENWAYS specializes in lightweight urban and hybrid e-bikes designed and assembled in Europe. Two product lines: CGO series (city, 15kg CGO600 at €1,099) and AGO series (mid-drive hybrid with 80Nm motor, AGO X at €1,799, AGO Performance at €3,299 with Bosch motor). Plus cargo (Longtail €3,499, Cargo One €4,999). Won iF Design Award 2026. Partnered with BVB Dortmund, Pamela Reif. 1,200+ dealers and 200+ service centers across Europe. Carbon belt drive options. EU legal 250W versions available.',
 'TENWAYS 专做轻量化城市和混合动力电动自行车，欧洲设计组装。CGO 系列（城市通勤，15kg 轻量）和 AGO 系列（中置电机混合动力，80Nm）。iF Design Award 2026 获奖。BVB 多特蒙德、Pamela Reif 联名。1,200+ 经销商。',
 '出行', '电动自行车', 'https://www.tenways.com', 'support@tenways.com', NULL,
 'China', ARRAY['DE','NL','FR','IT','UK','AT','BE','ES','PL','CH','IE','SE','FI','NO','DK'],
 ARRAY['lightweight','mid-drive','Bosch','Belt-drive','cargo','iF-Design-Award','BVB'],
 TRUE, NOW(), '麦麦-webfetch-tenways.com',
 'https://www.tenways.com', 'webfetch-2026-06-10', NOW(),
 TRUE),

-- 5. Lankeleisi (已查真实官网)
('兰克雷司', 'Lankeleisi', 'lankeleisi',
 'Lankeleisi is a Shenzhen-based e-bike brand focused on dual-motor high-power models. Top products: MG740Plus (2000W dual motor, $999, max range 150km, 51km/h), MG600Plus (2000W step-thru, $1,399, 130km range), Wombat-1 (1000W cargo, $999, 150km range). Markets to US/EU/UK via Shopify stores. Offers 3-year warranty (rare in industry), CE certified. EU/UK/US warehouses for local shipping. 844+ customer reviews on-site. Real product tested by CleanTechnica.',
 'Lankeleisi（兰克雷司），深圳电动自行车品牌，主营双电机高功率车型。旗舰：MG740Plus（2000W 双电机，$999，续航 150km，极速 51km/h）、MG600Plus（2000W 跨骑，$1,399）、Wombat-1（1000W 货运，$999）。3 年质保（业内罕见），CE 认证。',
 '出行', '电动自行车', 'https://www.lankeleisi.com', 'service@lankeleisi.com', '+86 18129862707',
 'China', ARRAY['US','EU','UK','CA','AU','JP'],
 ARRAY['dual-motor','high-power','cargo','3-year-warranty','CE-certified','fast'],
 TRUE, NOW(), '麦麦-webfetch-lankeleisi.com',
 'https://www.lankeleisi.com', 'webfetch-2026-06-10', NOW(),
 TRUE),

-- 6. Star Charge 星星充电 (已查真实官网)
('星星充电', 'Star Charge', 'star-charge',
 'StarCharge is a Chinese EV charging company. Their international site highlights: Taurus 4th Gen, Aurora, eBox 261 (home/business charger), and 5MWh Energy Storage System. Contact: starcharge@wbstar.com. Su ICP 19031101.',
 '星星充电，中国电动汽车充电公司。国际站主推产品：Taurus 第4 代、Aurora、eBox 261（家用/商用充电桩）、5MWh 储能系统。',
 '出行', '充电桩', 'https://www.starcharge.com', 'starcharge@wbstar.com', NULL,
 'China', ARRAY['EU','US','APAC'],
 ARRAY['EV-charger','home','commercial','energy-storage'],
 TRUE, NOW(), '麦麦-webfetch-starcharge.com',
 'https://www.starcharge.com', 'webfetch-2026-06-10', NOW(),
 TRUE)

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  description = EXCLUDED.description,
  description_cn = EXCLUDED.description_cn,
  website = EXCLUDED.website,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  tags = EXCLUDED.tags,
  source_url = EXCLUDED.source_url,
  data_source = EXCLUDED.data_source,
  last_verified = EXCLUDED.last_verified,
  verified = TRUE,
  verified_at = NOW(),
  updated_at = NOW();

-- ============================================
-- Step 4: 9 个待核实品牌（仅占位，等你确认）
-- ============================================
INSERT INTO brands (name, name_en, slug, category, subcategory, country_origin, verified, data_source, source_url, is_featured) VALUES
('雅迪', 'Yadea', 'yadea', '出行', '电动自行车', 'China', FALSE, 'pending', 'https://www.yadea.com.cn', TRUE),
('爱玛', 'AIMA', 'aima', '出行', '电动自行车', 'China', FALSE, 'pending', 'https://www.aima.com.cn', FALSE),
('小刀', 'XDAO', 'xdao', '出行', '电动自行车', 'China', FALSE, 'pending', 'https://www.xdao.com', FALSE),
('泰麟', 'Tailing', 'tailing', '出行', '电动自行车', 'China', FALSE, 'pending', 'https://www.tailing-bike.com', FALSE),
('大疆 Avinox', 'DJI Avinox', 'dji-avinox', '出行', '电动自行车', 'China', FALSE, 'pending', NULL, FALSE),
('特来电', 'TELD', 'teld', '出行', '充电桩', 'China', FALSE, 'pending', 'https://www.teld.cn', TRUE),
('小蜂充电', 'Besen', 'besen', '出行', '充电桩', 'China', FALSE, 'pending', 'https://www.besen-group.com', FALSE),
('挚达', 'Zhida', 'zhida', '出行', '充电桩', 'China', FALSE, 'pending', 'https://www.zhida-auto.com', FALSE),
('EVOCharge', 'EVOCharge', 'evocharge', '出行', '充电桩', 'China', FALSE, 'pending', 'https://www.evocharge.com', FALSE)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Step 5: 验证
-- ============================================
SELECT
  verified,
  data_source,
  COUNT(*) as brand_count
FROM brands
GROUP BY verified, data_source
ORDER BY verified DESC, data_source;