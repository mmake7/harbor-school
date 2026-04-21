# 🏠 혼삶 웹 (Honsam Web)

1인 가구를 위한 **냉장고 관리 + AI 레시피 웹앱**
week4 Q1(레시피 스킬) + Q2(냉장고 관리) 동시 해결 버전.

## ✨ 기능
- 🧊 **냉장고 재료 관리** (CRUD) — 이름/수량/카테고리/유통기한/알레르기
- 🍳 **AI 레시피 자동 생성** — Claude가 3종(초간단/든든한/색다른) 동시 제안
- 📝 **Notion 자동 업로드** — 생성 즉시 DB에 3행 추가
- 📚 **레시피 히스토리** — 버전별 필터 + 펼쳐보기

## 🛠 기술 스택
| Layer | Tech |
|---|---|
| Frontend | React 18 (CDN) + Babel Standalone, 단일 HTML |
| Backend | Vercel Serverless Functions (Node.js, ESM) |
| DB | Supabase PostgreSQL (`pg` 직접 연결) |
| AI | Anthropic Claude API — `claude-sonnet-4-6` (프롬프트 캐싱 적용) |
| 외부 연동 | Notion API v2022-06-28 |

## 📂 폴더 구조
```
web/
├── api/
│   ├── ingredients.js   # 재료 CRUD (GET/POST/PUT/DELETE)
│   └── recipe.js        # AI 생성 + Notion 업로드 + DB 저장
├── public/
│   └── index.html       # SPA (React CDN, 3 탭)
├── package.json
├── vercel.json          # api/* 라우팅 + 정적 서빙
├── .env.example
├── .env.local           # (gitignored) 실제 값
├── .gitignore
└── README.md
```

## 🚀 로컬 실행

### 1) 환경변수 세팅
```bash
cp .env.example .env.local
# .env.local을 열어 실제 값 입력
```

필요한 값:
- `DATABASE_URL` — Supabase → Settings → Database → **Transaction pooler** URI
- `ANTHROPIC_API_KEY` — https://console.anthropic.com → API Keys
- `NOTION_TOKEN` / `NOTION_DATABASE_ID` — 1번 퀘스트 값 그대로 재사용 가능

### 2) 의존성 설치
```bash
npm install
npm install -g vercel   # 전역 CLI (최초 한번)
```

### 3) 개발 서버
```bash
vercel dev
# → http://localhost:3000
```

## ☁️ Vercel 배포

### 1) 최초 연결
```bash
vercel            # 프로젝트 이름/설정 프롬프트 응답
```

### 2) 환경변수 등록 (Vercel 대시보드)
`Project → Settings → Environment Variables`에
`DATABASE_URL`, `ANTHROPIC_API_KEY`, `NOTION_TOKEN`, `NOTION_DATABASE_ID` 네 개 등록
(Production + Preview + Development 전부 체크).

### 3) 프로덕션 배포
```bash
vercel --prod
```

## 🗃 Supabase 테이블 스키마

이미 생성됨 — 참고용 DDL:

```sql
create table fridge_ingredients (
  id          bigserial primary key,
  name        text not null,
  quantity    text,
  category    text default '냉장',
  expiry      date,
  allergen    boolean default false
);

create table fridge_recipes (
  id              bigserial primary key,
  title           text not null,
  version         text,        -- '초간단' | '든든한' | '색다른'
  calories        int,
  cook_time       int,
  difficulty      text,        -- '⭐' | '⭐⭐' | '⭐⭐⭐'
  ingredients     jsonb,
  steps           text,
  tip             text,
  notion_page_id  text,
  created_at      timestamptz default now()
);
```

## 🧪 API 테스트 (curl)

로컬(`vercel dev`) 기준 `http://localhost:3000`:

```bash
# 재료 목록
curl http://localhost:3000/api/ingredients

# 재료 추가
curl -X POST http://localhost:3000/api/ingredients \
  -H "Content-Type: application/json" \
  -d '{"name":"계란","quantity":"6개","category":"냉장","expiry":"2026-05-01"}'

# 재료 수정
curl -X PUT "http://localhost:3000/api/ingredients?id=1" \
  -H "Content-Type: application/json" \
  -d '{"name":"계란","quantity":"10개","category":"냉장","expiry":"2026-05-05","allergen":false}'

# 재료 삭제
curl -X DELETE "http://localhost:3000/api/ingredients?id=1"

# 레시피 생성 (Claude 호출 + Notion 업로드 + DB 저장)
curl -X POST http://localhost:3000/api/recipe

# 레시피 히스토리
curl http://localhost:3000/api/recipe
```

## 🎨 UI 컨셉 — "혼삶 주방"
- 크림 베이지 배경 `#FFF8F0` + 주황 포인트 `#FF8C42`
- 둥근 모서리, 따뜻한 그림자, 모바일 반응형
- 상단 스티키 탭 3개: 🧊 냉장고 / 🍳 레시피 만들기 / 📚 히스토리
- 유통기한 3일 이하 재료는 빨간 `⚠️ N일 남음` 배지
- 레시피 생성 중 스피너 + "달빛 선녀가 고민 중이에요..." 메시지

## 🔐 보안
- `.env.local`, `.env`, `.vercel/`는 `.gitignore`로 차단
- Anthropic/Notion/Supabase 키는 모두 서버 환경변수로만 접근 (브라우저 노출 없음)
- 프론트는 `/api/*`만 호출
