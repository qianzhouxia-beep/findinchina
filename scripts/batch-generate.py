"""
FindInChina 批量内容生成脚本（Python 版）
用 urllib 直接调 DeepSeek API，避免 node 依赖问题
输出到 generated-content/ 目录
"""
import json
import os
import time
import urllib.request
import urllib.error

API_KEY = "sk-fa9d6a4dd4ba4d29b98606509f1bd601"
API_URL = "https://api.deepseek.com/chat/completions"
MODEL = "deepseek-v4-flash"

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "generated-content")


def call_deepseek(prompt, max_tokens=6000, temperature=0.5, json_mode=True):
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a meticulous brand researcher producing structured JSON data."},
            {"role": "user", "content": prompt},
        ],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    req = urllib.request.Request(
        API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
        },
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"]


REPORT_PROMPT = """You are the lead researcher at FindInChina, a curated editorial platform helping global buyers source verified Chinese brands.

Create a "FindIn Report" for the category: **{category}**

Brands to cover: {brands}

Output MUST be valid JSON with EXACTLY this structure (no markdown, no code fences):
{{
  "slug": "kebab-case-unique-slug",
  "title": "Compelling headline with brand count and category",
  "subtitle": "One-line teaser naming the brands",
  "category": "{category}",
  "brand_count": 5,
  "criteria_count": 4,
  "read_time_min": 8,
  "last_verified": "2026-08-17",
  "excerpt": "One-line summary for list cards",
  "intro_text": "3-4 paragraph editorial intro",
  "criteria_text": ["Real export operation", "Working warranty", "Product line currency", "Verifiable contact"],
  "brand_blocks": [
    {{
      "brand_name": "Brand English Name",
      "slug": "brand-slug",
      "quick_take": "One sentence: who this is best for",
      "why_vetted": ["3-4 specific vetted facts with data"],
      "who_for": ["2-3 buyer personas"],
      "expert_quote": "One strong editorial quote",
      "gallery": []
    }}
  ],
  "comparison_rows": [
    {{
      "brand_slug": "brand-slug",
      "brand_name": "Brand",
      "price": 999,
      "price_label": "$999",
      "warranty": "2 yr",
      "countries": 5,
      "rating": 4.0,
      "third_party": "\u2014"
    }}
  ],
  "methodology_text": "2 paragraphs explaining the 4-criteria scoring method",
  "sources": ["source 1", "source 2"]
}}

IMPORTANT:
- Use REAL brand names, REAL approximate prices, REAL warranty terms (research from official sites)
- Editorial tone: vetted, trustworthy, specific data \u2014 NOT generic filler
- At least 4-5 brands in brand_blocks
- All text in English, written for global buyers sourcing from China
- Do NOT include speculative data"""


def generate_report(category, brands):
    prompt = REPORT_PROMPT.format(category=category, brands=", ".join(brands))
    raw = call_deepseek(prompt, max_tokens=6000, temperature=0.5)
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # 尝试从代码块中提取
        import re
        match = re.search(r"```json\s*([\s\S]*?)```", raw)
        if match:
            return json.loads(match.group(1))
        print(f"[WARN] JSON 解析失败: {raw[:300]}")
        return None


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    reports = [
        ("Outdoor gear", ["Naturehike", "KingCamp", "FIELDOOR", "DOD", "3F UL Gear"]),
        ("GaN chargers", ["CUKTECH", "PISEN", "Baseus", "UGREEN", "Mcdodo"]),
        ("Mechanical keyboards", ["Keychron", "Epomaker", "Akko", "Royal Kludge", "Aula"]),
    ]

    summary = {"generated_at": time.strftime("%Y-%m-%d %H:%M:%S"), "reports": []}

    for category, brands in reports:
        print(f"生成报告: {category}...", flush=True)
        try:
            data = generate_report(category, brands)
            if data:
                slug = data.get("slug") or category.lower().replace(" ", "-")
                filepath = os.path.join(OUT_DIR, f"report-{slug}.json")
                with open(filepath, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                summary["reports"].append({"category": category, "slug": slug, "title": data.get("title"), "file": filepath})
                print(f"  OK: {data.get('title')}", flush=True)
            else:
                summary["reports"].append({"category": category, "error": "parse failed"})
        except Exception as e:
            summary["reports"].append({"category": category, "error": str(e)})
            print(f"  ERROR: {e}", flush=True)
        time.sleep(2)

    with open(os.path.join(OUT_DIR, "summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print(f"\n=== 完成: {len(summary['reports'])} 篇报告 ===", flush=True)
    print(f"输出目录: {OUT_DIR}", flush=True)


if __name__ == "__main__":
    main()
