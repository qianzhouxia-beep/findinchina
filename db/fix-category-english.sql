-- Update category field to English
UPDATE public.brands SET category = 'Mobility' WHERE slug IN ('engwe', 'himiway', 'urtopia', 'tenways', 'lankeleisi', 'yadea', 'aima', 'xdao', 'tailing', 'dji-avinox');
UPDATE public.brands SET category = 'EV charging' WHERE slug IN ('star-charge', 'teld', 'besen', 'zhida', 'evocharge');
-- For e-bike subcategories, set subcategory
UPDATE public.brands SET subcategory = 'Folding' WHERE slug IN ('himiway');
UPDATE public.brands SET subcategory = 'Fat-tire / moped' WHERE slug = 'engwe';
UPDATE public.brands SET subcategory = 'Carbon road' WHERE slug = 'urtopia';
UPDATE public.brands SET subcategory = 'Belt-drive city' WHERE slug = 'tenways';
UPDATE public.brands SET subcategory = 'High-power dual motor' WHERE slug = 'lankeleisi';
UPDATE public.brands SET subcategory = 'Charging hardware' WHERE slug = 'star-charge';

-- Verify
SELECT slug, name_en, category, subcategory
FROM public.brands
ORDER BY category, name_en;
