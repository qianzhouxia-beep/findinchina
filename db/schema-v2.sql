-- ============================================
-- FindInChina Schema 修订 V2
-- ============================================
-- 把首发品类从"汽车整车"改为"汽车周边"
-- 首发双品类：E-bike（电动自行车）+ 充电桩
-- 替换原有的初始数据
-- ============================================

-- 清空原有初始数据（首次跑这个文件时执行）
TRUNCATE brands CASCADE;

-- ============================================
-- 首批品牌（E-bike + 充电桩）
-- ============================================
INSERT INTO brands (name, name_en, slug, description, description_cn, category, subcategory, website, country_origin, verified, is_featured) VALUES
-- E-bike 头部品牌
('雅迪科技集团', 'Yadea', 'yadea',
 'World''s #1 e-bike maker, 10M+ units sold in 2025, listed in HKEX, expanding rapidly in Europe and Southeast Asia.',
 '全球第一电动两轮车品牌，2025年销量突破1000万辆，港股上市，正快速扩张欧洲和东南亚市场。',
 '出行', '电动自行车', 'https://www.yadea.com.cn', 'China', TRUE, TRUE),

('爱玛科技', 'AIMA', 'aima',
 'Top 5 global e-bike manufacturer, A-share listed, 50M+ units lifetime sales, strong export presence in 60+ countries.',
 '全球前五大电动两轮车制造商，A股上市，累计销量5000万辆+ ，出口60+国家。',
 '出行', '电动自行车', 'https://www.aima.com.cn', 'China', TRUE, TRUE),

('优途科技', 'Urtopia', 'urtopia',
 'Premium DTC e-bike brand with carbon fiber frames, won Red Dot Design Award, loved by US/EU urban commuters.',
 '高端DTC电动自行车品牌，全碳纤维车架，获红点设计奖，深受欧美城市通勤者喜爱。',
 '出行', '电动自行车', 'https://newurtopia.com', 'China', TRUE, TRUE),

('ENGWE', 'ENGWE', 'engwe',
 'Top-selling folding e-bike brand on Amazon US/EU, fat tire specialists, direct-to-consumer with global warehouses.',
 '亚马逊美/欧销量第一的折叠电动自行车品牌，专攻胖胎车，DTC模式 +全球海外仓。',
 '出行', '电动自行车', 'https://engwe.com', 'China', TRUE, TRUE),

('Himiway', 'Himiway', 'himiway',
 'Premium fat tire e-bike DTC brand, made in Shenzhen, big US market share in long-range commuter segment.',
 '高端胖胎电动自行车DTC品牌，深圳制造，在美国长续航通勤细分市场份额领先。',
 '出行', '电动自行车', 'https://www.himiwaybike.com', 'China', TRUE, TRUE),

('大疆（Avinox）', 'DJI Avinox', 'dji-avinox',
 'Premium eMTB drive system from DJI, won 2025 design awards, 1000W peak power, game-changer for high-end e-bikes.',
 '大疆高端电助力山地车驱动系统，2025年获奖，峰值功率1000W，高端电助力车的颠覆者。',
 '出行', '电动自行车', 'https://www.dji.com/avinox', 'China', TRUE, TRUE),

('TENWAYS', 'TENWAYS', 'tenways',
 'European-focused premium e-bike brand, sleek urban design, strong presence in Netherlands/Belgium/Germany.',
 '面向欧洲市场的高端电动自行车品牌，城市设计优雅，在荷兰/比利时/德国市场强势。',
 '出行', '电动自行车', 'https://www.tenways.com', 'China', TRUE, TRUE),

('兰克雷司', 'Lankeleisi', 'lankeleisi',
 'High-performance budget e-bike brand, G660/GT800 popular models, exported to 30+ countries via Amazon.',
 '高性价比电动自行车品牌，G660/GT800 爆款，亚马逊销往30+国家。',
 '出行', '电动自行车', 'https://www.lankeleisi.com', 'China', TRUE, TRUE),

('小刀电动车', 'XDAO', 'xdao',
 'Mid-tier mass market e-bike brand, strong in tier 2-3 China cities, growing export to LATAM and SEA.',
 '中端大众市场电动自行车品牌，中国二三线城市强势，对拉美和东南亚出口增长。',
 '出行', '电动自行车', 'https://www.xdao.com', 'China', TRUE, FALSE),

('泰麟电动车', 'Tailing', 'tailing',
 'Export-focused e-bike manufacturer, OEM/ODM for European brands, 15 years experience, 2M units/year capacity.',
 '出口导向电动自行车制造商，为欧洲品牌代工15年+ ，年产200万辆。',
 '出行', '电动自行车', 'https://www.tailing-bike.com', 'China', TRUE, FALSE),

-- 充电桩 / 充电设备头部品牌
('星星充电', 'Star Charge', 'star-charge',
 'China''s #1 EV charging network operator, 500K+ public chargers, expanding to EU with premium home chargers.',
 '中国第一大电动汽车充电网络运营商，50万+公共充电桩，正通过高端家用充电桩扩张欧洲。',
 '出行', '充电桩', 'https://www.starcharge.com', 'China', TRUE, TRUE),

('特来电', 'TELD', 'teld',
 'Top 3 EV charging network in China, 400K+ public chargers, parent company TGOOD, listed company.',
 '中国第三大电动汽车充电网络，40万+公共充电桩，母公司特锐德，A股上市。',
 '出行', '充电桩', 'https://www.teld.cn', 'China', TRUE, TRUE),

('深圳充电易', 'EVOCharge', 'evocharge',
 'Compact EV home charger brand, Level 1/Level 2, popular in NA market, OEM for major US distributors.',
 '紧凑型家用电动汽车充电桩品牌，L1/L2 级别，北美市场受欢迎，为美国主要分销商代工。',
 '出行', '充电桩', 'https://www.evocharge.com', 'China', TRUE, FALSE),

('小蜂充电', 'Besen', 'besen',
 'Portable EV charger specialist, 100+ countries export, Amazon best-seller in portable EVSE category.',
 '便携式电动汽车充电桩专家，出口100+国家，便携式 EVSE 品类亚马逊销冠。',
 '出行', '充电桩', 'https://www.besen-group.com', 'China', TRUE, TRUE),

('挚达科技', 'Zhida', 'zhida',
 'Leading home EV charging brand in China, smart app control, exporting under white-label to EU/US brands.',
 '中国领先家用电动汽车充电品牌，智能App控制，为欧美品牌代工贴牌。',
 '出行', '充电桩', 'https://www.zhida-auto.com', 'China', TRUE, FALSE)

ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    name_en = EXCLUDED.name_en,
    description = EXCLUDED.description,
    description_cn = EXCLUDED.description_cn,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    website = EXCLUDED.website,
    updated_at = NOW();

-- ============================================
-- 同时更新分类枚举（新增"出行"主分类）
-- ============================================
COMMENT ON COLUMN brands.category IS '主分类: 出行 / 3C / 家居 / 美妆 / 其他';
COMMENT ON COLUMN brands.subcategory IS '子分类: 电动自行车 / 充电桩 / 配件 / 其他';

-- ============================================
-- 完成
-- ============================================
SELECT
    category,
    subcategory,
    COUNT(*) as brand_count
FROM brands
GROUP BY category, subcategory
ORDER BY category, subcategory;