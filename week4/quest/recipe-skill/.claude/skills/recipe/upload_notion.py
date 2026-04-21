"""
혼삶 레시피 스킬 - Notion DB 업로드 스크립트

사용법:
    python upload_notion.py '<레시피_json_데이터>'

레시피 JSON 스키마:
{
    "name": "계란 김치볶음밥",
    "date": "2026-04-21",
    "calorie": 520,
    "time": 10,
    "difficulty": "⭐",
    "ingredients": ["계란", "신김치", "즉석밥"],
    "version": "초간단"
}

환경변수:
- NOTION_TOKEN       : Notion Integration 토큰
- NOTION_DATABASE_ID : 업로드할 DB ID
"""

import json
import os
import sys

import requests


NOTION_API_URL = "https://api.notion.com/v1/pages"
NOTION_VERSION = "2022-06-28"


def load_env_file(path: str = ".env") -> None:
    """프로젝트 루트의 .env 파일을 읽어 os.environ에 주입 (python-dotenv 없이 동작)."""
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        for raw in f:
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


def build_properties(recipe: dict) -> dict:
    """레시피 dict → Notion properties 포맷 변환."""
    return {
        "이름": {
            "title": [{"text": {"content": recipe["name"]}}]
        },
        "날짜": {
            "date": {"start": recipe["date"]}
        },
        "칼로리": {
            "number": int(recipe["calorie"])
        },
        "시간": {
            "number": int(recipe["time"])
        },
        "난이도": {
            "select": {"name": recipe["difficulty"]}
        },
        "재료": {
            "multi_select": [{"name": tag} for tag in recipe["ingredients"]]
        },
        "버전": {
            "select": {"name": recipe["version"]}
        },
    }


def upload_recipe(recipe: dict, token: str, database_id: str) -> dict:
    headers = {
        "Authorization": f"Bearer {token}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    }
    payload = {
        "parent": {"database_id": database_id},
        "properties": build_properties(recipe),
    }
    response = requests.post(NOTION_API_URL, headers=headers, json=payload, timeout=15)
    if response.status_code >= 400:
        raise RuntimeError(
            f"Notion 업로드 실패 ({response.status_code}): {response.text}"
        )
    return response.json()


def main() -> int:
    if len(sys.argv) < 2:
        print("❌ 사용법: python upload_notion.py '<레시피_json_데이터>'")
        return 1

    load_env_file()
    token = os.environ.get("NOTION_TOKEN")
    database_id = os.environ.get("NOTION_DATABASE_ID")
    if not token or not database_id:
        print("❌ NOTION_TOKEN / NOTION_DATABASE_ID 환경변수가 필요합니다. .env 를 확인하세요.")
        return 1

    raw = sys.argv[1]
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        print(f"❌ JSON 파싱 실패: {exc}")
        return 1

    recipes = data if isinstance(data, list) else [data]

    for idx, recipe in enumerate(recipes, start=1):
        try:
            result = upload_recipe(recipe, token, database_id)
            page_id = result.get("id", "unknown")
            print(f"✅ [{idx}/{len(recipes)}] '{recipe['name']}' 업로드 완료 (page: {page_id})")
        except Exception as exc:
            print(f"❌ [{idx}/{len(recipes)}] '{recipe.get('name', '?')}' 업로드 실패: {exc}")
            return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
