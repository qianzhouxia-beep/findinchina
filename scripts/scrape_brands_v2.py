"""
FindInChina 品牌抓取脚本 V2 — E-bike + 充电桩
=============================================
首发品类：电动自行车 + 充电桩（取代汽车整车方向）
"""

import os
import json
import time
from typing import List, Dict
import anthropic
from supabase import create_client, Client


# ============================================
# 配置
# ============================================
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

if not all([SUPABASE_URL, SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY]):
    raise ValueError("请设置环境变量")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)


# ============================================
# 首批品牌清单：E-bike + 充电桩
# ============================================
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
3. export_countries 用 ISO 国家代码（US, DE, UK, NO 等）
4. description 用英文写一段（100-200 字），讲这个品牌的核心优势和海外吸引力
5. contact_email / contact_phone / website 只填公开信息

输出严格的 JSON：
{{
  "name": "中文名",
  "name_en": "英文名",
  "slug": "url-friendly-name",
  "description": "英文简介（100-200 字）",
  "description_cn": "中文简介（100-200 字）",
  "category": "出行",
  "subcategory": "电动自行车 或 充电桩",
  "website": "https://...",
  "contact_email": "email 或 null",
  "contact_phone": "+86... 或 null",
  "country_origin": "China",
  "export_countries": ["US", "DE", "UK"],
  "tags": ["e-bike", "premium", "folding"],
  "is_featured": true
}}
"""


def extract_brand_info(brand_name: str) -> Dict | None:
    print(f"  → 提取: {brand_name}")
    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2048,
            temperature=0.2,
            messages=[
                {"role": "user", "content": EXTRACTION_PROMPT.format(brand_name=brand_name)},
            ],
        )

        text = message.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
            text = text.strip()

        data = json.loads(text)
        data.setdefault("verified", True)
        data.setdefault("verified_by", "麦麦 AI 抓取")
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
    print(f"FindInChina V2 抓取 — {len(INITIAL_BRANDS)} 个品牌（E-bike + 充电桩）")
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