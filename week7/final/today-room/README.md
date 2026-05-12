# today-room (오늘의집 클론) — F1

7주차 Final 1. **빠른 클리어** 목표의 미니 마켓플레이스. 6주차 harbor-community 패턴(자체 JWT + pg + ImageKit + TossPayments)을 Next.js 14 App Router로 이식.

> 10시간 이내 완료 지향. shadcn 기본 컴포넌트만, 디자인 커스터마이징 X.

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
| **1단계** | Next.js + shadcn 셋업, 폴더 구조 | ✅ |
| **2단계** | 자체 JWT 인프라 (lib/db·auth·upload + API route 7) | ✅ (Phase 3) |
| 3단계 | Auth UI (signup/login 폼 + me 훅) | ⏳ |
| 4단계 | 상품 CRUD + 이미지 업로드 | ⏳ |
| 5단계 | 찜·검색·카테고리 필터 | ⏳ |
| 6단계 | 채팅 (Polling) | ⏳ |
| 7단계 | 구매 (TossPayments) | ⏳ |
| 8단계 | Vercel 배포 | ⏳ |

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
│   │   ├── login/page.tsx            ⏳ 3단계
│   │   └── signup/page.tsx           ⏳ 3단계
│   ├── products/
│   │   ├── page.tsx                  ⏳ 4단계 (목록·필터)
│   │   ├── [id]/page.tsx             ⏳ 4단계 (상세)
│   │   └── new/page.tsx              ⏳ 4단계 (등록 + 이미지)
│   ├── chat/{page,[id]/page}.tsx     ⏳ 6단계
│   └── mypage/page.tsx               ⏳ 5단계
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
| GET  `/api/payment/config` | — | TossPayments client key |
| POST `/api/payment/confirm` | Bearer | 결제 승인 + tr_orders 동기화 |

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

### 3. 스키마 적용

Supabase SQL Editor → [`supabase/schema.sql`](./supabase/schema.sql) 통째 붙여넣기 → Run.

→ 7 테이블 생성: `tr_profiles`, `tr_auth_sessions`, `tr_products`, `tr_favorites`, `tr_chats`, `tr_messages`, `tr_orders`.

### 4. 환경변수 작성

`.env.local` 생성 ([`.env.example`](./.env.example) 참고):

```
DATABASE_URL=postgresql://...
JWT_SECRET=...                          # openssl rand -hex 64
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_gck_...
TOSS_SECRET_KEY=test_gsk_...
```

각 키 발급:
- **JWT_SECRET**: 터미널 `openssl rand -hex 64`
- **ImageKit**: https://imagekit.io → Developer → API Keys
- **TossPayments**: https://docs.tosspayments.com → 개발자센터 → 테스트 키

### 5. 로컬 실행

```powershell
npm run dev
# → http://localhost:3000
```

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

## 1·2단계 결과 (셋업 완료)

- Next.js 14 + shadcn 11종 + Tailwind
- `lib/db.ts` — pg Pool 싱글톤
- `lib/auth.ts` — JWT 발급·검증·bcrypt·session revoke
- `lib/upload.ts` — ImageKit base64 업로드
- `app/api/*` 7개 route (auth 4 + upload 1 + payment 2)
- `middleware.ts` — 보호 라우트 통과 (실제 가드는 클라이언트 + API)
- `supabase/schema.sql` — 7 테이블 (RLS X, 트리거 X, Storage X — 모두 서버에서 처리)
- `types/database.types.ts` — Profile·Product·Order 등

## 다음 (3단계 Auth UI)

형 "Supabase DB 준비 완료" → 3단계 진입.

3단계 내용:
- `app/auth/signup/page.tsx` — 회원가입 폼 (shadcn Form + zod 검증)
- `app/auth/login/page.tsx` — 로그인 폼
- `lib/auth-client.ts` — 클라이언트 측 토큰 관리 훅 (`useAuth` 등)
- 헤더에 로그인/로그아웃 상태 표시

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
