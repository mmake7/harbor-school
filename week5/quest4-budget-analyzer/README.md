# Quest 4 — PRIME / Insight (가계부 분석 비서)

> ⚠️ **이 폴더의 실제 코드는 [`quest3-budget-app/`](../quest3-budget-app/)에 통합되어 있습니다.**
>
> Step D에서 Q4 분석 기능(monthly 리포트 + chat 대화형)을 Q3 가계부 앱 화면에 통합하기로 결정 — Vercel 한 프로젝트(harbor-school)로 통합 운영하는 게 깔끔하기 때문.

## 컨셉

가계부 데이터를 Claude(claude-haiku-4-5)에게 던져 4축 분석 리포트와 대화형 답변을 받는 비서.

- **monthly 리포트**: 한 달 전체 데이터 → 등급(A~F) + 4축 분석 + 다음 달 액션 2개
- **chat 대화형**: 자유 질문(예: *"이번 달 카페 얼마 썼어?"*) → 데이터 기반 답변 + 후속 질문 제안

## 진행한 것 (Step A → D)

| Step | 내용 | 산출물 위치 (현재) |
|---|---|---|
| **A** | `app.budget_analyses` 테이블 + 한 달치 현실적 시드 (78건) | [`quest3-budget-app/sql/003_create_analyses_table.sql`](../quest3-budget-app/sql/003_create_analyses_table.sql) · [`004_seed_month_data.sql`](../quest3-budget-app/sql/004_seed_month_data.sql) |
| **B** | `?view=monthly` 엔드포인트 + Claude API + DB 캐시 + `?view=cache-clear` | [`quest3-budget-app/api/analyze.js`](../quest3-budget-app/api/analyze.js) |
| **C** | `?view=chat` 엔드포인트 (chat_query 로그 + follow_up_questions) | (위 동일 파일) |
| **D** | Q3 화면(`public/index.html`)에 분석 섹션 통합 + 흑백 미니멀 카드 + 후속 질문 칩 | [`quest3-budget-app/public/index.html`](../quest3-budget-app/public/index.html) |

## 환경 변수

`.env.local` (gitignored)에 추가 필요:
```
DATABASE_URL=postgresql://...    (Q3와 동일 DB 공유)
ANTHROPIC_API_KEY=sk-ant-...     (Claude API)
```

Vercel 배포 시 동일 키 등록 필요.

## API 엔드포인트 (Q3 폴더 안)

| Method | Path | 설명 |
|---|---|---|
| GET | `/api/analyze?view=monthly[&month=YYYY-MM]` | 월간 리포트 (DB 캐시 + Claude) |
| POST | `/api/analyze?view=cache-clear[&month=...]` | 캐시 삭제 (개발용) |
| POST | `/api/analyze?view=chat` body: `{question, month?}` | 대화형 질문 |

## 비서의 핵심 인사이트

> **"분석은 LLM 고유 능력이 아니라 *컨텍스트 디자인* 결과물이다."**
>
> 같은 Claude Haiku 4.5도 raw 데이터를 던지면 잡담 같은 답을 주지만, 사전 가공 통계(카테고리별/일별/평일주말/지난달비교)를 4축 구조로 던지면 *데이터 인용·솔직성·실용성* 3박자 답변이 나온다. **시스템 프롬프트의 "데이터에 없으면 솔직히" 룰 1줄이 모델 신뢰도를 결정**한다.

## 구조 결정 — 왜 Q3에 통합했나

| 옵션 | 장점 | 단점 |
|---|---|---|
| Q4 독립 배포 | 모듈 분리 | Vercel 프로젝트 2개 = 환경변수 중복 / DB 연결 풀 중복 / 사용자 사이트 2곳 |
| **Q3 통합** ✅ | 한 프로젝트 / 한 도메인 / 한 환경변수 / 같은 흑백 미니멀 톤 | 개념적 모듈 경계 약해짐 |

**한 사용자 한 도메인 한 사이트** 원칙으로 Q3 통합 채택.
