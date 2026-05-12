# Supabase 셋업 가이드

today-room은 Supabase Auth + Postgres + Storage를 사용합니다. 처음 셋업할 때 한 번만 따라가면 됩니다.

---

## 1. 새 프로젝트 만들기

1. https://supabase.com → New Project
2. 프로젝트 이름 (예: `today-room`)
3. DB 비밀번호 설정 (저장 필수)
4. 리전: `Northeast Asia (Seoul)` 권장
5. 1~2분 대기

## 2. 키 복사 → `.env.local`

프로젝트 대시보드 → **Project Settings → API**:

| 값 | env 키 |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

`today-room/.env.local` (없으면 생성):
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

> `.env.local`은 `.gitignore`에 잡혀있어 절대 git에 안 올라감.

## 3. 스키마 적용 (DB + RLS)

대시보드 → **SQL Editor → New query** →
[`schema.sql`](./schema.sql) 내용 그대로 붙여넣고 **Run**.

다음 5개 테이블 + RLS + 회원가입 트리거가 생성됨:
- profiles
- products
- favorites
- chats
- messages

## 4. Storage 버킷 생성

대시보드 → **Storage → New bucket**:
- 이름: `product-images`
- **Public bucket** ✅ 체크 (이미지 공개 읽기)
- File size limit: 5MB (선택)
- Create

> `schema.sql` 마지막 섹션의 Storage 정책은 SQL Editor에서 한 번 더 실행 (`schema.sql` 한 번 실행하면 같이 적용됨).

## 5. Auth 이메일 설정 (선택)

대시보드 → **Authentication → Providers → Email**:
- Confirm email: ON (기본)
- Confirm email 비활성화하면 로컬 개발 빠름 (프로덕션엔 ON 권장)

## 6. 로컬 실행

```powershell
cd week7/final/today-room
npm install        # (셋업 끝났으면 생략 가능)
npm run dev
# → http://localhost:3000
```

## 7. 회원가입 → 동작 확인

1. http://localhost:3000/auth/signup
2. 이메일·비밀번호 입력
3. (Confirm email ON이면) 메일 확인 후 클릭
4. `profiles` 테이블에 행 자동 생성 (회원가입 트리거)

---

## 트러블슈팅

| 증상 | 해결 |
|---|---|
| "JWT secret" 에러 | 키 다시 복사. `anon` `public` 키 사용 (service_role 아님) |
| RLS로 SELECT 실패 | `profiles`에 본인 행 있는지 확인. 트리거 적용 여부 |
| Storage 업로드 403 | 폴더명이 `{auth.uid()}/...` 형식인지 확인 |
| `gen_random_uuid()` 미정의 | `pgcrypto` extension 활성 (Supabase 기본 ON) |
