# Quest #4 — [Payment] 유료 콘텐츠 잠금 해제 미니 앱

> ✅ **4 Part 풀 충족 + 보안 패턴 3중 게이트 + 라이브 검증 완료** (2026-05-08 정식 명세 기반 갱신 + 보안 보강)
> 라이브: https://harbor-community.vercel.app/#/premium

---

## 정식 명세 (출처: harbor.school 6주차 quest #4)

| Part | 영역 |
|---|---|
| **Part 1** | 콘텐츠 주제 선택 |
| **Part 2** | 잠금 콘텐츠 (목록 + 잠금 + 결제 + 열람) |
| **Part 3** | 구매 이력 페이지 (재결제 X) |
| **Part 4** | Vercel 배포 |
| **보안** | 서버 권한 체크 + 재결제 방지 + Secret Key 격리 |

---

## 통합 처리 사유 (quest #1과 결제 모듈 공유)

- quest #1·#4 모두 TossPayments 결제
- **결제 모듈 (`api/payment.js`) 한 번 작성 후 두 quest에서 재활용**
- quest #1: `shop_orders` + `shop_order_items` (쇼핑몰 패턴)
- quest #4: 같은 테이블 위에 `?view=order_one` (단건 즉시 주문) + `premium_status` (paid 체크) + `api/content.js` (서버 본문 게이트)
- 같은 코드베이스(`harbor-community`), 다른 도메인
- 부산물: 동네골목 v2 결제 통합 자산 자동 확보

---

## Part별 충족 매핑

### Part 1 — 콘텐츠 주제 ✅

- **선택**: 단일 콘텐츠 1건 — *"해커가 도시를 짓는 법 — 골목·캐시·일관성"* (3 단락 + footer, 동네골목 컨셉과 연결된 짧은 에세이)
- **테이블 결정**: 별도 `contents` 테이블 신설 X. `shop_products` 재사용 — *상품 = 콘텐츠 잠금 해제권*으로 모델링 (가격 1,000원, stock 9,999)
  - 사유: quest #1 결제 모듈을 *DB 스키마 변경 0*으로 재활용. 단일 콘텐츠 1건이라 카탈로그 X
- **시드**: [`sql/007_seed_premium_product.sql`](https://github.com/mmake7/harbor-community/blob/main/sql/007_seed_premium_product.sql) (멱등 INSERT)
- **본문 위치**: `api/content.js`의 `PREMIUM_BODY` 상수 — **서버에만**, 클라이언트 코드에서 완전히 제거됨
- **커밋**: `mmake7/harbor-community@e483973` (시드+컴포넌트) → `5cf11d6` (본문 서버 이동)

### Part 2 — 잠금 콘텐츠 + 결제 + 열람 ✅

- **목록 화면**: 단일 콘텐츠라 별도 목록 X. `/premium` 진입 시 *해당 콘텐츠 잠금/해제 상태*만 표시
- **잠금 화면**: `PremiumPage` 컴포넌트 — blur placeholder("본문은 서버에서 결제 확인 후 전송됩니다") + 결제 버튼
- **결제 모듈**: `api/payment.js` (quest #1과 동일 모듈 공유)
  - `?view=config` 클라이언트 키 전달
  - `?view=confirm` 서버 승인 (Secret Key Basic auth)
- **열람 권한 체크**: `api/content.js` `?view=premium_body` — **서버 측 paid 검증 후** 본문 응답
- **라우트**: `/premium`
- **커밋**: `mmake7/harbor-community@e483973` (UI/결제) → `5cf11d6` (보안 보강)
- **라이브 검증 스크린샷**:
  - 잠금 (보안 patcher): [`live-03-locked-secured.png`](./live-03-locked-secured.png)
  - 결제 위젯: [`../quest1-shopping-completion/live-02-checkout.png`](../quest1-shopping-completion/live-02-checkout.png) (quest #1 공유)
  - 열람: [`live-02-unlocked.png`](./live-02-unlocked.png) (5/8 검증)

### Part 3 — 구매 이력 페이지 ✅

- **라우트**: `#/shop/orders` (통합 주문 내역) — quest #1과 공유. 프리미엄 주문도 동일하게 표시됨
- **권한 제어**: SQL `WHERE o.user_id = $1` (본인만) + 상세는 403 owner check
- **재결제 방지** (3중 게이트):
  1. **UI 차단**: `PremiumPage`가 `status.paid === true`면 결제 버튼 안 띄움 → 본문으로 바로 전환
  2. **서버 가드**: `api/shop.js` `orderOne`에 *프리미엄 상품일 때 paid 주문 존재 검사* → **409 반환**
  3. **클라이언트 핸들링**: `PremiumPage` `onPurchase`가 409 응답 시 자동으로 status 갱신 → 본문 전환
- **재열람**: `paid: true`인 사용자는 언제든 `/premium` 또는 `/shop/orders`에서 본문 다시 열람 (별도 결제 X)
- **커밋**: `mmake7/harbor-community@5cf11d6`

### Part 4 — Vercel 배포 ✅

- **라이브 URL**: https://harbor-community.vercel.app/#/premium
- **GitHub**: https://github.com/mmake7/harbor-community
- **프로덕션 환경변수 6개**: `DATABASE_URL` / `JWT_SECRET` / `ANTHROPIC_API_KEY` / `IMAGEKIT_PRIVATE_KEY` / `TOSS_CLIENT_KEY` / `TOSS_SECRET_KEY` (quest #1 셋업 그대로)
- **라이브 풀 E2E 검증**: 새 사용자 회원가입 → /premium 잠금 → 결제 → 잠금 해제 + 본문 노출 (5/8, 주문 #5)

---

## 보안 패턴 (명세 강조 포인트) — 3중 게이트 ✅

### ① 열람 권한 체크는 **서버 API**에서

- `api/content.js` `?view=premium_body` — 인증 + paid 체크 후 본문 응답
- **본문 자체는 클라이언트 코드 0줄** — `index.html`에 본문 텍스트 잔재 0건 (`grep "도시는 캐시다" → 0`)
- 잠금 화면 placeholder는 *"본문은 서버에서 결제 확인 후 전송됩니다"* 일반 안내 텍스트

#### 라이브 검증 (4 negative test)
| 테스트 | 응답 | 결과 |
|---|---|---|
| 미인증 → `/api/content?view=premium_body` | 401 인증 필요 | ✅ |
| 미결제 신규 유저 → `/api/content?view=premium_body` | 403 결제 미완료 | ✅ |
| 결제 사용자 → `/api/content?view=premium_body` | 200 + 본문 | ✅ |
| `view-source` body 잔재 | 0 occurrences | ✅ |

### ② Toss Secret Key는 **서버에만** 보관

- `process.env.TOSS_SECRET_KEY` — `api/payment.js`에서만 `Authorization: Basic` 인증에 사용
- 클라이언트 키(공개 OK)는 별도 endpoint(`?view=config`)로 분리 전달
- 프론트 코드에 Secret Key 참조 0건

### ③ DB 트랜잭션 안에서 재결제 가드

- `api/shop.js` `orderOne` 함수에서 `BEGIN` ~ `COMMIT` 트랜잭션 안에 **프리미엄 상품 paid 중복 검사**
- 응답: 409 Conflict + `hint: "/premium 페이지에서 본문을 바로 열람하세요"`
- UI 차단(①)이 우회되어도 서버에서 차단 — 직접 `curl POST` 호출 시도 모두 차단
- 라이브 검증: id=7 (이미 paid) → `POST /api/shop?view=order_one` `{product_id:12}` → **409** ✅

> 참고: `(user_id, product_id)` UNIQUE 제약은 신설 안 함 — 다른 일반 상품은 *같은 상품 여러 번 주문 가능*해야 하므로 (당근 같은 패턴). 프리미엄만 *상품명 매칭*으로 가드.

---

## 포인트 획득 기준 매핑

- [x] **기본 완료 (10pt)** — 잠금→결제→열람→재열람 + 라이브 검증 (Part 1·2·3·4 풀 충족)
- [x] **에이전트 활용 (5pt)** — Claude Code 다회 대화 + quest #1 결제 모듈 통합 결정 + 보안 점검·즉시 보강
- [x] **창의성 (5pt)**:
  - quest #1 + quest #4 결제 모듈 통합 1회 작성으로 두 quest 동시 충족
  - 단순 잠금 콘텐츠가 아니라 *동네골목 컨셉과 연결된 에세이*("골목·캐시·일관성")로 기능과 의미 결합
  - DB 스키마 추가 0 (shop_products 재사용)으로 *최소 비용 최대 충족*
- [ ] **공유 보너스 (5pt)** — 단톡방 공유 시 충족

---

## 제출물 체크리스트

- [x] **배포 URL**: https://harbor-community.vercel.app/#/premium
- [x] **GitHub 저장소**: https://github.com/mmake7/harbor-community
- [x] **스크린샷 (5종 분포 — 일부 quest #1과 공유)**:
  - [x] 콘텐츠 잠금 (보안 plaeholder, 5/8 보강): [`live-03-locked-secured.png`](./live-03-locked-secured.png)
  - [x] 결제 위젯 (quest #1 공유): [`../quest1-shopping-completion/live-02-checkout.png`](../quest1-shopping-completion/live-02-checkout.png)
  - [x] 열람 성공 (라이브): [`live-02-unlocked.png`](./live-02-unlocked.png)
  - [x] 구매 이력 (quest #1 공유): [`../quest1-shopping-completion/live-04-orders-mypage.png`](../quest1-shopping-completion/live-04-orders-mypage.png)
  - [x] 결제 완료 주문 상세 (quest #1 공유): [`../quest1-shopping-completion/live-03-order-paid.png`](../quest1-shopping-completion/live-03-order-paid.png)
- [x] **테스트 결제 성공**: 라이브 주문 #5 (`live-test@harbor.dev`, id=7) — confirm API 200
- [x] **AI 대화 스크린샷**: [`../SS/q4.png`](../SS/q4.png) — quest #4 진행 중 Claude Code와 나눈 대화

---

## 검증 스크린샷 갤러리

### 로컬 검증 (5/7)

| 잠금 (옛 — 본문 hardcoded 시기) | 결제 후 잠금 해제 + 본문 |
|---|---|
| ![](./01-premium-locked.png) | ![](./02-premium-unlocked.png) |

### 🌐 라이브 검증 (5/8)

| 라이브 잠금 (보안 placeholder, 5/8 보강 후) | 라이브 잠금 해제 + 본문 (서버 fetch) |
|---|---|
| ![](./live-03-locked-secured.png) | ![](./live-02-unlocked.png) |

> `live-01-locked.png` (옛, 5/8 오전)과 `live-03-locked-secured.png` (5/8 오후 보강) 비교 시: blur preview 텍스트가 *본문 일부*에서 → *서버 게이트 안내*로 교체된 것이 핵심 변화.

---

## quest #1과의 결제 모듈 공유

| 공유 자원 | 위치 | 활용 차이 |
|---|---|---|
| `api/payment.js` (config + confirm) | 동일 | 동일 동작 |
| Toss successUrl | `/shop/payment/success` | quest #4도 같은 콜백 → confirm → DB status=paid → localStorage redirect로 `/premium` 또는 `/shop/order/{id}` 분기 |
| `shop_orders` + `shop_order_items` | 동일 | quest #1: 카트 다건 / quest #4: `order_one` 단건 |
| 권한 패턴 | SQL `WHERE user_id = $1` + 403 owner check | 동일 |

**도메인 차이**: quest #1 = 상품 단위 / quest #4 = 콘텐츠 권한 단위. **본질 동일**: user_id + 자원_id 매칭으로 권한 부여.

---

## 잔여 (사이드 영역)

- 결제 취소·환불 (`POST /v1/payments/{paymentKey}/cancel`)
- 결제 webhook 수신 (Toss → 우리 비동기 알림)
- 월 구독 모델 (`subscriptions` + `expires_at`) — 명세 *도전 항목*
- 콘텐츠 카탈로그 (현재 단일 1건 → 다건 확장 시 별도 `contents` 테이블 신설)
