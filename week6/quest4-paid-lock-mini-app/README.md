# Quest #4 — 유료잠금 미니 앱 (이미지 업로드 + 결제 + 유료잠금)

콘텐츠를 *결제 후에만* 볼 수 있는 유료잠금 미니 앱. quest #1과 결제 모듈을 공유한다.

## 통합 처리 사유

- quest #1 결제와 quest #4 결제는 모두 TossPayments
- 같은 결제 모듈을 두 번 작성하면 학습 효율 ↓
- 결제 모듈 한 번 통합 작성 후 두 quest에서 재활용
- 부산물: 동네골목 v2 결제 통합 자산 자동 확보

## 통합 코드 위치

- **코드**: `D:\Dropbox\workspace\harbor-community\`
- **GitHub**: https://github.com/mmake7/harbor-community
- **라이브**: https://harbor-community.vercel.app/

quest #1과 동일 SPA 안에 *유료잠금 라우트(예: `/locked`)*를 추가한다.

## 사용 라이브러리

- **이미지 업로드**: ImageKit (`@imagekit/nodejs`) — quest #1과 공유
- **결제**: TossPayments — quest #1과 공유 (다음 세션)

> 5/7에 Vercel Blob으로 셋업했으나 5/8에 ImageKit으로 교체. 동네골목 v2 자산 라인과 일치시키기 위함.

## 충족 증적 (작업 진행하며 채움)

- [x] 이미지 업로드 동작 (코드) — quest #1과 공유, 커밋 `mmake7/harbor-community@2d97ecc` (Vercel Blob 초안) → ImageKit 교체
  - 검증 스크린샷은 [`../quest1-shopping-completion/`](../quest1-shopping-completion/) 참조
  - 실제 업로드 검증은 `IMAGEKIT_PRIVATE_KEY` 발급 후 (다음 세션 진입 시 첫 작업)
- [ ] TossPayments 결제 동작 — 커밋 해시: TBD / 파일: TBD
- [ ] 유료잠금 페이지 동작 — 커밋 해시: TBD / 파일: TBD

## 진행 상태

- [x] 통합 구조 셋업
- [x] 이미지 업로드 (코드 완료, ImageKit 키 발급 후 실제 업로드 검증 필요)
- [ ] TossPayments 통합 — 다음 세션
- [ ] 유료잠금 페이지 — 다음 세션

## 다음 세션 진입 안내

### 다음 세션 시작 시 첫 작업 (5분)
1. https://imagekit.io 가입 (무료, 결제수단 등록 X)
2. Dashboard → Developer Options → API Keys에서 **Private Key** 복사
3. `.env.local`에 `IMAGEKIT_PRIVATE_KEY=...` 추가 + `vercel env add IMAGEKIT_PRIVATE_KEY production`
4. `/shop/new`에서 실제 업로드 동작 1회 확인

### 다음 세션 본 작업
- TossPayments 결제 통합 (quest #1 + quest #4 공유 모듈)
- quest #4 유료잠금 페이지

## 컨셉

- 콘텐츠 1개 (이미지 + 본문)을 *유료잠금* 처리
- 비결제 사용자: 잠금 화면 + 결제 버튼만 표시
- 결제 완료 사용자: 콘텐츠 풀 노출
- 결제 상태 검증은 서버 측에서 (`shop_orders.status = 'paid'` 또는 별도 `unlocks` 테이블)

## 다음 세션에서 결정

- 콘텐츠 단위: 단일 콘텐츠 1건 vs 여러 건 카탈로그
- 결제 단위: 1회 구매 vs 구독
- 환불·만료 정책 (간단 데모면 생략 가능)
