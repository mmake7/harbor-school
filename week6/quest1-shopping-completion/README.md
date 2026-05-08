# Quest #1 — 쇼핑몰 미완성 보완 (이미지 업로드 + 결제)

5주차 Q6 쇼핑(`harbor-community`)에 빠져 있던 **이미지 업로드**와 **TossPayments 결제**를 채운다.

## 통합 처리 사유

- quest #1 결제와 quest #4 결제는 모두 TossPayments
- 같은 결제 모듈을 두 번 작성하면 학습 효율 ↓
- 결제 모듈 한 번 통합 작성 후 두 quest에서 재활용
- 부산물: 동네골목 v2 결제 통합 자산 자동 확보

## 통합 코드 위치

- **코드**: `D:\Dropbox\workspace\harbor-community\`
- **GitHub**: https://github.com/mmake7/harbor-community
- **라이브**: https://harbor-community.vercel.app/

5주차 Q5(게시판)+Q6(쇼핑)+Q7(Context)+Q8(AI 대시보드) 통합 SPA의 *Q6 쇼핑 영역*에 추가 작업한다.

## 사용 라이브러리

- **이미지 업로드**: ImageKit (`@imagekit/nodejs`) — 동네골목 v1.5에서 검토 중인 자산과 일치, 무료 20GB
- **결제**: TossPayments (다음 세션)

> 어제(5/7) 처음엔 Vercel Blob으로 셋업했으나 5/8 세션 시작 시 ImageKit으로 교체. 이유: 동네골목 v2 결제·이미지 자산 통합 라인이 ImageKit 쪽으로 이미 굳어져 있어 자산 재활용 효율이 더 큼.

## 충족 증적 (작업 진행하며 채움)

- [x] 이미지 업로드 동작 (코드) — 커밋 `mmake7/harbor-community@2d97ecc` (Vercel Blob 초안) → ImageKit 교체 (당일 후속 커밋, 본 README 갱신 시점)
  - 파일: `api/upload.js`, `api/shop.js` (`?view=product_create`), `public/index.html` (`ShopNewProduct`), `sql/005_seed_product_images.sql`
  - 실제 업로드 검증은 `IMAGEKIT_PRIVATE_KEY` 발급 후 (다음 세션 진입 시 첫 작업)
- [ ] TossPayments 결제 동작 — 커밋 해시: TBD / 파일: TBD

## 검증 스크린샷

### 1. 시드 이미지 2건이 상품 카드에 정상 표시
![shop with images](./shop-with-images.png)

### 2. 로그인 사용자에게 ‘+ 상품 등록’ 폼 렌더 (이미지 파일 입력 포함)
![shop new form](./shop-new-form.png)

> 폼은 파일 선택 → 자동 업로드 → URL 미리보기 → 상품 등록 흐름. 실제 업로드 동작은 `IMAGEKIT_PRIVATE_KEY` 환경변수 설정 후 검증 (https://imagekit.io 가입 → Developer Options → API Keys).

## 진행 상태

- [x] 통합 구조 셋업
- [x] 이미지 업로드 (코드 완료, ImageKit 키 발급 후 실제 업로드 검증 필요)
- [ ] TossPayments 통합 — 다음 세션
- [ ] 유료잠금 페이지 — 다음 세션

## 다음 세션 진입 안내

### 다음 세션 시작 시 첫 작업 (5분)
1. https://imagekit.io 가입 (무료, 결제수단 등록 X)
2. Dashboard → Developer Options → API Keys에서 **Private Key** 복사 (Public Key, URL Endpoint는 우리 셋업에서 미사용)
3. `.env.local`에 `IMAGEKIT_PRIVATE_KEY=...` 추가 + `vercel env add IMAGEKIT_PRIVATE_KEY production`
4. `/shop/new`에서 실제 업로드 동작 1회 확인

### 다음 세션 본 작업
- TossPayments 결제 통합 (quest #1 + quest #4 공유 모듈)
- quest #4 유료잠금 페이지

## 참고 — 5주차 quest 맥락

5주차 Q6 쇼핑은 라이브 배포 + 카트·주문 트랜잭션까지 완료됐으나 다음이 빠져 있었음:
- 상품 이미지 (`shop_products.image_url` 컬럼만 있고 시드 모두 NULL)
- 실제 결제 (`status`는 `pending`/`paid` enum만 존재, PG 호출 없음)

이 두 빈 슬롯을 6주차 quest #1에서 채운다. quest #4(유료잠금 미니 앱)에서 같은 결제 모듈을 재활용한다.
