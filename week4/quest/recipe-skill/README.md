# 🍳 혼삶 레시피 스킬

1인 가구를 위한 Claude Code Skill — 냉장고 재료로 레시피 자동 생성 + Notion 업로드

## 컨셉
"혼삶 with AI" 플랫폼 시리즈의 첫 번째 퀘스트.
냉장고에 있는 재료를 JSON으로 관리하고, 스킬이 그 정보를 읽어 1인 가구용 레시피를 생성합니다.

## 📁 폴더 구조
```
recipe-skill/
├── ingredients/              # 재료별 JSON (10개)
├── .claude/skills/recipe/
│   ├── SKILL.md              # 스킬 정의
│   └── upload_notion.py      # Notion 업로드 스크립트
├── recipes/                  # 생성된 레시피(.md)
├── .env.example
├── .gitignore
└── README.md
```

## ⚠️ 실행 전 필수 설정

### 1. Notion 설정
1. Notion Integration 생성: https://notion.so/my-integrations
2. API 토큰 복사
3. 레시피 저장용 DB 생성 (아래 컬럼 구성)
4. DB와 Integration 연결 (DB 페이지 우측 상단 ⋯ → Connections)

### DB 컬럼 구성
| 컬럼명 | 타입 | 옵션 |
|---|---|---|
| 이름 | Title | — |
| 날짜 | Date | — |
| 칼로리 | Number | — |
| 시간 | Number | — |
| 난이도 | Select | ⭐ / ⭐⭐ / ⭐⭐⭐ |
| 재료 | Multi-select | — |
| 버전 | Select | 초간단 / 든든한 / 색다른 |

### 2. 환경 변수 설정
```bash
cp .env.example .env
# .env 파일에 NOTION_TOKEN, NOTION_DATABASE_ID 입력
```

### 3. Python 패키지 설치
```bash
pip install requests
```

## 🚀 사용법

### 재료 추가/수정
`ingredients/` 폴더에 JSON 파일 추가/삭제만 하면 끝!

```json
{
  "name": "재료 한글명",
  "quantity": "수량",
  "category": "냉장",
  "expiry": "YYYY-MM-DD",
  "allergen": false
}
```

### 레시피 생성
Claude Code에서:
```
/recipe
```
또는
```
레시피 만들어줘
```

### 결과 확인
- 로컬: `recipes/` 폴더에 마크다운 파일 (`recipe-YYYYMMDD-HHMMSS.md`)
- Notion: 혼삶 레시피 DB에 3개 레시피 자동 추가

## ✨ 차별화 기능
- 🔥 예상 칼로리 계산
- ⏱️ 예상 조리시간
- ⭐ 난이도 별점 (⭐/⭐⭐/⭐⭐⭐)
- 🔄 대체 재료 추천
- 📝 Notion DB 자동 업로드
- 🥇🥈🥉 3가지 버전 (초간단/든든한/색다른)

## 🛠️ 기술 스택
- Claude Code Skills
- Python (Notion API 업로드)
- Notion API
