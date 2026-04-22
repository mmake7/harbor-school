# 🏠 혼삶 (Honsam) — 1인 가구 올인원 AI 플랫폼

> 도시에 혼자 사는 IT/금융 전문직을 위한 AI 기반 라이프 플랫폼
> **harbor.school 4주차 퀘스트 7개 통합 프로젝트**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-web--mauve--tau--65.vercel.app-000000?style=for-the-badge)](https://web-mauve-tau-65.vercel.app)
[![Built with Claude](https://img.shields.io/badge/Built_with-Claude_Code-D97706?style=for-the-badge)](https://claude.com/code)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

---

## 🎯 프로젝트 소개

"퇴근하고 집에 와서 혼자 밥 먹는 시간, 좀 더 의미있게 만들 수 없을까?"

**혼삶**은 도시에서 혼자 사는 30대 IT/금융 전문직을 위한 올인원 플랫폼입니다.
냉장고 관리부터 AI 레시피, 익명 소통, 밸런스 게임, 연봉/지출 비교, 오늘의 운세까지.
1인 가구의 일상을 더 풍요롭게 만들어주는 5가지 섹션으로 구성되어 있습니다.

### 💡 왜 만들었나
harbor.school AI 수업 4주차 퀘스트 6개를 따로따로 만들 수도 있었지만,
"1인 가구 관점에서 하나의 통합 플랫폼으로 묶어보자"는 기획으로 시작했습니다.
그리고 보너스로 AI 운세 기능까지 추가했습니다.

---

## 🌟 5가지 섹션

### 🍳 식생활 (Q1 + Q2 + Q3)
냉장고 재료 관리 + AI 레시피 자동 생성 + Notion 업로드

- **🧊 냉장고**: 재료 CRUD, 유통기한 D-day 표시
- **🍳 만들기**: Claude API로 3가지 레시피 생성 (초간단/든든한/색다른)
- **📚 기록**: 생성된 레시피 영구 저장, 히스토리 조회

### 💬 소셜 (Q4)
익명 고민/칭찬 게시판 "혼삶톡"

- **💬 혼삶톡**: 고민/칭찬/응원/수다 카테고리
- **🏆 베스트**: 반응 TOP 5 게시글
- **✍️ 쓰기**: 익명 닉네임 자동 생성 ("다정한 부엉이 #4321")
- 3종 반응 (💙 공감, 🤗 응원, ✨ 칭찬) + 답글 기능

### 🎮 밸런스 (Q5)
실시간 밸런스 게임 "혼삶 vs"

- **🎮 투표하기**: 5개 카테고리 (돈/음식/주거/일/여가)
- **🏆 인기**: 투표 많은 질문 TOP 5
- **✍️ 질문 만들기**: 실시간 미리보기
- 즉시 퍼센티지 집계 + 투표 번복 가능

### 📊 라이프 (Q6)
익명 연봉/지출 벤치마크

- **📝 내 정보**: 월급 + 8개 지출 카테고리 입력
- **📈 통계**: 전체 평균, 분포, 직군별/연령별 비교
- **🎯 내 등급**: 게임식 뱃지 (💎다이아 / 🥇골드 / 🥈실버 / 🥉브론즈 / ⭐스타터)

지출 카테고리: 🏠주거 / 🍽️식비 / 🚗교통 / 📱통신비 / 📺구독료 / 👔쇼핑 / 🐾반려동물 / 🎮여가

### 🔮 운세 (Q7 보너스)
1인 가구를 위한 AI 점성술사

- **🔮 오늘의 운세**: 하루 1회 Claude AI 생성 (KST 자정 기준 갱신)
- **📅 운세 기록**: 지난 7일 운세 타임라인
- 4개 혼삶 테마 (🍚혼밥 / 🧺자취 / 💰저축 / 💬만남/소통)
- 🍀 행운 아이템 + ✨ 오늘의 조언

---

## 🎨 디자인 철학

### 타겟
도시 거주 30대 IT/금융업 전문직 1인 가구

### 디자인 원칙
- **신뢰감**: 각진 모서리 (4px 이하), 정돈된 그리드
- **세련됨**: 여백 중심, 타이포그래피 강조
- **모던**: 플랫, 미니멀, 절제된 컬러

### 레퍼런스
Linear, Notion, Toss, Arc Browser

### 컬러 시스템
- 배경: `#FAFAFA` (오프 화이트)
- 포인트: `#0A0A0A` (블랙)
- 모노톤 + 단일 포인트 컬러 원칙

### 타이포그래피
- **Pretendard Variable** (한글 최적화)
- 자간 `-0.02em`, 줄간격 `1.5`

---

## 🏗️ 기술 스택

### Frontend
- **React 18** (CDN + Babel Standalone)
- Pretendard Variable Font
- Lucide Icons

### Backend
- **Vercel Serverless Functions** (Node.js ES modules)
- 12개 API 엔드포인트
- RESTful 설계

### Database
- **Supabase PostgreSQL**
- `pg` 라이브러리 직접 연결 (no Supabase SDK)
- 5개 테이블 그룹 (`fridge_*` / `board_*` / `balance_*` / `life_*` / `fortune_*`)

### AI
- **Anthropic Claude API** (`claude-sonnet-4-6`)
- 레시피 생성(Q3) + 운세 생성(Q7)

### 외부 연동
- **Notion API** (레시피 자동 업로드)

---

## 📊 시스템 아키텍처

```
                    [🌐 Browser]
                         ↓
                  [Vercel Edge Network]
                         ↓
                [Serverless Functions × 12]
                   ↓         ↓         ↓
          [Supabase DB] [Claude API] [Notion API]

                   5개 테이블 그룹
                   ├── fridge_*   (재료 관리)
                   ├── board_*    (익명 게시판)
                   ├── balance_*  (밸런스 게임)
                   ├── life_*     (연봉/지출)
                   └── fortune_*  (AI 운세)
```

---

## 🚀 API 엔드포인트 (12개)

| 섹션 | 메서드 | 엔드포인트 | 용도 |
|---|---|---|---|
| 🍳 식생활 | GET / POST / PUT / DELETE | `/api/ingredients` | 재료 CRUD |
| 🍳 식생활 | POST / GET | `/api/recipe` | AI 레시피 생성 + 히스토리 |
| 💬 소셜 | GET / POST | `/api/posts` (`?view=best`) | 게시글 + 베스트 TOP 5 |
| 💬 소셜 | GET / POST | `/api/comments?post_id=N` | 답글 조회/작성 |
| 💬 소셜 | POST | `/api/reactions` | 반응 토글 |
| 🎮 밸런스 | GET / POST | `/api/balance` | 질문 목록 / 등록 |
| 🎮 밸런스 | GET | `/api/balance/ranking` | 인기 TOP 5 |
| 🎮 밸런스 | POST | `/api/vote` | 투표 (upsert) |
| 📊 라이프 | POST | `/api/life` | 내 정보 입력 |
| 📊 라이프 | GET | `/api/life/me` | 내 정보 조회 |
| 📊 라이프 | GET | `/api/life/stats` | 전체 통계 + 내 위치 |
| 🔮 운세 | GET | `/api/fortune` (`?view=history`) | 오늘 운세 + 기록 |

> Vercel Hobby 플랜의 12-serverless-function 한도에 맞춰, `posts?view=best` / `fortune?view=history` 는 쿼리 분기로 통합되어 있습니다.

---

## 📁 프로젝트 구조

```
week4/quest/recipe-skill/
├── ingredients/              # Q1: 재료 JSON (10개)
├── .claude/skills/recipe/    # Q1: Claude Code Skill
│   ├── SKILL.md
│   └── upload_notion.py
├── recipes/                  # Q1: 생성된 레시피 마크다운
├── web/                      # Q2~Q7 웹 통합 앱
│   ├── api/
│   │   ├── ingredients.js
│   │   ├── recipe.js
│   │   ├── posts.js              # best 흡수 (?view=best)
│   │   ├── comments.js
│   │   ├── reactions.js
│   │   ├── balance.js
│   │   ├── balance/ranking.js
│   │   ├── vote.js
│   │   ├── life.js
│   │   ├── life/me.js
│   │   ├── life/stats.js
│   │   └── fortune.js            # history 흡수 (?view=history)
│   ├── db/
│   │   ├── board-schema.sql
│   │   ├── life-schema.sql
│   │   └── fortune-schema.sql
│   ├── public/
│   │   └── index.html            # SPA (React CDN)
│   ├── package.json
│   ├── vercel.json
│   └── README.md
└── README.md                     # 이 문서 (전체 통합 가이드)
```

---

## 🎯 퀘스트별 요구사항 충족

### Q1: 냉장고 재료 기반 레시피 제작 스킬
- ✅ 재료 JSON 파일 관리
- ✅ Claude Code Skill (`/recipe` 명령)
- ✅ 마크다운 파일 저장
- ✅ 창의성 5개: 칼로리 / 시간 / 난이도 / 대체재료 / Notion 업로드

### Q2: 냉장고 재료 & 레시피 관리앱
- ✅ Server + DB (Vercel + Supabase)
- ✅ CRUD 완비
- ✅ 유통기한 D-day 표시

### Q3: AI 레시피 제작앱
- ✅ DB → AI → DB 순환 구조
- ✅ 3종 버전 (초간단 / 든든한 / 색다른)
- ✅ 히스토리 영구 저장

### Q4: 익명 고민/칭찬 게시판
- ✅ 카테고리 4개
- ✅ 3종 반응 + 토글
- ✅ 답글 + 베스트 + 익명 닉네임 자동 생성

### Q5: 실시간 밸런스 게임
- ✅ 질문 등록 + A/B 투표
- ✅ 실시간 퍼센티지 집계
- ✅ 카테고리 + 인기 랭킹

### Q6: 익명 연봉/지출 비교
- ✅ 8개 지출 카테고리 (통신비 / 반려동물 포함)
- ✅ 전체 평균 / 분포 / 상위% 계산
- ✅ 직군별 / 연령별 필터링
- ✅ 게임식 등급 뱃지 (💎🥇🥈🥉⭐)

### Q7 (보너스): AI 운세
- ✅ Claude API 개인화 생성
- ✅ 하루 1회 제한 (UNIQUE 제약 + 경쟁 안전 재조회)
- ✅ 4개 혼삶 테마
- ✅ 지난 7일 기록

---

## 🚀 로컬 실행

### 사전 준비
- Node.js 18+
- Supabase 프로젝트
- Anthropic API Key
- Notion Integration (선택)

### 설치
```bash
git clone https://github.com/mmake7/harbor-school.git
cd harbor-school/week4/quest/recipe-skill/web
npm install
```

### 환경변수
```bash
cp .env.example .env.local
```

`.env.local` 작성:
```
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
NOTION_TOKEN=ntn_...
NOTION_DATABASE_ID=...
```

### DB 스키마 적용
`web/db/` 폴더의 SQL 파일을 Supabase SQL Editor에서 순서대로 실행:

1. `board-schema.sql` (Q4 소셜)
2. `life-schema.sql` (Q6 라이프)
3. `fortune-schema.sql` (Q7 운세)

> `fridge_*`(Q1~Q3), `balance_*`(Q5) 테이블은 초기 버전 작업 시 Supabase Studio에서 직접 생성했습니다. 재현이 필요하면 `web/` 에서 해당 컬럼 구조를 참고하세요.

### 실행
```bash
npx vercel dev
```

브라우저에서 `http://localhost:3000` 접속.

---

## 🌐 배포

- **Live Demo**: https://web-mauve-tau-65.vercel.app
- **배포 Inspect**: [Vercel 대시보드](https://vercel.com/mmake7-3440s-projects/web)

### Vercel 배포 구성
- Framework: Other
- Root Directory: `week4/quest/recipe-skill/web`
- 환경변수 4개 (`DATABASE_URL`, `ANTHROPIC_API_KEY`, `NOTION_TOKEN`, `NOTION_DATABASE_ID`)
- Hobby 플랜 한도: 12 serverless functions

---

## 🧑‍🍳 만든 사람

**박유송** — 공공부문 IT 기획자
harbor.school AI 2기 주말반

## 🤖 Built with Claude Code

전체 코드는 Claude Code와 함께 작성되었습니다.
기획 → 설계 → 구현 → 디버깅 → 배포 전 과정을 AI 에이전트와 협업.

## 📝 라이선스

MIT

## 🙏 감사의 말

harbor.school 커뮤니티와 Anthropic 팀에 감사드립니다.
