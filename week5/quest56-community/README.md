# Harbor Community

5주차 PRIME Q5(게시판) + Q6(쇼핑)을 하나의 회원제 SPA로 통합한 프로젝트.

## 라이브
- 🌐 https://harbor-community.vercel.app/
- 🗂 GitHub: https://github.com/mmake7/harbor-community
- 📅 라이브 검증: 2026-05-01 — 회원가입·게시판(글/댓글/반응)·쇼핑(카트/주문) 모두 정상

## 작업 공간 구조

이 프로젝트는 두 곳의 GitHub 저장소에 동일한 내용으로 존재합니다.

| 저장소 | 용도 |
|---|---|
| `mmake7/harbor-school/week5/quest56-community/` (이 저장소) | 수업 검수용 — 5주차 PRIME Q5+Q6 과제 제출 위치 |
| `mmake7/harbor-community/` | 라이브 배포용 — Vercel 자동 배포 연결 |

### 왜 분리했나?
- Vercel은 "1 저장소 = 1 프로젝트"가 기본. 수업 monorepo에서 특정 폴더만 배포하려면 셋업이 복잡
- 별도 repo로 분리해 라이브 URL 깔끔하게 (harbor-community.vercel.app) 확보
- 평가/검수는 이 저장소 기준, 라이브 사이트는 harbor-community 쪽이 source of truth
- 두 저장소는 코드 변경 시 수동 동기화 push

## 통합 아키텍처 설계 (Q5·Q6)

5주차 기획안(PRIME)의 두 가지 원칙에 따라 Q5(게시판)와 Q6(쇼핑)을 단일 사이트로 통합 운영:

### 원칙 1 — Q8(보스 퀘스트)이 Q5·Q7 등을 흡수
기획안 의존성 다이어그램(슬라이드 6)에 따르면 Q8은 Q1·Q3·Q5·Q7 모두를 데이터 소스로 끌어온다. Auth+DB를 한 사이트에 통합해두면 Q8 단계에서 추가 셋업 없이 데이터 활용 가능.

### 원칙 2 — "새 함수 추가 금지, ?view= 분기로 흡수" (슬라이드 11 Golden Rule)
Vercel Hobby 플랜은 12 serverless function 한도. 미션마다 함수를 새로 추가하면 한도 초과. 한 파일에 여러 동작을 `?view=` 쿼리 파라미터로 묶어 함수 카운트 절약:
- Q5(게시판) + Q6(쇼핑) = 함수 3개 (auth/posts/shop) / 21 endpoint
- 한도 12개 중 9개 여유 확보 → Q7·Q8 추가 시에도 여유 유지

## 미션 충족 매핑

증빙 스크린샷은 [↓ 스크린샷 섹션](#스크린샷) 참조.

| 미션 | 충족 화면 | 증빙 SS |
|---|---|---|
| Q5 게시판: 글 CRUD | `#/board`, `#/board/new`, `#/board/post/{id}` | Q5/s1·s2·s4 |
| Q5: 댓글 | `#/board/post/{id}` 하단 | Q5/s3 |
| Q5: 반응(좋아요/하트/불) | `#/board/post/{id}` 👍❤️🔥 | Q5/s3 |
| Q6 쇼핑: 상품 목록 | `#/shop` | Q6/s1 |
| Q6: 상품 상세 | `#/shop/product/{id}` | Q6/s2 |
| Q6: 장바구니 | `#/shop/cart` | Q6/s3 |
| Q6: 주문 + 스냅샷 | `#/shop/orders`, `#/shop/order/{id}` | Q6/s4 |
| 인증 (공통 인프라) | 회원가입/로그인 모달 | B1/01·02·03 |

## 스크린샷

### Phase 1 — 인증 (B1)

| 게스트 홈 | 회원가입 검증 | 로그인 후 |
|---|---|---|
| ![](screenshots/B1/01-guest-home.png) | ![](screenshots/B1/02-register-validation.png) | ![](screenshots/B1/03-logged-in.png) |

### Q5 — 게시판

| 글 목록 | 글 작성 |
|---|---|
| ![](screenshots/Q5/s1%20%EA%B8%80%EB%AA%A9%EB%A1%9D.png) | ![](screenshots/Q5/s2%20%EA%B8%80%EC%9E%91%EC%84%B1.png) |

| 글 상세 + 댓글 + 반응 | 글 수정/삭제 |
|---|---|
| ![](screenshots/Q5/s3%20%EA%B8%80%EC%83%81%EC%84%B8%EB%8C%93%EA%B8%80%EB%B0%98%EC%9D%91%20.png) | ![](screenshots/Q5/s4%20%EA%B8%80%EC%88%98%EC%A0%95%20%EC%82%AD%EC%A0%9C%20.png) |

### Q6 — 쇼핑

| 상품 목록 | 상품 상세 |
|---|---|
| ![](screenshots/Q6/s1%20%EC%83%81%ED%92%88%EB%AA%A9%EB%A1%9D.png) | ![](screenshots/Q6/s2%20%EC%83%81%ED%92%88%EC%83%81%EC%84%B8.png) |

| 카트 화면 | 주문 상세 |
|---|---|
| ![](screenshots/Q6/s3%20%EC%B9%B4%ED%8A%B8%ED%99%94%EB%A9%B4.png) | ![](screenshots/Q6/s4%20%EC%A3%BC%EB%AC%B8%EC%83%81%EC%84%B8.png) |

## 기술 스택
- 프론트: React 18 (CDN + Babel Standalone), Vanilla, no build
- 백엔드: Vercel Serverless Functions (Node.js, pg 직접 연결)
- DB: Supabase Postgres (스키마: app)
- 인증: JWT 7일 + bcryptjs 10 rounds
- 폰트: Pretendard Variable

## API 설계 — ?view= 분기 패턴
Vercel Hobby 12 함수 한도 대응. 한 파일에 ?view=로 여러 동작 묶음.

| 파일 | view 수 | 인증 |
|---|---|---|
| `/api/auth` | 4 (register/login/me/logout) | register·login 무, me·logout 유 |
| `/api/posts` | 7 (list/get/create/update/delete/comment/react) | list·get 무, 나머지 유 |
| `/api/shop` | 9 (products/product/cart/cart_add/cart_update/cart_clear/order_create/orders/order) | products·product 무, 나머지 유 |

총 함수 3개 / 20 endpoint (Hobby 12 함수 한도 중 3개 사용, 9개 여유)

## 구현 규모
- 백엔드: 1,106줄 (auth 226 + posts 359 + shop 471 + auth-helper 50)
- 화면: 2,015줄 (단일 SPA `public/index.html`)
- DB: 9 테이블 (auth_users, auth_sessions, community_posts, community_comments, community_reactions, shop_products, shop_cart_items, shop_orders, shop_order_items)
- 시드: shop_products 10건

## 디렉토리
```
week5/quest56-community/
├── api/
│   ├── auth.js
│   ├── posts.js
│   └── shop.js
├── lib/
│   ├── auth-helper.js
│   └── datetime.js
├── public/
│   └── index.html
├── sql/
│   ├── 001_create_auth_tables.sql
│   ├── 002_create_community_tables.sql
│   ├── 003_create_shop_tables.sql
│   └── 004_seed_shop_products.sql
├── screenshots/
│   ├── B1/   (3장 — 인증)
│   ├── Q5/   (4장 — 게시판 미션)
│   └── Q6/   (4장 — 쇼핑 미션)
├── scripts/
│   └── apply.js
├── README.md
├── package.json
├── vercel.json
└── dev-server.js
```

## 환경변수 (Vercel)
- `DATABASE_URL`: Supabase Pooler URL
- `JWT_SECRET`: 임의 32자 이상 랜덤 문자열

## 보안 노트 (5주차 수준)
- 토큰: localStorage 저장 (XSS 위험 있음, 운영 환경에선 httpOnly cookie 권장)
- 결제: 미구현 (status='pending' 고정)
- 가격 스냅샷: shop_order_items에 product_name + product_price 저장 (상품 변경 후에도 과거 주문 금액 불변)
- 주문 트랜잭션: FOR UPDATE 락 + 6단계 (카트조회/재고검증/주문생성/항목생성/재고차감/카트비우기)
- 동시성: deadlock 방지 위해 cart 락 ORDER BY product_id ASC

## 로컬 실행
```powershell
cd harbor-community
npm install
# .env.local 작성 (DATABASE_URL + JWT_SECRET)
node scripts/apply.js   # SQL 적용
node dev-server.js      # http://localhost:3002
```

## 배포 (Vercel)
GitHub main 브랜치 push 시 자동 배포. 환경변수는 Vercel 대시보드에서 등록.

## 에이전트 대화 (필수 제출)

Claude / Claude Code와의 작업 대화. Q5+Q6 구현 과정.

| # | 내용 |
|---|---|
| 1 | Q5 게시판 — 글 CRUD / 댓글 / 반응 설계 + DB 스키마 |
| 2 | Q6 쇼핑 — 상품/카트/주문 + 가격 스냅샷 + 트랜잭션 락 |

![Q5 게시판 진행](screenshots/agent/Quest05%20%EC%A7%84%ED%96%89.png)

![Q6 쇼핑 진행](screenshots/agent/Quest06%20%EC%A7%84%ED%96%89.png)
