-- FindInChina: fix subcategory English
-- Update subcategory from Chinese to English
-- 2026-06-11

UPDATE brands SET subcategory = 'E-bike' WHERE subcategory = '电动自行车';
UPDATE brands SET subcategory = 'EV charger' WHERE subcategory = '充电桩';
UPDATE brands SET subcategory = 'Audio' WHERE subcategory IN ('耳机', '音箱', '音响', '音频设备');
UPDATE brands SET subcategory = 'Power bank' WHERE subcategory = '充电宝';
UPDATE brands SET subcategory = 'Power & charging' WHERE subcategory IN ('移动电源', '充电设备');

-- Also fix category from Chinese "出行" to English "Mobility"
UPDATE brands SET category = 'Mobility' WHERE category = '出行';
UPDATE brands SET category = 'EV charging' WHERE category = '电动车充电';
UPDATE brands SET category = 'Audio' WHERE category = '音频';
UPDATE brands SET category = 'Power & charging' WHERE category = '电源与充电';

-- Verification
SELECT subcategory, COUNT(*) AS brand_count
FROM brands
WHERE subcategory IS NOT NULL
GROUP BY subcategory
ORDER BY brand_count DESC;

SELECT category, COUNT(*) AS brand_count
FROM brands
WHERE category IS NOT NULL
GROUP BY category
ORDER BY brand_count DESC;
