# PRIME / Spend + Insight (Q3 + Q4 통합)

> 🔗 **Production**: https://harbor-school-mmake7-3440s-projects.vercel.app/
> 📁 **레포**: `week5/quest3-budget-app/`
> 🤖 **통합**: Q3 가계부 앱 + Q4 AI 분석 (한 사이트, 한 도메인)

## 통합 운영 이유

5주차 PPT 기획안의 **단일 Vercel 프로젝트** 약속에 따라 Q3와 Q4를 한 사이트로 통합 운영. 사용자 경험상 **가계부 입력 → 조회 → AI 분석**이 하나의 연속 흐름이고, 환경변수·DB·도메인을 중복으로 관리할 이유도 없음.

→ Q4의 폴더는 별도 유지(`week5/quest4-budget-analyzer/`)되지만 안내 문서만 두고 실제 코드·SS·배포 산출물은 모두 이 폴더 안에 있음.

---

# Q3 — PRIME / Spend (가계부 앱)

## 컨셉

수입·지출을 한 줄 입력 → 카테고리별 자동 추적 + 월별 통계, KST 시간대 일관. 4주차 `life_*` 8개 지출 카테고리를 재활용해 5주차 ↔ 4주차 데이터 호환성 확보.

## 진행한 것

- **DB 스키마 v2** — `app.budget_categories`(type=expense/income), `app.entries`(통합 입력) + 트리거(updated_at)
- **시드 16 카테고리** — 지출 12개(housing/food/transport/telecom/subscription/shopping/pet/leisure/health/education/saving/etc) + 수입 4개(salary/side/allowance/other)
- **Vercel 함수 1개** (`api/budget.js`, 255줄) — `?view=` 분기로 categories / entries(GET·POST·PATCH·DELETE) / stats / budget-vs-actual 모두 흡수 (Vercel 12함수 한도 룰 준수)
- **KST 일관 헬퍼** (`lib/datetime.js`) — 모든 "오늘", "이번 달" 기준은 UTC+9 직접 계산. DB는 UTC, API 응답은 KST 명시
- **흑백 미니멀 SPA** (`public/index.html`) — Pretendard CDN 1개 외 라이브러리 0
- **로컬 + 배포 양쪽에서 Playwright E2E 5/5 PASS** — 로딩 / 입력 / 검증 실패 / 삭제 / 영속성

## API 엔드포인트 (`/api/budget`)

| Method | Path | 설명 |
|---|---|---|
| GET | `?view=categories` | 카테고리 마스터 (지출 12 + 수입 4) |
| GET | `?view=entries[&month=YYYY-MM]` | 월별 입력 조회 (기본: 이번 달 KST) |
| POST | `?view=entries` | 입력 추가 `{entry_date, type, category_id, amount, memo}` |
| PATCH | `?view=entries&id=...` | 입력 수정 |
| DELETE | `?view=entries&id=...` | 입력 삭제 |
| GET | `?view=stats` | 이번 달 합계 / 카테고리별 / top 3 |
| GET | `?view=budget-vs-actual` | 카테고리 평균(직전 3개월) vs 이번 달 실적 |

## 자동 검증 — Playwright E2E

### 로컬 (`localhost:3000`) 5/5 ✅

| # | 시나리오 | 결과 |
|---|---|---|
| 1 | 페이지 로딩 검증 | ✅ PASS |
| 2 | 신규 입력 (식비 4,500 + 메모) | ✅ PASS (헤더·리스트·막대 모두 +4,500) |
| 3 | 검증 실패 (금액 0) | ✅ PASS (인라인 에러, 데이터 변동 0) |
| 4 | 삭제 (confirm dialog) | ✅ PASS (baseline 복귀) |
| 5 | 새로고침 후 영속성 | ✅ PASS (서버 DB가 진실의 원천) |

### 배포본 (`*.vercel.app`) 5/5 ✅

→ 로컬과 동등 동작 확인. 동일 코드·동일 DB(Supabase pooler), 다른 호스트 환경에서 5 시나리오 모두 일관 결과.

## Q3 스크린샷

### 로컬 (E2E 5단계)

#### 1. 초기 로드
![로컬 초기 로드](./test-screenshots/e2e-01-initial-load.png)

#### 2. 신규 입력 직후
![로컬 입력 후](./test-screenshots/e2e-02-after-create.png)

#### 3. 검증 실패
![로컬 검증 실패](./test-screenshots/e2e-03-validation-error.png)

#### 4. 삭제 후
![로컬 삭제 후](./test-screenshots/e2e-04-after-delete.png)

#### 5. 새로고침 후
![로컬 새로고침 후](./test-screenshots/e2e-05-after-reload.png)

### 배포본 (Production)

#### 1. 초기 로드 (Production)
![배포 초기 로드](./test-screenshots/deployed-01-initial-load.png)

#### 2. 신규 입력 직후 (Production)
![배포 입력 후](./test-screenshots/deployed-02-after-create.png)

#### 3. 검증 실패 (Production)
![배포 검증 실패](./test-screenshots/deployed-03-validation-error.png)

#### 4. 삭제 후 (Production)
![배포 삭제 후](./test-screenshots/deployed-04-after-delete.png)

#### 5. 새로고침 후 (Production)
![배포 새로고침 후](./test-screenshots/deployed-05-after-reload.png)

## Q3 비서 인사이트

> **"가계부의 진실의 원천은 DB이지 화면이 아니다."**
>
> KST/UTC 시간대 처리에서 가장 미묘했던 결정은 *어느 레이어에서 변환할지*. 답: **API 레이어 1군데에서만 KST 변환**, DB는 UTC, UI는 그대로 받아쓴다. 중간에 한 번이라도 변환하면 어디선가 1일이 어긋난다.
>
> localStorage·sessionStorage 0 사용을 강제했더니, 새로고침 후에도 같은 데이터가 보이는 *데이터 영속성*과 POST/DELETE 직후 즉시 반영되는 *데이터 무결성*이 자연스럽게 분리 검증됐다 — 시나리오 4·5가 정확히 이 분리를 짚어냄.
>
> 배포 단계에서는 두 가지 비코드 함정이 더 있었다 — Vercel 자동 *Authentication 보호*가 기본 켜져있어 SSO 벽에 막힘 / DATABASE_URL 환경변수 미등록 시 `pg`가 localhost:5432로 fallback해서 ECONNREFUSED. **둘 다 코드 버그 아니라 인프라 설정**.

---

# Q4 — PRIME / Insight (분석 비서)

## 컨셉

같은 화면 안에서 Claude가 가계부를 4축으로 분석 + 자유 질문에 데이터 기반 답변. **할루시 방지** 룰("데이터에 없으면 솔직히")을 시스템 프롬프트에 박아 *모르는 건 모른다고 답하는* 정직한 비서.

## 진행한 것

- **분석 결과 저장 테이블** — `app.budget_analyses` (analysis_type=monthly_report/chat_query, period, query, result_json, grade, tokens_used)
- **현실적 시드 78건** — 한 달치 평일·주말 패턴 (점심 22 + 카페 14 + 출퇴근 18 + 외식 4 + 여가 3 + 쇼핑 4 + 구독 2 + 통신·주거 2 + 간식 5 + 기타)
- **Vercel 함수 추가** (`api/analyze.js`, 409줄) — `?view=monthly` (DB 캐시 + Claude) / `?view=cache-clear` / `?view=chat` (대화형 + 후속 질문)
- **KST 헬퍼 재사용** (`lib/datetime.js`) — 이번 달 / 직전 달 비교용 month minus
- **UI 통합** (`public/index.html`) — Q3 화면 하단에 "🤖 AI 분석" 섹션 신설. 등급 배지 + 4축 카드 + 자유 질문 입력 + 후속 질문 칩
- **모델**: `claude-haiku-4-5-20251001` (cost-efficient, 분석 품질 충분)

## API 엔드포인트 (`/api/analyze`)

| Method | Path | 설명 |
|---|---|---|
| GET | `?view=monthly[&month=YYYY-MM]` | 월간 리포트 (등급 + 4축 분석, DB 캐시 + Claude) |
| POST | `?view=cache-clear[&month=...]` | 월간 리포트 캐시 삭제 (개발용) |
| POST | `?view=chat` body `{question, month?}` | 자유 질문 → 데이터 기반 답변 + 후속 질문 |

## Q4 스크린샷

### 1. 메인 화면 — 가계부 + AI 분석 섹션 통합
![Q4 메인](./screenshots/q4/01-overview.png)

### 2. 월간 리포트 카드 (등급 + 4축 분석)
![Q4 월간 리포트](./screenshots/q4/02-monthly-report.png)

### 3. 다음 달 시도 (advice)
![Q4 advice](./screenshots/q4/03-advice.png)

### 4. 대화형 비서 (질문 + 답변 + 후속 질문)
![Q4 chat](./screenshots/q4/04-chat.png)

## Q4 비서 인사이트

> **"분석은 LLM 고유 능력이 아니라 *컨텍스트 디자인* 결과물이다."**
>
> 같은 Claude Haiku 4.5도 raw 데이터를 던지면 잡담 같은 답을 주지만, 사전 가공 통계(카테고리별/일별/평일주말/지난달비교)를 4축 구조로 던지면 *데이터 인용·솔직성·실용성* 3박자 답변이 나온다. **시스템 프롬프트의 "데이터에 없으면 솔직히" 룰 1줄이 모델 신뢰도를 결정**한다.

---

# 공통

## 실행 방법

### 로컬

```bash
cd week5/quest3-budget-app
npm install
# .env.local 에 DATABASE_URL + ANTHROPIC_API_KEY 작성
node scripts/apply.js   # schema → seed → 검증
node dev-server.js      # http://localhost:3000
```

### Production 배포 (Vercel)

- **방식**: GitHub `mmake7/harbor-school` repo 연동 → Root Directory `week5/quest3-budget-app` → push to main 시 자동 배포
- **환경변수 2개** (Vercel 프로젝트 Settings → Environment Variables):
  - `DATABASE_URL` — Supabase pooler 연결 (4주차에서 그대로)
  - `ANTHROPIC_API_KEY` — Claude API (Q4 분석)
- **함수 정의**: `vercel.json`의 `functions` — `api/budget.js`, `api/analyze.js` 둘 다 `maxDuration: 10`

## 결과물 위치

| 항목 | 경로 |
|---|---|
| Q3 스키마·시드 | `sql/schema.sql`, `sql/seed.sql` |
| Q4 분석 테이블·시드 | `sql/003_create_analyses_table.sql`, `sql/004_seed_month_data.sql` |
| Q3 API | `api/budget.js` |
| Q4 API | `api/analyze.js` |
| KST 헬퍼 | `lib/datetime.js` |
| UI (1파일 SPA, Q3+Q4 통합) | `public/index.html` |
| DB 적용 | `scripts/apply.js`, `scripts/test-conn.js` |
| 로컬 dev 서버 | `dev-server.js` (Express wrapper, 두 API 라우팅) |
| Vercel 배포 설정 | `vercel.json`, `.vercelignore` |
| Q3 자동 검증 SS | `test-screenshots/e2e-01~05-*.png` (로컬) + `deployed-01~05-*.png` (배포본) |
| Q4 제출용 SS | `screenshots/q4/01~04-*.png` |

## 폴더 구조

```
quest3-budget-app/
├── api/
│   ├── budget.js       ← Q3
│   └── analyze.js      ← Q4
├── lib/datetime.js
├── public/index.html   ← Q3 + Q4 한 화면
├── sql/
│   ├── schema.sql, seed.sql                    ← Q3
│   ├── 003_create_analyses_table.sql           ← Q4
│   └── 004_seed_month_data.sql                 ← Q4
├── scripts/{apply,test-conn}.js
├── dev-server.js
├── vercel.json
├── test-screenshots/   ← Q3 자동화 (e2e + deployed)
└── screenshots/q4/     ← Q4 제출용 (4장)
```
