# Supabase 셋업 가이드

today-room은 Supabase Auth + Postgres + Storage를 사용합니다.

> **테이블 prefix `tr_`**: 모든 DB 객체에 `tr_` prefix를 붙여 기존 Supabase 프로젝트를 재활용할 수 있게 분리. 기존 `profiles`·`products` 등이 있어도 충돌하지 않음.

---

## 옵션 A: 새 프로젝트 만들기

1. https://supabase.com → New Project
2. 프로젝트 이름 (예: `today-room`)
3. DB 비밀번호 설정 (저장 필수)
4. 리전: `Northeast Asia (Seoul)` 권장
5. 1~2분 대기 → 옵션 C(키 복사)로

## 옵션 B: 기존 프로젝트 재활용 (학원 과제 권장)

기존 Supabase 프로젝트가 이미 있고 `auth.users`에 가입된 사용자도 그대로 활용 가능.

**기존 트리거 확인**:
```sql
-- 기존에 다른 프로젝트가 만든 트리거가 있을 수 있음
select tgname, tgrelid::regclass
from pg_trigger
where tgname like '%user%' and not tgisinternal;
```

> `handle_new_user`·`on_auth_user_created` 같은 트리거가 보이면 **건드리지 말 것**. today-room은 별도 함수 `handle_new_tr_user` + 별도 트리거 `on_auth_user_created_tr`를 만들므로 공존 가능.

---

## 옵션 C: 키 복사 → `.env.local`

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

## 옵션 D: 스키마 적용 (DB + RLS)

대시보드 → **SQL Editor → New query** →
[`schema.sql`](./schema.sql) 내용 그대로 붙여넣고 **Run**.

다음이 생성됨:
- 테이블 5개: `tr_profiles` · `tr_products` · `tr_favorites` · `tr_chats` · `tr_messages`
- RLS 정책 12개 (`tr_*` prefix)
- Storage 정책 3개 (read/insert/delete on `tr-product-images`)
- 회원가입 트리거: `handle_new_tr_user()` + `on_auth_user_created_tr`

## 옵션 E: Storage 버킷 생성

대시보드 → **Storage → New bucket**:
- 이름: **`tr-product-images`** (하이픈, `tr_` 아님)
- **Public bucket** ✅ 체크
- File size limit: 5MB (선택)
- Create

> 정책은 `schema.sql` 마지막 섹션에서 SQL Editor 실행 시 자동 적용.

## 옵션 F: Auth 이메일 설정 (선택)

대시보드 → **Authentication → Providers → Email**:
- Confirm email: ON (기본, 권장)
- 로컬 개발만 빠르게 하려면 OFF (프로덕션엔 ON 복귀)

## 옵션 G: 로컬 실행

```powershell
cd week7/final/today-room
npm install        # (셋업 끝났으면 생략)
npm run dev
# → http://localhost:3000
```

## 옵션 H: 회원가입 → 동작 확인

1. http://localhost:3000/auth/signup
2. 이메일·비밀번호 입력
3. (Confirm email ON이면) 메일 확인 후 클릭
4. `tr_profiles` 테이블에 행 자동 생성 (`handle_new_tr_user` 트리거)

---

## 트러블슈팅

| 증상 | 해결 |
|---|---|
| "JWT secret" 에러 | 키 다시 복사. `anon` `public` 키 사용 (service_role 아님) |
| RLS로 SELECT 실패 | `tr_profiles`에 본인 행 있는지 확인. 트리거 적용 여부 |
| Storage 업로드 403 | 폴더명 `{auth.uid()}/...` 형식 + 버킷명 `tr-product-images` |
| `gen_random_uuid()` 미정의 | `pgcrypto` extension 활성 (Supabase 기본 ON) |
| 기존 `handle_new_user` 충돌 | today-room은 `handle_new_tr_user` 별도 함수 — 충돌 X |
| 이미 가입된 사용자에 `tr_profiles` 행 없음 | 수동 INSERT: `insert into tr_profiles (id, email) select id, email from auth.users where id = '<uuid>';` |
