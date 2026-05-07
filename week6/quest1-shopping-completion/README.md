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

- **이미지 업로드**: Vercel Blob (`@vercel/blob`) — 배포 환경이 Vercel이라 가장 가벼움
- **결제**: TossPayments (다음 세션)

## 충족 증적 (작업 진행하며 채움)

- [x] **이미지 업로드 동작** — 커밋 `2d97ecc` (harbor-community) / 파일:
  - `api/upload.js` — POST 인증 + base64 JSON + Vercel Blob `put()`
  - `api/shop.js` `?view=product_create` — 상품 등록 엔드포인트
  - `public/index.html` `ShopNewProduct` — 파일 선택 → base64 → 업로드 → 상품 등록 폼
  - `sql/005_seed_product_images.sql` — 시드 2건 placeholder URL
- [ ] TossPayments 결제 동작 — 커밋 해시: TBD / 파일: TBD

## 검증 스크린샷

### 1. 시드 이미지 2건이 상품 카드에 정상 표시
![shop with images](./shop-with-images.png)

### 2. 로그인 사용자에게 ‘+ 상품 등록’ 폼 렌더 (이미지 파일 입력 포함)
![shop new form](./shop-new-form.png)

> 폼은 파일 선택 → 자동 업로드 → URL 미리보기 → 상품 등록 흐름. 실제 업로드 동작은 `BLOB_READ_WRITE_TOKEN` 환경변수 설정 후 검증 (Vercel 대시보드에서 Blob 스토어 생성).

## 진행 상태

- [x] 통합 구조 셋업 (이 README)
- [x] 이미지 업로드 — Vercel Blob + `api/upload.js` + 상품 등록 UI
- [ ] TossPayments 통합 — 결제 위젯 + webhook + status 동기화 (다음 세션)

## 다음 세션 할 일

1. **Vercel 대시보드에서 Blob 스토어 생성** → `BLOB_READ_WRITE_TOKEN` 발급
2. `.env.local`에 토큰 추가 + `vercel env add BLOB_READ_WRITE_TOKEN production`
3. `/shop/new`에서 실제 이미지 업로드 동작 확인 (현재는 토큰 없이도 폼·시드 표시까지 검증됨)
4. **TossPayments 결제 통합** 시작

## 참고 — 5주차 quest 맥락

5주차 Q6 쇼핑은 라이브 배포 + 카트·주문 트랜잭션까지 완료됐으나 다음이 빠져 있었음:
- 상품 이미지 (`shop_products.image_url` 컬럼만 있고 시드 모두 NULL)
- 실제 결제 (`status`는 `pending`/`paid` enum만 존재, PG 호출 없음)

이 두 빈 슬롯을 6주차 quest #1에서 채운다. quest #4(유료잠금 미니 앱)에서 같은 결제 모듈을 재활용한다.
