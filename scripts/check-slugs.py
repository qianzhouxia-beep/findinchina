#!/usr/bin/env python3
"""Check brand slugs in Supabase"""
import os
from supabase import create_client

url = "https://gmzqogzqseylgxcomlgz.supabase.co"
key = "sb_publishable_GtuPmbaa1T_MlmRd-dW4Pg_zYY9f161"
sb = create_client(url, key)

r = sb.table("brands").select("slug, name_en, verified, featured, rating_avg").order("rating_avg", desc=True).execute()
for b in r.data:
    print(f"slug={b['slug']:20} name={b['name_en']:15} verified={b['verified']} rating={b.get('rating_avg')}")
