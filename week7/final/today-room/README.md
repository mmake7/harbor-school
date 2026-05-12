# today-room (오늘의집 클론) — F1

7주차 Final 1. **빠른 클리어 목표**의 미니 마켓플레이스.

> 8주차 다온이 개인 프로젝트에 시간을 몰아야 하므로 10시간 이내 완료 지향. 디자인 커스터마이징 없이 shadcn 기본만 사용.

---

## 스택

- **Next.js 14** App Router + TypeScript + Tailwind + ESLint
- **Supabase** Auth + Postgres + Storage
- **shadcn/ui** (New York 스타일, slate 컬러 — 기본 그대로)
- Vercel 배포

## 단순화 원칙

| 영역 | 단순화 |
|---|---|
| 카테고리 | 5개 고정: 가구 / 조명 / 소품 / 패브릭 / 식물 |
| 이미지 | 최대 3장 (1장도 OK) |
| 검색 | 제목 LIKE 단순 |
| 위치 | 동네 텍스트 입력만 (GPS X) |
| 채팅 | Polling (Realtime 구독 X) |
| 디자인 | shadcn 기본 (색·폰트 커스터마이징 X) |

## 진행 단계

| 단계 | 내용 | 상태 |
|---|---|---|
| **1단계** | 셋업 + 폴더 골격 + DB 스키마 | ✅ |
| 2단계 | Auth (회원가입/로그인/콜백) | ⏳ |
| 3단계 | 상품 CRUD (목록·상세·등록·이미지 업로드) | ⏳ |
| 4단계 | 찜·검색·카테고리 필터 | ⏳ |
| 5단계 | 채팅 (Polling) | ⏳ |
| 6단계 | Vercel 배포 | ⏳ |

---

## 1단계 결과 (셋업 완료)

- Next.js 14 프로젝트 (`create-next-app`)
- shadcn 컴포넌트 11종 추가: button · input · label · card · badge · dialog · dropdown-menu · form · textarea · select · sonner
- Supabase 클라이언트 3종: `lib/supabase/{client,server,middleware}.ts`
- Auth refresh 미들웨어: `middleware.ts`
- DB 스키마: [`supabase/schema.sql`](./supabase/schema.sql) (5 테이블 + RLS + Storage 정책 + 회원가입 트리거)
- 타입: `types/database.types.ts` (Category 상수 포함)
- 페이지 placeholder: auth · products · chat · mypage

## 폴더 구조

```
today-room/
├── app/
│   ├── layout.tsx              (Next 기본)
│   ├── page.tsx                (Next 기본 — 홈)
│   ├── auth/
│   │   ├── login/page.tsx          ⏳ 2단계
│   │   ├── signup/page.tsx         ⏳ 2단계
│   │   └── callback/route.ts       ✅ Supabase OAuth/email
│   ├── products/
│   │   ├── page.tsx                ⏳ 3단계 (목록·필터)
│   │   ├── [id]/page.tsx           ⏳ 3단계 (상세)
│   │   └── new/page.tsx            ⏳ 3단계 (등록)
│   ├── chat/
│   │   ├── page.tsx                ⏳ 5단계 (목록)
│   │   └── [id]/page.tsx           ⏳ 5단계 (방·polling)
│   └── mypage/page.tsx             ⏳ 4단계 (내 상품·찜)
│
├── components/
│   └── ui/                     shadcn 11종
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           브라우저 클라이언트
│   │   ├── server.ts           서버 컴포넌트용
│   │   └── middleware.ts       Auth refresh helper
│   └── utils.ts                shadcn cn()
│
├── types/database.types.ts     Product · Profile · Chat · etc.
├── middleware.ts               Auth refresh (route matcher)
│
├── supabase/
│   ├── schema.sql              DB + RLS + Storage 통합 SQL
│   └── README.md               Supabase 셋업 가이드
│
├── .env.example                NEXT_PUBLIC_SUPABASE_URL · ANON_KEY
└── README.md                   (이 파일)
```

---

## 실행

### 1. 의존성 설치 (이미 셋업된 상태라면 생략)

```powershell
cd week7/final/today-room
npm install
```

### 2. Supabase 셋업

[`supabase/README.md`](./supabase/README.md) 따라:
1. 새 Supabase 프로젝트 만들기
2. URL · anon key를 `.env.local`에 박기
3. `supabase/schema.sql` SQL Editor에서 실행
4. Storage `product-images` 버킷 생성 (public)

### 3. 로컬 실행

```powershell
npm run dev
# → http://localhost:3000
```

---

## 1단계에서 안 한 것 (단계별 이후 진입)

- ❌ 페이지 본문 UI (placeholder만)
- ❌ 인증 흐름 구현 (signup/login form)
- ❌ 상품 CRUD 로직 (Server Action 또는 Route Handler)
- ❌ 이미지 업로드 (Storage 연동)
- ❌ 채팅 폴링 로직
- ❌ Vercel 배포

각 영역은 단계별로 진입. 형 "OK" 받고 다음 단계.

---

## 다음 (형 액션)

1. [`supabase/README.md`](./supabase/README.md) 따라 **Supabase 새 프로젝트 + .env.local 작성 + schema.sql 실행 + Storage 버킷 생성**
2. 셋업 완료되면 채팅창에 "Supabase 셋업 완료" 한 마디 → **2단계 (Auth) 진입**
