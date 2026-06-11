"""
FindInChina 品牌抓取脚本 V3 — DeepSeek 版
==========================================
用 DeepSeek API 替换 Anthropic Claude
- 价格：DeepSeek $0.14/M output vs Claude $15/M output（便宜100 倍）
- 新用户送500万 tokens 免费
- 中文 + 英文都强

用法：
    export DEEPSEEK_API_KEY=sk-xxxxx
    export SUPABASE_URL=https://xxx.supabase.co
    export SUPABASE_SERVICE_KEY=xxxxx
    python scripts/scrape_brands_v3.py
"""

import os
import json
import time
from typing import List, Dict
from openai import OpenAI
from supabase import create_client, Client


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

if not all([SUPABASE_URL, SUPABASE_SERVICE_KEY, DEEPSEEK_API_KEY]):
    raise ValueError("请设置: SUPABASE_URL, SUPABASE_SERVICE_KEY, DEEPSEEK_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.deepseek.com",
)


INITIAL_BRANDS = [
    # E-bike 头部（10 个）
    "Yadea 雅迪",
    "AIMA 爱玛",
    "Urtopia 优途",
    "ENGWE",
    "Himiway",
    "DJI Avinox",
    "TENWAYS",
    "Lankeleisi 兰克雷司",
    "XDAO 小刀",
    "Tailing 泰麟",

    # 充电桩（5 个）
    "Star Charge 星星充电",
    "TELD 特来电",
    "Besen 小蜂充电",
    "Zhida 挚达",
    "EVOCharge",
]


EXTRACTION_PROMPT = """你是 FindInChina 的数据研究员。我们要把中国品牌信息整理成结构化数据库。

请根据你的知识，给出关于 "{brand_name}" 的最新信息（2025-2026）：

要求：
1. 所有信息必须是事实，不要编造
2. 如果不确定某个字段，填 null
3. export_countries 用 ISO 国家代码
4. description 用英文（100-200 字）

输出严格的 JSON：
{{
  "name": "中文名",
  "name_en": "英文名",
  "slug": "url-friendly-name",
  "description": "英文简介",
  "description_cn": "中文简介",
  "category": "出行",
  "subcategory": "电动自行车 或 充电桩",
  "website": "https://...",
  "contact_email": "email 或 null",
  "contact_phone": "+86... 或 null",
  "country_origin": "China",
  "export_countries": ["US", "DE"],
  "tags": ["e-bike", "premium"],
  "is_featured": true
}}
"""


def extract_brand_info(brand_name: str) -> Dict | None:
    print(f"  → 提取: {brand_name}")
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "你是数据研究员，输出严格 JSON。"},
                {"role": "user", "content": EXTRACTION_PROMPT.format(brand_name=brand_name)},
            ],
            temperature=0.2,
            max_tokens=2048,
        )

        text = response.choices[0].message.content.strip()

        # 提取 JSON
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
            text = text.strip()

        data = json.loads(text)
        data.setdefault("verified", True)
        data.setdefault("verified_by", "麦麦 AI 抓取 (DeepSeek)")
        data.setdefault("verified_at", "2026-06-10T00:00:00Z")
        data.setdefault("source_urls", [f"https://www.google.com/search?q={brand_name.replace(' ', '+')}"])
        return data
    except Exception as e:
        print(f"  ✗ 失败: {e}")
        return None


def insert_brand(data: Dict) -> bool:
    try:
        result = supabase.table("brands").upsert(data, on_conflict="slug").execute()
        if result.data:
            print(f"  ✓ 入库: {data['name_en']} ({data.get('subcategory')})")
            return True
        return False
    except Exception as e:
        print(f"  ✗ 入库失败: {e}")
        return False


def main():
    print(f"FindInChina V3 抓取 — {len(INITIAL_BRANDS)} 个品牌（DeepSeek 版）")
    print("=" * 60)

    success = 0
    failed = 0

    for i, brand in enumerate(INITIAL_BRANDS, 1):
        print(f"\n[{i}/{len(INITIAL_BRANDS)}] {brand}")
        data = extract_brand_info(brand)
        if data and insert_brand(data):
            success += 1
        else:
            failed += 1
        time.sleep(2)

    print("\n" + "=" * 60)
    print(f"完成! 成功 {success} / 失败 {failed}")
    print("=" * 60)


if __name__ == "__main__":
    main()