# 다오니 시뮬레이터 — Day 0 환경 인벤토리

작성일: 2026-05-13
작성 방법: Plan Mode + Explore 에이전트 3회 read-only 탐색. 추측 금지, 실제 파일 인용. 못 찾은 항목은 "확인 안 됨"으로 명시.

조사 대상 리포 / 폴더:
- harbor-school: `D:\Dropbox\workspace\harbor-school`
- harbor-community: `D:\Dropbox\workspace\harbor-community`
- (보너스 발견) **dongne-golmok**: `D:\Dropbox\workspace\dongne-golmok` — 별도 git repo · 라이브 https://dongne-golmok.vercel.app

---

## 핵심 요약 (한눈에)

| 의뢰 항목 | 상태 | 위치 |
|---|---|---|
| 5주차 문카페 /me 듀오 페르소나 | ✅ | `harbor-community/api/moon.js` |
| 5주차 4축 분석 챗봇 | ✅ | `harbor-school/week5/quest3-budget-app/api/analyze.js` |
| 6주차 당근마켓 클론 | ✅ (pivot) | 별도 repo `dongne-golmok` (school week6/quest5는 README만) |
| 7주차 today-room | ✅ | `harbor-school/week7/final/today-room` (라이브 https://today-room.vercel.app) |
| 5~7주차 Playwright 리서치 | 부분 | `week5/quest2-research-agent/` (vLLM·양봉 AI gap analysis) + today-room 검증(Playwright MCP) |
| 7주차 GPT Image 1 호출 | ✅ | quest 3종 + goblin 3종 + agent + today-room/scripts |
| Notion MCP 회고 시스템 | ❌ 미구현 | quest1-notion-assistant는 OAuth 셋업·뼈대만 |
| Pattern Reader 가계부 E2E (Playwright) | ❌ 미구현 | 5주차 어디에도 spec/playwright deps 없음 |

---

## 1. 리포 구조

### harbor-school (depth 2~3)

```
harbor-school/
├── week1/   드라마·음식 문화 리서치 (MD + 이미지)
├── week2/   goblin/ + practice/ + quest/  (초기 실험)
├── week3/   goblin/ + quest/  (Claude API 초반: my-chatgpt, study-agent, nickname-generator)
├── week4/   goblin/ + quest/  (recipe-skill 등)
├── week5/   AI 리서치 에이전트 + 가계부
│   ├── quest1-notion-assistant/   Notion MCP OAuth 셋업·뼈대
│   ├── quest2-research-agent/     vLLM 폐쇄망·양봉 AI 딥다이브
│   ├── quest3-budget-app/         가계부 앱 (Claude Haiku 4.5, 4축 분석 ★)
│   ├── quest4-budget-analyzer/    예산 분석 (Claude API)
│   ├── quest56-community/         커뮤니티 마켓 (자체 JWT + Postgres)
│   └── quest78-prime/
├── week6/   당근마켓 클론 quest 모음
│   ├── quest1-shopping-completion/
│   ├── quest2-research-agent/
│   ├── quest5-dongne-golmok/      README+스크린샷만 (실제 코드는 별도 repo로 pivot)
│   └── (기타 quest)
└── week7/
    ├── final/today-room/          Next.js 14 마켓플레이스 (Vercel 라이브)
    ├── goblin/                    {thumbnail,instagram-card,profile-card}-generator (3종 5톤 시각 시스템)
    ├── agent/static-visual-maker/ goblin 3종 통합 도구 (config 기반)
    ├── quest/                     business-card · cafe-menu-typa · cafe-poster-typa-lavender (3종)
    └── daoni-simulator/           ← 이 INVENTORY.md
```

### harbor-community (depth 2)

```
harbor-community/
├── api/                  7개 함수 — Vercel Hobby 12 함수 제한 대응 (각 ?view= 분기)
│   ├── auth.js           (226줄) JWT 회원가입·로그인·세션
│   ├── posts.js          (359줄) Q5 게시판 CRUD·댓글·반응
│   ├── shop.js           (685줄) Q6 쇼핑 카트·주문 (FOR UPDATE 락 트랜잭션)
│   ├── moon.js           (420줄) Q7+Q8 문카페 듀오 페르소나 (★ 다오니 핵심 재활용)
│   ├── upload.js         (100줄) ImageKit 업로드
│   ├── payment.js        (150줄+) TossPayments
│   └── content.js        (73줄)  프리미엄 본문 게이트
├── lib/
│   ├── auth-helper.js    (50줄)  JWT 검증 헬퍼
│   ├── datetime.js       (48줄)  KST 시간 처리
│   └── owl-context.md    (43줄)  Q7 페르소나 프로필
├── sql/                  001~007 DDL (9 테이블)
├── public/index.html     단일 SPA — React 18 CDN + Babel Standalone (3025줄)
├── scripts/apply.js      SQL 마이그레이션 러너
├── dev-server.js         (40줄) Express 로컬
└── vercel.json           라우팅 + 함수 timeout
```

### dongne-golmok (별도 repo, 6주차 quest5 pivot 결과물)

```
dongne-golmok/
├── index.html            단일 SPA (React 18 CDN + Tailwind CDN, no build, ~30KB)
├── api/                  Vercel Serverless 함수 5개
│   └── ai.js             (189줄) Claude Sonnet 4.6 + ephemeral prompt caching
├── data/shops.json       염창동 50개 가게 정적 컨텍스트
└── docs/                 README · MISSION · CONCEPT · ROADMAP · DEV · shops_mock · scenarios_mock (7종)
```

라이브: https://dongne-golmok.vercel.app · GitHub: https://github.com/mmake7/dongne-golmok

---

## 2. 재활용 가능한 패턴 (실제 코드 위치까지)

다오니 시뮬레이터에서 그대로 또는 적은 수정으로 끌어다 쓸 자산을 정리.

### 2.1 5주차 문카페 /me 라우트 — 듀오 페르소나 ★ (다오니 가장 핵심 자산)

**위치**: `harbor-community/api/moon.js` (420줄, SPA `public/index.html`의 `/me` 해시 라우트)

**캐릭터 정의** (`harbor-community/api/moon.js:215-228`):
```javascript
const SYSTEM_BASE = `당신은 '문카페'라는 야간 카페에서 일하는 두 명의 캐릭터입니다.
손님 한 명에게 동시에 두 관점의 브리핑을 들려줍니다.

# 캐릭터 1: ☕ 카페지기
- 역할: 카페 운영·실용 관점 어드바이저
- 톤: 차분하고 실용적, 짧고 핵심적
- 관심사: 매출, 손님, 메뉴, 사장 건강, 운영 효율
- 말투: "오늘 비 와요. 손님 줄 수 있으니 차 메뉴 하나 더 어때요?"

# 캐릭터 2: ✦ 달지기
- 역할: 개인 삶·감성 관점 어드바이저
- 톤: 시적이고 은유적, 동양적 비유 좋아함
- 관심사: 그림, 차, 음악, 야경, 마음 상태
- 말투: "비 오는 밤, 작업실 창밖 풍경 좋을 거예요. 보이차 한 잔, 빌 에반스 한 곡."`;
```

**Claude API 호출**:
- 모델: `claude-sonnet-4-6` (`api/moon.js:20`)
- SDK 안 씀 — `fetch('https://api.anthropic.com/v1/messages')` 직접 (`api/moon.js:19`)

**병렬 호출 패턴** (`api/moon.js:372`, `:396`):
```javascript
// 1차: 활동·날씨·뉴스 동시 수집
[me, weather, news] = await Promise.all([
  getMeData(user.uid),
  getWeatherData(),
  getNewsData(),
]);

// 2차: with/without context 두 가지 시점 동시 LLM 호출
[textWith, textWithout] = await Promise.all([
  callClaude(buildSystemPrompt(owlContext), userMessage),
  callClaude(buildSystemPromptNoContext(), userMessage),
]);
```

**Open-Meteo (날씨)** (`api/moon.js:148-175`):
- URL: `https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=...&daily=...&timezone=Asia%2FSeoul`
- 서울 종로구 고정. WMO weather code → 한글 라벨 매핑(`api/moon.js:23-32`).

**Google News RSS** (`api/moon.js:190-199`):
- Feed: `https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko`
- 정규식으로 XML 직접 파싱(`/<item[\s\S]*?<\/item>/g`), 최대 5건.

→ 다오니 Sense 모듈에 그대로 이식 가능. 페르소나만 카페지기·달지기 → 다오니 캐릭터로 교체.

### 2.2 5주차 4축 분석 챗봇 (Insight 가계부)

**위치**: `harbor-school/week5/quest3-budget-app/api/analyze.js` (410줄)

**모델**: Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

**System prompt (4축 정의)** (`api/analyze.js:24-74`):
```javascript
const SYSTEM_PROMPT = `너는 PRIME / Insight 가계부 분석 비서야.
형이 한 달 가계부 데이터를 던지면, 다음 4축으로 분석해.

[분석 4축]
축 1. 현금 흐름 — 수입/지출/저축률 (저축률 = (수입-지출)/수입 * 100)
축 2. 카테고리 — 상위 5개 + 고정비 vs 변동비 분류
축 3. 시간 패턴 — 평일 vs 주말, 일별 분포, 특이일 (평소 대비 2배 이상)
축 4. 등급 + 조언 — 종합 등급 (A+~F) + 한 줄 진단 + 다음 달 1~2개 액션

[응답 형식 — 반드시 순수 JSON, 마크다운 코드블록 없이]
{
  "headline": "한 줄 요약 (40자 이내)",
  "grade": "B+",
  "cashflow": { "income": ..., "expense": ..., ... },
  "category": { "top5": [...], "fixed_vs_variable": {...}, ... },
  "time_pattern": { "weekday_avg": ..., "weekend_avg": ..., ... },
  "advice": ["액션1", "액션2"]
}`
```

**호출 패턴** (`api/analyze.js:156-179`):
- `POST /api/analyze?view=monthly&month=YYYY-MM` — 월간 리포트
- `aggregateMonth(month)` — 수입·지출·카테고리·시간대별 집계
- `callClaude(aggregate)` → JSON 구조화 응답
- DB 캐시 (`app.budget_analyses` 테이블) — 월 1회 호출, 비용 절감

**확장**: `POST /api/analyze?view=chat` — 자연어 질문 + 지난달 비교 동시 분석

→ 다오니 Decide 모듈의 "여러 축으로 작물 추천 평가" 패턴에 직접 매핑.

### 2.3 6주차 당근 클론 → 동네 컨시어지 (dongne-golmok pivot)

**위치**: `D:\Dropbox\workspace\dongne-golmok` (별도 git repo)

**스택**:
- Frontend: 단일 `index.html` — React 18 CDN + Tailwind CDN (no build)
- Backend: Vercel Serverless Functions (`api/*.js`)
- AI: Claude Sonnet 4.6 + **ephemeral prompt caching** (GUIDELINES + 50개 가게 컨텍스트)
- Data: 정적 JSON (`data/shops.json` — 염창동 50개 가게)

**ephemeral caching 패턴** (`dongne-golmok/api/ai.js:143-153`):
```javascript
const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 600,
  system: [
    { type: 'text', text: GUIDELINES,      cache_control: { type: 'ephemeral' } },
    { type: 'text', text: SHOPS_CONTEXT,   cache_control: { type: 'ephemeral' } }
  ],
  messages: [{ role: 'user', content: userMessage }]
});
```

→ 다오니가 "고정 페르소나 가이드 + 변동 컨텍스트" 패턴을 쓸 때 정확히 같은 구조. Caching으로 비용 절감.

**6주차 quest5 마감과의 관계**:
- harbor-school/week6/quest5-dongne-golmok/은 README + 스크린샷만 (실제 코드는 pivot으로 별도 repo로 격상)
- 점수 갈음 정당화는 `harbor-school/week6/MD/MISSION.md`에 명문화

### 2.4 7주차 today-room — JWT + Postgres + ImageKit + Toss (community 패턴 이식형)

**위치**: `harbor-school/week7/final/today-room/`

**핵심 lib 파일**:

| 파일 | 책임 | community 원본 |
|---|---|---|
| `lib/db.ts` | pg Pool 싱글톤 (HMR 안전, global 캐싱) | community/api/auth.js의 Pool 패턴 |
| `lib/auth.ts` | JWT 발급·검증 + bcrypt + token_hash + 7일 만료 | `harbor-community/api/auth.js:26` + `lib/auth-helper.js:18-25` |
| `lib/upload.ts` | ImageKit 클라 싱글톤, base64→Buffer→toFile→upload, 3MB 제한, png/jpeg/webp | `harbor-community/api/upload.js:31` |
| `lib/auth-client.ts` | localStorage 토큰 + Bearer 자동 첨부 fetch wrapper | (today-room 신규) |

**API 라우트** (`app/api/**/route.ts`, 14개):
- `/auth/{register,login,me,logout}` · `/upload` · `/products` (+ `[id]`) · `/favorites` · `/chats` (+ `[id]/messages`) · `/orders` (+ `[id]`) · `/payment/{config,confirm}`

**DB 스키마** (`supabase/schema.sql`, 7 테이블 모두 `tr_` prefix):
1. `tr_profiles` — 사용자
2. `tr_auth_sessions` — 세션 (revoke 추적)
3. `tr_products` — 상품 (`images: text[]` 배열)
4. `tr_favorites` — 찜 (composite PK)
5. `tr_chats` — 채팅방
6. `tr_messages` — 메시지
7. `tr_orders` — 주문 (Toss)

**비밀번호 규칙** (`lib/auth.ts`): 8~100자 + 영문/숫자/특수 중 2종 이상.

**scripts/** (3종):
- `apply-schema.mjs` — `.env.local`의 `DATABASE_URL`로 schema.sql 한 방 실행 (idempotent)
- `check-imagekit.mjs` — `IMAGEKIT_PRIVATE_KEY` valid 검증 (ImageKit `/v1/files` ping)
- `generate-product-images.mjs` — `gpt-image-1` 5장 생성 + ImageKit `/today-room/seed/` 업로드 + DB 시드 (UPDATE 1 + INSERT 4)

→ 다오니가 인증·DB·이미지·결제 어느 하나라도 필요하면 today-room/lib/* 그대로 import 가능.

---

## 3. 딥리서치 · 자료조사 패턴 (다오니 Decide 모듈 핵심 자산)

### 3.1 5주차 quest2-research-agent (vLLM 폐쇄망 + 양봉 AI gap analysis)

**위치**: `harbor-school/week5/quest2-research-agent/research/`

**산출물 2건**:

| 파일 | 크기 | 주제 | 핵심 |
|---|---|---|---|
| `2026-04-30-vllm-qwen-airgap.md` | 15,567 bytes | vLLM + Qwen2.5-Coder-32B 폐쇄망 배포 | 9개 1차 출처 (기술·한국공공·사업 3축). 결론: "공공기관 코드 어시스턴트 도입 사례 0건 → SI 차별화" |
| `2026-04-30-edge-sllm-agriculture.md` | 21,614 bytes | 엣지 sLLM × 농축산 시장 매핑 | 19개 출처, 양봉 AI 매칭 10건 (글로벌 4 + 한국 6). 결론: "양봉 AI 센서 → sLLM 자연어 진단 레이어는 글로벌·국내 0건 시장 공백" |

**자동화 흐름** (코드 스크래핑은 직접 코드 X — Playwright MCP 도구로 진행한 결과):
1. Playwright MCP로 각 사이트(arxiv·HuggingFace·뉴스 등) 방문 + 텍스트 수집
2. Claude API에 분석·요약 프롬프트
3. `research/` 폴더에 Markdown으로 정리 (3축 구조 — 기술·시장·사업 기회)

**자동화 수준**:
- Playwright 의존성·설정 파일은 **리포 안에 없음** (`week5/.playwright-mcp/` 캐시 폴더만 존재). 즉 코드로 자동 멀티사이트 호출하는 스크립트는 없고, MCP를 사람(클로드)이 호출하는 형태.

→ 다오니 Decide 모듈 시사점:
- KAMIS 가격·뉴스·트렌드 자동 조사 = Playwright MCP 같은 패턴 + Claude로 요약
- 시뮬레이션 단계에선 mock JSON 사용 + 실 동작 시 동일 구조 유지
- 결과 포맷은 `quest2-research-agent/research/` 처럼 markdown + 3~4축 분리

### 3.2 today-room 검증 — Playwright MCP

`week7/final/today-room/` 라이브 9/9 시나리오 자동 검증을 Playwright MCP로 진행. 코드 작성 X — MCP 도구 호출. 검증 결과 5장 스크린샷 `week7/final/today-room/screenshots/`에 박힘.

→ 다오니 시뮬레이터 자체 검증도 같은 방식 활용 가능.

### 3.3 Notion MCP 회고 시스템

**확인 안 됨** — quest1-notion-assistant는 OAuth 셋업·뼈대만 (`harbor-school/week5/quest1-notion-assistant/README.md`):
- "워크스페이스 정찰 + PRIME/Notes 시스템 *뼈대만* 구축"
- 자동 회고 정리·동기화 코드 없음

community에도 `@notionhq/client` 의존성·코드 없음.

→ 다오니 회고는 새로 설계 필요. quest1의 OAuth 셋업 가이드는 참조 가능.

### 3.4 Pattern Reader 가계부 앱 E2E (Playwright)

**확인 안 됨**:
- `*.spec.ts` / `*.spec.js` / `playwright.config.ts` — 5주차 어디에도 없음
- `@playwright/test` 의존성 — 모든 `package.json`에 없음
- "Pattern Reader" 키워드 grep 결과 0건 (quest3-budget-app의 "패턴"은 평일/주말 가계 패턴 의미, E2E와 무관)

→ 다오니 E2E 검증 필요 시 today-room의 Playwright MCP 검증 패턴을 그대로 활용.

---

## 4. 라이브러리 인벤토리

### 4.1 today-room (`harbor-school/week7/final/today-room/package.json`)

**dependencies** (22):
`@base-ui/react ^1.4.1` · `@hookform/resolvers ^5.2.2` · `@imagekit/nodejs ^7.5.0` · `@radix-ui/react-label ^2.1.8` · `@radix-ui/react-slot ^1.2.4` · `@tosspayments/tosspayments-sdk ^2.7.0` · `bcryptjs ^3.0.3` · `class-variance-authority ^0.7.1` · `clsx ^2.1.1` · `jsonwebtoken ^9.0.3` · `lucide-react ^1.14.0` · `next 14.2.35` · `next-themes ^0.4.6` · `pg ^8.20.0` · `react ^18` · `react-dom ^18` · `react-hook-form ^7.75.0` · `shadcn ^4.7.0` · `sonner ^2.0.7` · `tailwind-merge ^3.6.0` · `tw-animate-css ^1.4.0` · `zod ^4.4.3`

**devDependencies** (12):
`@types/{bcryptjs,jsonwebtoken,node,pg,react,react-dom}` · `eslint ^8` · `eslint-config-next 14.2.35` · `postcss ^8` · `tailwindcss ^3.4.1` · `tailwindcss-animate ^1.0.7` · `typescript ^5`

**shadcn/ui 컴포넌트 11종** (`components/ui/`):
badge · button · card · dialog · dropdown-menu · form · input · label · select · sonner · textarea

**없는 것**: recharts · chart.js · framer-motion · daisyUI · @playwright/test

### 4.2 harbor-community (`harbor-community/package.json:13-20`)

**dependencies** (6, 미니멀):
`@imagekit/nodejs ^7.5.0` · `bcryptjs ^2.4.3` · `dotenv ^16.4.5` · `express ^5.2.1` · `jsonwebtoken ^9.0.2` · `pg ^8.11.5`

**devDependencies**: 없음
**프론트엔드**: React 18 + Babel Standalone CDN, Pretendard Variable 폰트
**없는 것**: shadcn · Tailwind · Playwright · Notion

### 4.3 dongne-golmok

**dependencies**: `@anthropic-ai/sdk` 정도 (api/ai.js에서 import). 정확한 버전은 dongne-golmok/package.json 직접 확인 필요. SPA 자체는 React/Tailwind CDN.

### 4.4 폰트·아이콘·스타일

- **폰트**: Pretendard (community SPA + dongne-golmok), Inter+Pretendard 조합 (week7/quest)
- **아이콘**: `lucide-react` (today-room only)
- **차트**: 세 리포 모두 차트 라이브러리 미사용

---

## 5. 환경변수 인벤토리

### 5.1 키 사용 매트릭스

| 키 | 용도 | today-room | community | dongne-golmok | week5 가계부·연구 | week7 quest/goblin/agent |
|---|---|---|---|---|---|---|
| `DATABASE_URL` | Postgres 연결 | ✅ | ✅ | — | ✅ (quest3·4·56) | — |
| `JWT_SECRET` | 자체 JWT 서명 | ✅ | ✅ | — | ✅ (quest56) | — |
| `ANTHROPIC_API_KEY` | Claude API | — (X — 안 씀) | ✅ (선택) | ✅ (필수) | ✅ (quest3·4) | — |
| `OPENAI_API_KEY` | gpt-image-1 등 | — | — | — | — (week3 일부) | ✅ (quest 3종 + goblin 3종 + agent) |
| `IMAGEKIT_PRIVATE_KEY` | 이미지 업로드 | ✅ | ✅ (선택) | — | — | — |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | Toss 위젯 | ✅ | — (community는 `TOSS_CLIENT_KEY`) | — | — | — |
| `TOSS_SECRET_KEY` | Toss confirm | ✅ | ✅ | — | — | — |
| `FAL_KEY` | Fal.ai 비디오 | — | — | — | — | ✅ (week7/movie-poster) |
| `PORT` | Express 로컬 | — | ✅ (3002) | — | — | ✅ (3000 기본) |

값은 모두 마스킹. 실제 값 위치:
- ANTHROPIC_API_KEY — `harbor-community/.env.local`에 박혀 있음 (메모: env_locations.md)
- OPENAI_API_KEY — week7 quest/goblin 각 폴더 `.env`에 동일 키 사본 (예: `week7/quest/business-card/.env`)
- today-room 5개 키 — `week7/final/today-room/.env.local` (들여쓰기 있는 형태)

### 5.2 .env 파일 위치 전체 (school 기준 28개 + community 1개)

`week3/quest/{my-chatgpt,nickname-generator,study-agent}/.env.example` (OPENAI_API_KEY only)
`week5/quest3-budget-app/.env.local` (DATABASE_URL, ANTHROPIC_API_KEY)
`week5/quest4-budget-analyzer/.env.local` (DATABASE_URL, ANTHROPIC_API_KEY)
`week5/quest56-community/.env.local` (DATABASE_URL, JWT_SECRET)
`week7/final/today-room/.env.local` (5키 — DB·JWT·IMAGEKIT_PRIVATE_KEY·NEXT_PUBLIC_TOSS_CLIENT_KEY·TOSS_SECRET_KEY)
`week7/final/today-room/.env.example` (위 5키 + IMAGEKIT_PUBLIC_KEY·IMAGEKIT_URL_ENDPOINT — 두 키는 코드 미사용)
`week7/final/today-room/.env.vercel.production` (Vercel pull 결과, .gitignore 적용)
`week7/agent/static-visual-maker/.env`, `week7/goblin/{instagram-card,profile-card,thumbnail}-generator/.env`, `week7/quest/{business-card,cafe-menu-typa,cafe-poster-typa-lavender}/.env` (모두 OPENAI_API_KEY + PORT)
`week7/movie-poster/.env` (FAL_KEY)
`harbor-community/.env.local` (DB·JWT·ANTHROPIC·IMAGEKIT_PRIVATE_KEY·TOSS_CLIENT_KEY·TOSS_SECRET_KEY·PORT)

### 5.3 Vercel 환경변수 (today-room)

`vercel env ls` 결과: 5개 키 모두 Production·Development 양쪽 등록. 단 `vercel env pull` 시 sensitive 값은 마스킹돼서 빈 문자열로 보임 (실제 deployment에서는 정상 작동).

---

## 6. DB 인벤토리

### 6.1 today-room (`harbor-school/week7/final/today-room/supabase/schema.sql`)

7 테이블 모두 `tr_` prefix · `create ... if not exists` 패턴 (idempotent):

| 테이블 | 핵심 컬럼 |
|---|---|
| `tr_profiles` | id uuid PK · email unique · password_hash · neighborhood · created_at |
| `tr_auth_sessions` | id uuid PK · user_id FK · token_hash · expires_at · revoked_at |
| `tr_products` | id uuid PK · user_id FK · title · price int · description · category enum(5) · images text[] · created/updated_at |
| `tr_favorites` | (user_id, product_id) composite PK · created_at |
| `tr_chats` | id uuid PK · product_id · buyer_id · seller_id · unique(product_id, buyer_id) |
| `tr_messages` | id uuid PK · chat_id FK · sender_id FK · content · created_at |
| `tr_orders` | id uuid PK · buyer_id FK · product_id FK · amount int · toss_order_id unique · payment_key · payment_method · status enum(pending/paid/canceled/failed) · paid_at |

마이그레이션 적용: `node scripts/apply-schema.mjs` (한 방).

### 6.2 harbor-community (`harbor-community/sql/`, 9 테이블 / 7 SQL)

마이그레이션 파일:
1. `001_create_auth_tables.sql` — `app.auth_users` · `app.auth_sessions`
2. `002_create_community_tables.sql` — `app.community_posts` · `app.community_comments` · `app.community_reactions`
3. `003_create_shop_tables.sql` — `app.shop_products` · `app.shop_cart_items` · `app.shop_orders` · `app.shop_order_items`
4. `004_seed_shop_products.sql` — 시드
5. `005_seed_product_images.sql` — 시드
6. `006_add_payment_columns.sql` — payment_key/method 추가
7. `007_seed_premium_product.sql` — 프리미엄 시드

스키마 적용: `npm run db:apply` → `node scripts/apply.js`.

### 6.3 dongne-golmok

**DB 안 씀**. 정적 JSON (`data/shops.json`) + Claude prompt caching이 전부. 가게 정보·시나리오 모두 mock.

→ 다오니 시뮬레이터도 v0는 정적 JSON 권장 (DB 셋업 비용 절약).

### 6.4 JWT 인증 흐름 (community → today-room 이식 매핑)

| 단계 | community 원본 | today-room 이식형 |
|---|---|---|
| 회원가입 | `api/auth.js:81` (bcrypt 해시 + INSERT auth_users) | `app/api/auth/register/route.ts` (동일 + tr_profiles) |
| 로그인 | `api/auth.js:131` (verify + signJWT + 세션 INSERT) | `app/api/auth/login/route.ts` |
| Bearer 검증 | `lib/auth-helper.js:18-25` (verifyJwt + token_hash 조회) | `lib/auth.ts:verifyTokenWithRevoke()` |
| 로그아웃 | revoked_at 갱신 (멱등) | 동일 패턴 |

비밀번호 규칙 동일: 8~100자 + 영문/숫자/특수 중 2종 이상.

---

## 7. 디자인 시스템 인벤토리

### 7.1 DESIGN.md 단독 파일

**확인 안 됨** — week7 어디에도 통합 DESIGN.md 없음. 디자인 정의는 분산:

### 7.2 7주차 5톤 시스템 (`week7/agent/static-visual-maker/shared/`)

`tones.js` — 5톤 basePrompt + paletteHint:
- TONE_1 Deep Navy & Gold
- TONE_2 Ink Wash (수묵)
- TONE_3 Sepia Diary
- TONE_4 Cool Midnight
- TONE_5 Dawn Mist

`visualTypes.js` — 3 캔버스 타입 (YouTube/Instagram/Profile) additionalPrompt + outputs[] (사이즈·crop)
`imageGenerator.js:5-11` — `openai.images.generate({ model: 'gpt-image-1', size, quality: 'medium', n: 1 })`

### 7.3 7주차 quest 3종 컬러·폰트

| Quest | 컬러 | 폰트 |
|---|---|---|
| Q1 명함 (DAONi) | #F5F1E8 한지 · #1A1A1A 먹 · #B8946B 골드 | Inter + Pretendard |
| Q2 카페 메뉴판 (TYPA) | #0A0A0A · #F8F6F1 · #F4C2D7 베이비핑크 | UnifrakturMaguntia + Pretendard/Inter |
| Q3 라벤더 포스터 (TYPA) | 검정 · 오프화이트 · #D4C5E3 라벤더 | Pretendard Bold |

### 7.4 today-room 디자인 토큰

**Tailwind** (`week7/final/today-room/tailwind.config.ts:17-56`):
- 색: border · input · ring · background · foreground · primary · secondary · destructive · muted · accent · popover · card (각 + foreground)
- Radius: lg=`var(--radius)` (0.5rem) / md=calc(-2px) / sm=calc(-4px)

**CSS 토큰** (`week7/final/today-room/app/globals.css:5-50`):
- Light: bg `0 0% 100%` · fg `0 0% 3.9%` · primary `0 0% 9%`
- Dark: bg `0 0% 3.9%` · fg `0 0% 98%` · primary `0 0% 98%`
- `--radius: 0.5rem`

**아이콘**: `lucide-react` ^1.14.0
**폰트 (글로벌)**: Pretendard

---

## 8. Git · 배포 상태

### 8.1 harbor-school

- 브랜치: `main` (origin/main 추적)
- 최근 커밋 3:
  ```
  00aa8e5 docs: today-room README에서 시연 영상 흐름 섹션 제거
  2f1f700 docs: today-room 검증 마무리 — 시연 갤러리 + 9/9 시나리오 + 발견 이슈 정리
  ec2fffa chore: today-room 시드 스크립트 — gpt-image-1로 카테고리별 상품 5종 생성
  ```
- 라이브 배포: today-room → https://today-room.vercel.app

### 8.2 harbor-community

- 브랜치: `main`
- 최근 커밋 3 (`git log -3 --oneline`):
  ```
  5cf11d6 fix(security): 프리미엄 본문 서버 게이트 + 중복 결제 가드 (quest #4 보안 보강)
  e483973 feat: TossPayments 결제 통합 + quest #4 유료잠금 (실 결제 검증 완료)
  88cf86c refactor: 이미지 업로드 라이브러리 Vercel Blob → ImageKit 교체
  ```
- 라이브 배포: https://harbor-community.vercel.app/ (문카페 라우트 `#/me`)

### 8.3 dongne-golmok

- GitHub: https://github.com/mmake7/dongne-golmok
- 브랜치: `main`
- 최근 커밋 (6주차 진행 시점):
  ```
  ca38e2f AI 안내 문구 stale 라벨 갱신 (Phase 4 라이브 직후, 5/8 검증)
  8ae3e4d Phase 3 AI 컨시어지 통합
  d2c7a29 Phase 2 백엔드 함수
  958b6db Phase 1 UI 골격
  ```
- 라이브 배포: https://dongne-golmok.vercel.app

### 8.4 빌드 스크립트 핵심

| 리포 | scripts |
|---|---|
| today-room | `dev`(next dev) · `build`(next build) · `start`(next start) · `lint`(next lint) |
| community | `dev`(node dev-server.js) · `db:apply`(node scripts/apply.js) |
| dongne-golmok | (정확한 scripts는 dongne-golmok/package.json 직접 확인 필요 — Vercel autodetect 가능) |
| week5 quest3·4 | (각 폴더 package.json — Express 기반, 보통 `dev`/`start`) |
| week7 quest/goblin/agent | 각 폴더 server.js 직접 실행 (express + dotenv) |

---

## 다오니 시뮬레이터 관점 — 정직한 갭 분석

이번 인벤토리를 다오니 시뮬레이터 관점에서 한 줄씩 매핑:

| 다오니 모듈 (가정) | 가장 가까운 기존 자산 | 갭 |
|---|---|---|
| Sense (현재 상태 인지) | community moon.js의 `getMeData + getWeatherData + getNewsData` 병렬 | 다오니 입력 데이터(작물·환경·시장)로 교체 |
| Decide (분석·추천) | quest3 analyze.js 4축 분석 (JSON 응답) + dongne-golmok ephemeral caching | "4축"을 다오니 도메인 축으로 재정의 |
| Persona (응답 스타일) | community moon.js 듀오 페르소나 (카페지기·달지기) | 다오니 캐릭터 system prompt 새로 |
| Research (시장·뉴스·트렌드) | week5/quest2-research-agent의 Playwright MCP + Claude 요약 | 시뮬 단계는 mock, 실 동작은 동일 패턴 |
| 인증·DB·결제 (필요 시) | today-room/lib/* 풀세트 | 다오니가 회원·결제 필요하면 그대로 활용 |
| 디자인 | today-room shadcn 토큰 + lucide-react + Pretendard | 다오니 톤이 5톤 중 하나로 정해지면 톤별 cover image는 gpt-image-1로 |
| E2E 검증 | today-room 9/9 시나리오 Playwright MCP | 자체 spec 작성 X — MCP로 사람이 검증 |

**없는 것 (다오니가 새로 만들어야)**:
- Notion MCP 자동 회고 — quest1은 OAuth 셋업 가이드만
- Pattern Reader Playwright E2E — 5주차에 구현된 적 없음
- 차트 라이브러리 (recharts 등) — 시각화 필요하면 추가 install
- daisyUI — 흔적 없음

---

**이 INVENTORY.md는 Day 0 read-only 조사 산출물.** 다음 의사결정은 형이 다오니 시뮬레이터 미션·구조를 결정한 뒤 별도 문서(MISSION.md / DEV.md)에서.
