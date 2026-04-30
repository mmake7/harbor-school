# Q5 + Q6 — PRIME / Community + Market (공개 회원제 사이트)

> 🛠 **상태**: Phase 1 (Auth 인프라) 완료. Phase 2 (게시판) 진입 대기.
> 📁 **폴더**: `week5/quest5-community/`
> 🔐 **별도 Vercel 프로젝트** (Q3·Q4 = 개인용 / Q5·Q6 = 공개용 분리)

## 컨셉

Q5(게시판)·Q6(쇼핑)을 **한 사이트**로 통합 운영. 같은 공개 회원제 인증 인프라 위에서 두 모듈을 자연스럽게 사용 — Q1·Q2와는 별도, Q3·Q4(개인용 가계부)와도 별도 도메인.

| 모듈 | 역할 |
|---|---|
| Auth (Phase 1) | 회원가입·로그인·토큰·로그아웃 — Q5/Q6 공통 |
| Q5 게시판 (Phase 2) | 글·댓글·좋아요. 회원만 작성 가능 |
| Q6 마켓 (Phase 3) | 상품·장바구니·주문. 회원 전용 결제 흐름 |

## Phase 1 — Auth 인프라 ✅

### DB 스키마 (`sql/001_create_auth_tables.sql`)
- `app.auth_users` — id BIGSERIAL, email UNIQUE, password_hash, display_name, is_active, created_at, updated_at
- `app.auth_sessions` — id, user_id FK, token_hash (SHA-256), expires_at, revoked_at
- 인덱스 6개 (PK 2 + email unique 1 + email idx 1 + user_id 1 + token_hash 1)

### API (`api/auth.js`, 197줄)
| Method | Path | 설명 |
|---|---|---|
| POST | `/api/auth?view=register` | `{email, password, display_name}` → JWT 발급 + sessions row |
| POST | `/api/auth?view=login` | `{email, password}` → JWT 발급 + sessions row |
| GET | `/api/auth?view=me` | `Authorization: Bearer <JWT>` → 사용자 정보 + revoke 체크 |
| POST | `/api/auth?view=logout` | sessions.revoked_at 기록 (멱등) |

### 보안 결정
- **bcrypt 10 rounds** — 비번 저장 (PPT 약속)
- **JWT 7일 만료** + sessions revoke로 즉시 무효화 가능 (`me` 호출 시 sessions 검증)
- **이메일 열거 방어** — login 실패 메시지는 사용자 존재 여부 무관하게 항상 "이메일 또는 비밀번호 오류"
- **비밀번호 정책** — 8자 이상 + 영/숫/특수문자 중 2종 이상

### 검증 (curl 10 시나리오 PASS) ✅
register 정상/중복/약한비번/이메일오류 · login 정상/잘못비번 · me 정상/토큰없음 · logout · me revoked 후 — 10/10 통과.

## 기술 스택

- Vercel serverless (Q3·Q4 패턴 유지) + `?view=` 분기
- PostgreSQL (Supabase pooler, Q3와 동일 DB·다른 스키마 객체)
- pg 직접 연결 (Supabase JS SDK 금지 — 5주차 룰)
- bcrypt 5.1 + jsonwebtoken 9.0
- KST 일관 (`lib/datetime.js`, Q3에서 재사용)

## 폴더 구조

```
quest5-community/
├── package.json (pg + dotenv + bcrypt + jsonwebtoken + express)
├── dev-server.js              로컬 dev wrapper
├── .env.local                 gitignored — DATABASE_URL + JWT_SECRET (+ ANTHROPIC_API_KEY 옵셔널)
├── .env.local.example         형식 가이드
├── api/
│   └── auth.js                Phase 1 (197줄)
├── lib/
│   └── datetime.js            KST 헬퍼
├── sql/
│   └── 001_create_auth_tables.sql
└── scripts/
    └── apply.js               SQL 적용 + 검증
```

## 로컬 실행

```bash
cd week5/quest5-community
npm install
# .env.local 작성 (.env.local.example 참조)
node scripts/apply.js   # 테이블 생성
node dev-server.js      # http://localhost:3002
```

## 다음 단계 — Phase 2: Q5 게시판

| 항목 | 계획 |
|---|---|
| DB | `app.posts`, `app.comments`, `app.post_likes` 스키마 |
| API | `/api/posts?view=...` (list/get/create/update/delete + comment + like) |
| 인증 | `Authorization: Bearer <JWT>` 검증 helper를 `auth.js`에서 export하여 재사용 |
| UI | `public/index.html` — 회원가입·로그인 화면 + 게시판 목록·작성·읽기 |
| 검증 | curl 시나리오 + Playwright E2E |

이후 Phase 3에서 Q6 마켓 추가 (상품·장바구니·주문).
