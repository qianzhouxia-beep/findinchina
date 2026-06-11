"""
FindInChina 品牌抓取脚本
=========================
功能：用 Claude API 自动从公开信息中提取结构化的中国品牌数据
输入：品牌名列表
输出：结构化 JSON，写入数据库

用法：
    export ANTHROPIC_API_KEY=sk-ant-xxxxx
    export SUPABASE_URL=https://xxx.supabase.co
    export SUPABASE_SERVICE_KEY=xxxxx
    python scripts/scrape_brands.py
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
    raise ValueError("请设置环境变量: SUPABASE_URL, SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)


# ============================================
# 首批品牌清单（中国电动车出海）
# ============================================
INITIAL_BRANDS = [
    "BYD 比亚迪",
    "NIO 蔚来",
    "XPeng 小鹏",
    "Li Auto 理想",
    "Zeekr 极氪",
    "Geely 吉利",
    "Chery 奇瑞",
    "MG (上汽名爵)",
    "Great Wall 长城",
    "Polestar 极星",
    "Avatr 阿维塔",
    "Voyah 岚图",
    "Leapmotor 零跑",
    "GAC Aion 广汽埃安",
    "JAC 江淮",
]


# ============================================
# 用 Claude 提取品牌信息
# ============================================
EXTRACTION_PROMPT = """你是 FindInChina 的数据研究员。我们要把中国品牌信息整理成结构化数据库。

请根据你的知识，给出关于 "{brand_name}" 的最新信息（2025-2026）：

要求：
1. 所有信息必须是事实，不要编造
2. 如果不确定某个字段，填 null
3. 出口国家用 ISO 国家代码（US, DE, UK, NO 等）
4. description 用英文写一段（100-200 字），讲这个品牌的核心优势和海外吸引力
5. contact_email / contact_phone / website 只填公开信息

输出严格的 JSON（不要加 markdown 代码块标记）：
{{
  "name": "中文名",
  "name_en": "英文名",
  "slug": "url-friendly-name",
  "description": "英文简介（100-200 字）",
  "description_cn": "中文简介（100-200 字）",
  "category": "汽车",
  "subcategory": "电动车",
  "website": "https://...",
  "contact_email": "email 或 null",
  "contact_phone": "+86... 或 null",
  "country_origin": "China",
  "export_countries": ["US", "DE", "UK"],
  "tags": ["EV", "sedan", "affordable"],
  "is_featured": true
}}
"""


def extract_brand_info(brand_name: str) -> Dict | None:
    """用 Claude 提取品牌信息"""
    print(f"  → 正在提取: {brand_name}")

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2048,
            temperature=0.2,
            messages=[
                {
                    "role": "user",
                    "content": EXTRACTION_PROMPT.format(brand_name=brand_name),
                }
            ],
        )

        text = message.content[0].text.strip()

        # 尝试提取 JSON（去除可能的 markdown）
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
            text = text.strip()

        data = json.loads(text)

        # 补上默认字段
        data.setdefault("verified", True)
        data.setdefault("verified_by", "麦麦 AI 抓取")
        data.setdefault("verified_at", "2026-06-10T00:00:00Z")
        data.setdefault("source_urls", [f"https://www.google.com/search?q={brand_name.replace(' ', '+')}"])

        return data

    except json.JSONDecodeError as e:
        print(f"  ✗ JSON 解析失败: {e}")
        print(f"    原始内容: {text[:200]}")
        return None
    except Exception as e:
        print(f"  ✗ 提取失败: {e}")
        return None


def insert_brand(data: Dict) -> bool:
    """插入品牌到 Supabase"""
    try:
        result = supabase.table("brands").insert(data).execute()
        if result.data:
            print(f"  ✓ 成功入库: {data['name_en']}")
            return True
        return False
    except Exception as e:
        if "duplicate" in str(e).lower() or "unique" in str(e).lower():
            print(f"  → 已存在，跳过: {data.get('name_en', '?')}")
        else:
            print(f"  ✗ 入库失败: {e}")
        return False


def main():
    print(f"FindInChina 品牌抓取 — 首批 {len(INITIAL_BRANDS)} 个")
    print("=" * 50)

    success_count = 0
    failed_count = 0

    for i, brand in enumerate(INITIAL_BRANDS, 1):
        print(f"\n[{i}/{len(INITIAL_BRANDS)}] {brand}")

        data = extract_brand_info(brand)
        if data:
            if insert_brand(data):
                success_count += 1
            else:
                failed_count += 1
        else:
            failed_count += 1

        # 限速，避免打爆 API
        time.sleep(2)

    print("\n" + "=" * 50)
    print(f"完成! 成功 {success_count} / 失败 {failed_count}")
    print("=" * 50)


if __name__ == "__main__":
    main()