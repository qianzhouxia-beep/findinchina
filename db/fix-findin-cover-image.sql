-- FindInChina: Update findin_reports cover_image_url
-- 2026-06-11
-- /brands/engwe.jpg was deleted (replaced with /brands/engwe/ subfolder)

update findin_reports
set cover_image_url = '/brands/engwe/engwe-engine-pro-3.jpg'
where slug = '6-chinese-ebike-brands-compared';
