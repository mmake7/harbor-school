# today-room (오늘의집 클론) — F1

7주차 Final 1. **빠른 클리어** 목표의 미니 마켓플레이스. 6주차 harbor-community 패턴(자체 JWT + pg + ImageKit + TossPayments)을 Next.js 14 App Router로 이식.

🌐 **라이브**: https://today-room.vercel.app

> 10시간 이내 완료 지향. shadcn 기본 컴포넌트만, 디자인 커스터마이징 X.

---

## 시연 갤러리

| 메인 카탈로그 (gpt-image-1 시드 5종) | 상품 상세 |
|---|---|
| ![home](./screenshots/01-home-catalog.png) | ![detail](./screenshots/02-product-detail.png) |

| 채팅 (3초 polling 양방향) | 결제 완료 (TossPayments 테스트 키) | 마이페이지 (주문·찜) |
|---|---|---|
| ![chat](./screenshots/03-chat-buyer.png) | ![pay](./screenshots/04-payment-success.png) | ![mypage](./screenshots/05-mypage-buyer.png) |

> 상품 이미지 5종은 `gpt-image-1` (medium 1024×1024)로 카테고리별 1장씩 — Korean minimal interior product photography 톤. 생성·업로드·DB 시드 한 번에: `node scripts/generate-product-images.mjs`.

---

## 스택

- **Next.js 14** App Router · TypeScript · Tailwind · ESLint
- **PostgreSQL** (Supabase DB만 — Auth·RLS·Storage 미사용)
- **자체 JWT 인증** (`jsonwebtoken` + `bcryptjs` + 세션 revoke 추적)
- **ImageKit** 이미지 업로드 (base64 → toFile → upload)
- **TossPayments** REST API (구매 기능)
- **shadcn/ui** (New York · slate, 기본 그대로)

## 단순화 원칙

| 영역 | 단순화 |
|---|---|
| 카테고리 | 5개 고정: 가구·조명·소품·패브릭·식물 |
| 이미지 | 최대 3장 (1장 OK) |
| 검색 | 제목 LIKE |
| 위치 | 동네 텍스트 입력 (GPS X) |
| 채팅 | Polling (Realtime X) |
| 인증 | 자체 JWT + localStorage + Bearer |
| 디자인 | shadcn 기본 |

---

## 진행 단계

| 단계 | 내용 | 상태 |
|---|---|---|
| 1단계 | Next.js + shadcn 셋업 | ✅ |
| 2단계 | JWT 인프라 (lib/db·auth·upload + API auth/upload/payment) | ✅ |
| 3단계 | Auth UI (signup/login + Provider + Header) | ✅ |
| 4단계 | 상품 CRUD + 이미지 업로드 (등록·목록·상세) | ✅ |
| 5단계 | 카테고리·검색 필터 | ✅ |
| 6단계 | 찜 + 채팅 polling + 마이페이지 | ✅ |
| 7단계 | 구매(TossPayments) + 상품 수정·삭제 | ✅ |
| 8단계 | Vercel 배포 | ✅ ([today-room.vercel.app](https://today-room.vercel.app)) |

---

## 폴더 구조

```
today-room/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  홈
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts     POST   회원가입
│   │   │   ├── login/route.ts        POST   로그인
│   │   │   ├── me/route.ts           GET    내 정보
│   │   │   └── logout/route.ts       POST   로그아웃
│   │   ├── upload/route.ts            POST   ImageKit 업로드
│   │   └── payment/
│   │       ├── config/route.ts       GET    Toss client key
│   │       └── confirm/route.ts      POST   Toss 결제 승인 + DB 동기화
│   ├── auth/
│   │   ├── login/page.tsx            로그인
│   │   └── signup/page.tsx           회원가입
│   ├── products/
│   │   ├── page.tsx                  목록·카테고리·검색
│   │   ├── [id]/page.tsx             상세 + 찜·채팅·구매
│   │   ├── [id]/edit/page.tsx        수정
│   │   └── new/page.tsx              등록 (ImageKit 업로드)
│   ├── checkout/[orderId]/page.tsx   TossPayments 위젯
│   ├── payment/{success,fail}/page.tsx  결제 콜백
│   ├── chat/{page,[id]/page}.tsx     채팅 목록·방
│   └── mypage/page.tsx               내 상품·찜·주문
│
├── components/ui/                shadcn 11종
│
├── lib/
│   ├── db.ts                     pg Pool 싱글톤 (HMR 안전)
│   ├── auth.ts                   JWT 발급·검증·bcrypt·readBearer·hashToken
│   ├── upload.ts                 ImageKit base64 업로드
│   └── utils.ts                  shadcn cn()
│
├── types/database.types.ts       Profile · Product · Order · etc.
├── middleware.ts                 보호 라우트 (현재 통과만, 클라이언트 가드 위주)
├── supabase/schema.sql           7 테이블 + 인덱스 (RLS·트리거 X)
├── .env.example
└── README.md                     (이 파일)
```

---

## API

| Method · Path | 인증 | 설명 |
|---|---|---|
| POST `/api/auth/register` | — | 회원가입 (email·password·neighborhood?) |
| POST `/api/auth/login` | — | 로그인 → JWT 발급 |
| GET  `/api/auth/me` | Bearer | 현재 사용자 정보 |
| POST `/api/auth/logout` | Bearer | 세션 revoke (멱등) |
| POST `/api/upload` | Bearer | 이미지 업로드 (base64) → ImageKit URL |
| GET  `/api/products` | — | 목록 (`?category=&q=&mine=1`) |
| POST `/api/products` | Bearer | 상품 등록 |
| GET  `/api/products/[id]` | — | 상세 |
| PATCH·DELETE `/api/products/[id]` | Bearer (소유자) | 수정·삭제 |
| GET·POST·DELETE `/api/favorites` | Bearer | 찜 목록·토글 |
| GET·POST `/api/chats` | Bearer | 채팅방 목록·생성 |
| GET·POST `/api/chats/[id]/messages` | Bearer (참여자) | 메시지 polling·전송 |
| GET·POST `/api/orders` | Bearer | 주문 목록·생성 |
| GET·PATCH `/api/orders/[id]` | Bearer (구매자) | 주문 상세·상태 갱신 |
| GET  `/api/payment/config` | — | TossPayments client key |
| POST `/api/payment/confirm` | Bearer | 결제 승인 + `tr_orders` 동기화 |

**인증 흐름**:
1. 로그인 → JWT + `tr_auth_sessions`에 `token_hash`(SHA-256) 저장
2. 클라이언트 `localStorage`에 JWT 저장
3. 보호 API → `Authorization: Bearer <jwt>` 헤더 → 서버에서 verify + revoke 체크
4. 로그아웃 → `tr_auth_sessions.revoked_at = NOW()` + localStorage 제거

---

## 셋업

### 1. 의존성 설치

```powershell
cd week7/final/today-room
npm install
```

### 2. PostgreSQL 준비 (Supabase 무료 DB 권장)

**옵션 A — 기존 Supabase 프로젝트 재활용 (권장, tr_ prefix로 분리)**:
1. 기존 프로젝트 Settings → Database → Connection String (Pooler) 복사
2. `.env.local`에 `DATABASE_URL=` 박기

**옵션 B — 새 Supabase 프로젝트**: https://supabase.com → New Project → 동일하게 Connection String 복사.

> Supabase Auth·Storage 기능은 사용하지 않음. **DB(Postgres)만 사용**. RLS도 비활성 그대로 (서버에서 JWT로 권한 처리).

### 3. 스키마 적용 ⚠ 필수

**.env.local의 DATABASE_URL이 박힌 다음**, 두 옵션 중 하나로 schema.sql을 DB에 적용한다. **이 단계를 빠뜨리면 회원가입부터 500 (`relation "tr_profiles" does not exist`)**.

**옵션 A — 스크립트 한 방 (권장)**

```powershell
node scripts/apply-schema.mjs
# → connected → schema applied → tr_* tables: tr_auth_sessions, tr_chats, ...
```

내부적으로 `.env.local`의 `DATABASE_URL`을 읽어 `supabase/schema.sql`을 통째 실행. 모두 `create ... if not exists`라 재실행 안전 (idempotent).

**옵션 B — Supabase SQL Editor**

Supabase 대시보드 → SQL Editor → [`supabase/schema.sql`](./supabase/schema.sql) 통째 붙여넣기 → Run.

→ 7 테이블 생성: `tr_profiles`, `tr_auth_sessions`, `tr_products`, `tr_favorites`, `tr_chats`, `tr_messages`, `tr_orders`.

### 4. 환경변수 작성

`.env.local` 생성 ([`.env.example`](./.env.example) 참고). **실제 코드에서 읽는 키는 5개**:

| 변수 | 사용처 | 발급 |
|---|---|---|
| `DATABASE_URL` | `lib/db.ts` (pg Pool) | Supabase Settings → Database → Pooler URL |
| `JWT_SECRET` | `lib/auth.ts` | `openssl rand -hex 64` |
| `IMAGEKIT_PRIVATE_KEY` | `lib/upload.ts` | https://imagekit.io → Developer → API Keys |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | `app/api/payment/config` | https://docs.tosspayments.com → 개발자센터 |
| `TOSS_SECRET_KEY` | `app/api/payment/confirm` | (동일) |

```
DATABASE_URL=postgresql://...
JWT_SECRET=...
IMAGEKIT_PRIVATE_KEY=...
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_gck_...
TOSS_SECRET_KEY=test_gsk_...
```

> `IMAGEKIT_PUBLIC_KEY`·`IMAGEKIT_URL_ENDPOINT`는 `.env.example`에 적혀 있지만 **현재 서버 업로드 경로에서는 사용하지 않음** (PRIVATE_KEY만 쓰임). 클라이언트 직접 업로드로 전환 시에만 필요.

### 5. 로컬 실행

```powershell
npm run dev
# → http://localhost:3000
```

### 6. Vercel 배포

> ⚠ **env 5개 박는 것만으로는 안 됨.** Production DB도 위 3단계로 schema가 적용되어 있어야 함. 안 그러면 첫 회원가입에서 500 (`relation "tr_profiles" does not exist`). `node scripts/apply-schema.mjs`는 `.env.local`의 `DATABASE_URL`을 그대로 읽으므로, Vercel과 같은 DB(Supabase 단일 프로젝트)를 쓰면 한 번만 돌리면 양쪽 다 정리됨.

**현재 배포 상태**

- 🌐 Production: https://today-room.vercel.app
- 프로젝트: `mmake7-3440s-projects/today-room` (GitHub `mmake7/harbor-school` 연동)
- Root Directory: `week7/final/today-room`
- Framework: Next.js 14 (자동 감지)

**최초 셋업 (한 번만)**

```powershell
npm install -g vercel
vercel login
cd week7/final/today-room
vercel link    # 기존 프로젝트에 연결, 또는 vercel로 새로 생성
```

**환경변수 등록 (코드에서 사용하는 5개)**

```powershell
# 각 키를 Production·Development 양쪽에 등록
printf "%s" "<DATABASE_URL>"                | vercel env add DATABASE_URL production
printf "%s" "<JWT_SECRET>"                  | vercel env add JWT_SECRET production
printf "%s" "<IMAGEKIT_PRIVATE_KEY>"        | vercel env add IMAGEKIT_PRIVATE_KEY production
printf "%s" "<NEXT_PUBLIC_TOSS_CLIENT_KEY>" | vercel env add NEXT_PUBLIC_TOSS_CLIENT_KEY production
printf "%s" "<TOSS_SECRET_KEY>"             | vercel env add TOSS_SECRET_KEY production
# 위 5줄을 development 환경에도 동일하게 (production → development)
```

> `printf "%s"`는 `echo`의 trailing newline 문제 회피 (6주차 메모).
> 또는 Vercel Dashboard → Settings → Environment Variables에서 직접 입력.

**배포 명령**

```powershell
vercel --prod
# → https://today-room.vercel.app
```

**Vercel 빌드 시 알려진 정보성 메시지** (에러 아님)

- `/api/auth/me`에서 `Dynamic server usage: ... used request.headers` — Bearer 토큰 라우트라 Next.js가 자동으로 dynamic 처리. 빌드 통과·배포 정상.

### 6. 동작 확인 (cURL)

```bash
# 회원가입
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"abc12345","neighborhood":"마조로"}'

# 로그인 → token 받기
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"abc12345"}'

# me
curl http://localhost:3000/api/auth/me -H "Authorization: Bearer <jwt>"
```

---

## 배포 검증 시나리오 — 9/9 ✅

Playwright MCP로 라이브(https://today-room.vercel.app) 자동 검증. 두 계정(판매자 `validate-20260513@today-room.test` 마조로 / 구매자 `buyer-20260513@today-room.test` 염창동)으로 전 시나리오 통과.

| # | 경로 | 검증 내용 | 결과 |
|---|---|---|---|
| S1 | `/` | 카테고리 5종 + 최근 상품 5개 카드 | ✅ |
| S2 | `/auth/signup` | 가입 → JWT 발급 → 헤더 갱신 | ✅ |
| S3 | `/auth/login` | 로그아웃 ↔ 재로그인 양방향 | ✅ |
| S4 | `/products/new` | 이미지 업로드 + 상품 등록 → 상세 redirect | ✅ |
| S5 | `/products` | 카테고리 필터 + 제목 LIKE 검색 (`원목` ↔ `소파`) | ✅ |
| S6 | `/products/[id]` | 상세 표시 + 찜 토글 (`♡` ↔ `♥ 찜 해제`) | ✅ |
| S7 | `/checkout/[orderId]` → `/payment/success` | Toss 위젯 → 퀵계좌이체 → success 콜백 → `tr_orders.status=paid` | ✅ |
| S8 | `/mypage` | 프로필 + 내 상품 + **주문(결제 완료 배지)** + 찜 4종 | ✅ |
| S9 | `/chat`, `/chat/[id]` | 채팅 시작 → 양방향 송수신 + 3초 polling 자동 수신 + 권한 체크(403) | ✅ |

**테스트 결제 카드**: TossPayments 테스트 키(`test_gck_docs_*`)라 위젯 안에서 휴대폰번호·계좌비번 모두 자동 입력. 실제 청구 X.

### 검증 중 발견·해결한 인프라 이슈 2건

| # | 증상 | 원인 | 해결 |
|---|---|---|---|
| INF-1 | `POST /api/auth/register` 500 (`relation "tr_profiles" does not exist`) | env 5개는 박혔지만 Production DB에 schema.sql 미적용 | `scripts/apply-schema.mjs` 작성 → 7개 테이블 한 방 적용 |
| INF-2 | `POST /api/upload` 500 (`403 Your account cannot be authenticated`) | Vercel `IMAGEKIT_PRIVATE_KEY` 빈 값 (등록 단계 실수 추정) | 로컬 키 valid 확인(`scripts/check-imagekit.mjs`) → `vercel env rm/add` 재등록 → `vercel --prod` |

→ 두 도구는 [`scripts/`](./scripts/)에 박아 둠. 다른 환경 셋업이나 시연 재현 시 그대로 쓸 수 있음.

### 검증 중 발견·해결한 코드 이슈 4건

| # | 위치 | 문제 → 해결 |
|---|---|---|
| FIX-1 | `app/page.tsx` | "최근 상품" `TODO: 5단계에서 구현` placeholder → server component + `force-dynamic`으로 LIMIT 5 카드 그리드 |
| FIX-2 | `README.md` | 배포 가이드에 schema 적용 단계 누락 → ⚠ 박스 + `apply-schema.mjs` 안내 |
| FIX-3 | `app/api/orders/route.ts`, `app/mypage/page.tsx` | `/api/orders` GET 부재 → 마이페이지 주문 섹션 미구현 → GET 추가 + 주문 카드 리스트(상품·금액·`결제 완료` 배지·결제 시각·Toss order ID) |
| FIX-4 | `app/mypage/page.tsx` | 프로필에 `Phase 7 (구매 마감 후) 또는 차후` dev placeholder 노출 → 제거 |

### 시드 카탈로그 (시연용)

`scripts/generate-product-images.mjs` 실행 결과 — `validate-20260513` 판매자가 5종 등록한 상태로 시연 시작.

| 카테고리 | 상품 | 가격 |
|---|---|---|
| 가구 | 원목 6인용 다이닝 테이블 | ₩320,000 |
| 조명 | 린넨 갓 펜던트 조명 | ₩89,000 |
| 소품 | 세라믹 화병 (중) | ₩45,000 |
| 패브릭 | 워시드 린넨 쿠션 커버 | ₩28,000 |
| 식물 | 몬스테라 델리시오사 (대) | ₩65,000 |

총 비용 ≈ $0.20 (gpt-image-1 medium × 5장). 톤: Korean minimal interior product photography (warm beige + natural wood + soft studio lighting). 카테고리당 1장이라 메인 / 카테고리 필터 / 상세 어디서 봐도 단일한 결.

### 시연 영상 1분 권장 흐름

1. (~10s) 메인 — 5종 카탈로그 + 카테고리 칩
2. (~15s) 상세 — 이미지 + 가격 + 채팅·찜·구매 버튼
3. (~10s) 채팅 — 메시지 1회, 답장 polling 도착
4. (~15s) 결제 — Toss 위젯 → 퀵계좌이체 → success 콜백
5. (~10s) 마이페이지 — 결제 완료 배지 + 찜 노출

---

## 6주차 패턴 출처

| 영역 | 참조 파일 |
|---|---|
| JWT 인증 | `D:\Dropbox\workspace\harbor-community\api\auth.js` (232줄) |
| auth helper | `harbor-community/lib/auth-helper.js` (50줄) |
| ImageKit 업로드 | `harbor-community/api/upload.js` (100줄) |
| TossPayments | `harbor-community/api/payment.js` (147줄) |
| 스키마 | `harbor-community/sql/001_*.sql`, `003_*.sql`, `006_*.sql` |

Next.js 14 App Router 조정:
- `module.exports = async (req, res)` → `export async function POST(req: NextRequest)`
- `req.body` → `await req.json()`
- `res.status(x).json(y)` → `NextResponse.json(y, { status: x })`
- `req.headers.authorization` → `req.headers.get('authorization')`
- Pool 싱글톤화 (HMR 누수 방지)
