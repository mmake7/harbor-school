# Quest 3 — PRIME / Spend (가계부 앱)

## 컨셉

수입·지출을 한 줄 입력 → 카테고리별 자동 추적 + 월별 통계, KST 시간대 일관. 4주차 `life_*` 8개 지출 카테고리를 재활용해 5주차 ↔ 4주차 데이터 호환성 확보.

## 진행한 것

- **DB 스키마 v2** — `app.budget_categories`(type=expense/income), `app.entries`(통합 입력) + 트리거(updated_at)
- **시드 16 카테고리** — 지출 12개(housing/food/transport/telecom/subscription/shopping/pet/leisure/health/education/saving/etc) + 수입 4개(salary/side/allowance/other)
- **Vercel 함수 1개** (`api/budget.js`, 255줄) — `?view=` 분기로 categories / entries(GET·POST·PATCH·DELETE) / stats / budget-vs-actual 모두 흡수 (Vercel 12함수 한도 룰 준수)
- **KST 일관 헬퍼** (`lib/datetime.js`) — 모든 "오늘", "이번 달" 기준은 UTC+9 직접 계산. DB는 UTC, API 응답은 KST 명시
- **흑백 미니멀 SPA** (`public/index.html`, 461줄, vanilla JS) — Pretendard CDN 1개 외 라이브러리 0
- **Playwright E2E 5/5 PASS** — 로딩 / 입력 / 검증 실패 / 삭제 / 영속성

## 결과물 위치

| 항목 | 경로 |
|---|---|
| 스키마·시드 | `sql/schema.sql`, `sql/seed.sql` |
| API | `api/budget.js` |
| KST 헬퍼 | `lib/datetime.js` |
| UI (1파일 SPA) | `public/index.html` |
| DB 적용·검증 | `scripts/apply.js`, `scripts/test-conn.js` |
| 로컬 dev 서버 | `dev-server.js` (Express wrapper) |
| Vercel 배포 설정 | `vercel.json`, `.vercelignore` |
| E2E 스크린샷 | `test-screenshots/e2e-01~05-*.png` (5장) |

## 로컬 실행

```bash
cd week5/quest3-budget-app
npm install
# .env.local 에 DATABASE_URL 작성 (4주차 .env.local 재활용 가능)
node scripts/apply.js   # schema → seed → 검증
node dev-server.js      # http://localhost:3000
```

## API 엔드포인트

| Method | Path | 설명 |
|---|---|---|
| GET | `/api/budget?view=categories` | 카테고리 마스터 (지출 12 + 수입 4) |
| GET | `/api/budget?view=entries[&month=YYYY-MM]` | 월별 입력 조회 (기본: 이번 달 KST) |
| POST | `/api/budget?view=entries` | 입력 추가 `{entry_date, type, category_id, amount, memo}` |
| PATCH | `/api/budget?view=entries&id=...` | 입력 수정 |
| DELETE | `/api/budget?view=entries&id=...` | 입력 삭제 |
| GET | `/api/budget?view=stats` | 이번 달 합계 / 카테고리별 / top 3 |
| GET | `/api/budget?view=budget-vs-actual` | 카테고리 평균(직전 3개월) vs 이번 달 실적 |

## 비서의 핵심 인사이트

> **"가계부의 진실의 원천은 DB이지 화면이 아니다."**
>
> KST/UTC 시간대 처리에서 가장 미묘했던 결정은 *어느 레이어에서 변환할지*. 답: **API 레이어 1군데에서만 KST 변환**, DB는 UTC, UI는 그대로 받아쓴다. 중간에 한 번이라도 변환하면 어디선가 1일이 어긋난다.
>
> localStorage·sessionStorage 0 사용을 강제했더니, 새로고침 후에도 같은 데이터가 보이는 *데이터 영속성*과 POST/DELETE 직후 즉시 반영되는 *데이터 무결성*이 자연스럽게 분리 검증됐다 — Playwright 시나리오 4·5가 정확히 이 분리를 짚어냄.

---

## 스크린샷 (E2E 5단계)

### 1. 초기 로드 — 헤더 합계 / 폼 / 리스트 / 카테고리별 막대
![초기 로드](./test-screenshots/e2e-01-initial-load.png)

### 2. 신규 입력 직후 — 폼 초기화 + 최상단 새 행 + 헤더 +4,500
![입력 후](./test-screenshots/e2e-02-after-create.png)

### 3. 검증 실패 (금액 0) — 인라인 에러 표시
![검증 실패](./test-screenshots/e2e-03-validation-error.png)

### 4. 삭제 후 — baseline 복귀
![삭제 후](./test-screenshots/e2e-04-after-delete.png)

### 5. 새로고침 후 영속성 — 시나리오 4 직후 상태 그대로
![새로고침 후](./test-screenshots/e2e-05-after-reload.png)
