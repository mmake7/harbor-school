# 🏠 혼삶 (Honsam) — AI 레시피 플랫폼

> 도시에 혼자 사는 IT/금융 전문직을 위한 냉장고 관리 + AI 레시피 생성 웹앱

[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat&logo=vercel)](배포URL여기)
[![Built with Claude](https://img.shields.io/badge/Built_with-Claude-D97706?style=flat)](https://claude.com)

## 🎯 프로젝트 소개

"오늘 뭐 해먹지?" — 퇴근하고 냉장고 앞에서 고민하는 1인 가구를 위한 서비스.
냉장고 재료를 관리하고, AI가 3가지 레시피(초간단/든든한/색다른)를 자동 제안합니다.

**harbor.school AI 수업 4주차 퀘스트 1번+2번 통합 프로젝트**
- Q1: [Skill] 냉장고 재료 기반 레시피 제작 스킬
- Q2: [Server+DB] 냉장고 재료 & 레시피 관리앱

## ✨ 주요 기능

### 🧊 냉장고 관리
- 재료 CRUD (추가/수정/삭제)
- 유통기한 임박 알림 (D-day 표시)
- 카테고리별 분류 (냉장/실온/냉동)

### 🍳 AI 레시피 생성
- Claude API 기반 3종 레시피 자동 생성
- 초간단(5-10분) / 든든한(15분) / 색다른(창의적)
- 칼로리, 조리시간, 난이도, 대체재료 자동 산출
- Notion DB 자동 업로드 (외부 공유용)

### 📚 레시피 히스토리
- 생성된 모든 레시피 영구 저장
- 날짜별/버전별 필터링
- 원클릭 상세 조회

## 🎨 디자인 컨셉

**타겟**: 도시 거주 30대 IT/금융업 전문직 1인 가구

**디자인 원칙**:
- **신뢰감**: 각진 모서리(4px 이하), 정돈된 그리드
- **세련됨**: 여백 중심, 타이포그래피 강조
- **모던**: 플랫, 미니멀, 절제된 컬러

**레퍼런스**: Linear, Notion, Toss, Arc Browser

**컬러 시스템**:
- 배경: `#FAFAFA` (오프 화이트)
- 포인트: `#0A0A0A` (블랙)
- 모노톤 + 단일 포인트 컬러 원칙

**타이포그래피**:
- Pretendard Variable (한글 최적화)
- 자간 -0.02em, 줄간격 1.5

## 🏗️ 기술 스택

### Frontend
- React 18 (CDN + Babel Standalone)
- Pretendard Variable Font
- Lucide Icons

### Backend
- Vercel Serverless Functions (Node.js)
- RESTful API 설계

### Database
- Supabase PostgreSQL
- pg 라이브러리 직접 연결 (DATABASE_URL)

### AI
- Anthropic Claude API (claude-sonnet-4-20250514)

### 외부 연동
- Notion API (레시피 자동 업로드)

## 📊 데이터베이스 스키마

### fridge_ingredients
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGSERIAL PK | 기본키 |
| name | TEXT | 재료명 |
| quantity | TEXT | 수량 |
| category | TEXT | 냉장/실온/냉동 |
| expiry | DATE | 유통기한 |
| allergen | BOOLEAN | 알레르기 유발 여부 |
| created_at | TIMESTAMPTZ | 등록일시 |

### fridge_recipes
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGSERIAL PK | 기본키 |
| title | TEXT | 레시피 이름 |
| version | TEXT | 초간단/든든한/색다른 |
| calories | INT | 예상 칼로리 |
| cook_time | INT | 예상 조리시간(분) |
| difficulty | TEXT | 난이도 |
| ingredients | JSONB | 사용 재료 배열 |
| steps | TEXT | 조리 순서 |
| tip | TEXT | 자취생 팁 |
| notion_page_id | TEXT | Notion 페이지 ID |
| created_at | TIMESTAMPTZ | 생성일시 |

## 🔄 시스템 아키텍처

```
[Browser]
    ↓ HTTPS
[Vercel Edge Network]
    ↓
[Serverless Functions]
    ├─→ [Supabase PostgreSQL]  (재료/레시피 저장)
    ├─→ [Claude API]           (AI 레시피 생성)
    └─→ [Notion API]           (자동 업로드)
```

## 🚀 로컬 실행

### 사전 준비
- Node.js 18 이상
- Supabase 프로젝트
- Anthropic API Key
- Notion Integration + DB

### 설치 및 실행

1. 저장소 클론
```bash
git clone https://github.com/mmake7/harbor-school.git
cd harbor-school/week4/quest/recipe-skill/web
```

2. 의존성 설치
```bash
npm install
```

3. 환경변수 설정
```bash
cp .env.example .env.local
```

`.env.local`에 본인의 값 입력:
```
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
NOTION_TOKEN=ntn_...
NOTION_DATABASE_ID=...
```

4. 개발 서버 실행
```bash
npx vercel dev
```

5. 브라우저에서 `http://localhost:3000` 접속

## 🌐 배포

**Live Demo**: [여기에 Vercel URL 추가 예정]

### Vercel 배포 방법

1. Fork 또는 Clone
2. [Vercel](https://vercel.com)에 GitHub 연동
3. 프로젝트 Import
4. Environment Variables 설정 (위 .env.local 내용)
5. Deploy

## 📁 프로젝트 구조

```
web/
├── api/
│   ├── ingredients.js    # 재료 CRUD API
│   └── recipe.js         # AI 레시피 생성 + Notion 업로드
├── public/
│   └── index.html        # SPA 프론트엔드
├── package.json
├── vercel.json
├── .env.example
├── .gitignore
└── README.md
```

## 🎯 퀘스트 요구사항 충족

### Q1: 냉장고 재료 기반 레시피 제작 스킬
- ✅ 재료를 JSON/DB로 관리
- ✅ 레시피 자동 생성
- ✅ 마크다운 파일 저장
- ✅ 창의성: 칼로리/시간/난이도/대체재료/Notion 업로드 (5개)

### Q2: 냉장고 재료 & 레시피 관리앱
- ✅ Server (Vercel Serverless)
- ✅ DB (Supabase PostgreSQL)
- ✅ CRUD (재료 추가/수정/삭제/조회)
- ✅ 웹 UI로 접근 가능

## 🧑‍🍳 만든 사람

박유송 — 공공부문 IT 기획자, harbor.school 2기

## 📝 라이선스

MIT
