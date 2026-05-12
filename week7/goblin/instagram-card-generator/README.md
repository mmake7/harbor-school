# 인스타 광고 카드 톤 생성기 (G2)

GPT Image (`gpt-image-1`) API로 **5개 톤 × 1080×1080 정사각 = 5장**의 Instagram feed 광고 카드 비주얼을 생성하는 React 미니앱.

- **G1과 동일한 5톤** 사용 — 채널 톤 일관성 유지
- 가사·텍스트 합성 없음, **순수 비주얼만**
- 톤별 1버튼 → 단일 API 호출
- 그리드 표시 + 톤 이름 + 개별 ⬇ 다운로드 버튼
- 페이지 로드 시 기존 결과 자동 표시

---

## G1과의 차이

| 항목 | G1 (YouTube 썸네일) | G2 (인스타 광고 카드) |
|---|---|---|
| 사이즈 | 가로 1920×1080 + 세로 1080×1920 | 1080×1080 정사각만 |
| 톤당 출력 | 2장 (가로·세로) | 1장 |
| 총 결과물 | 10장 | 5장 |
| 모델 호출 사이즈 | 1536×1024 / 1024×1536 | 1024×1024 |
| sharp 처리 | crop + resize | resize (단순 업스케일) |
| 프롬프트 | 영문 5종 | **동일 5종 + 2문구 append** |
| 비용 | ~$0.40 | ~$0.20 |

## 프롬프트 추가 2문구 (G2 전용)

각 톤 프롬프트 끝에 다음 문구 append (server.js `SQUARE_SUFFIX` 상수):

```
, centered focal point with balanced breathing room on all four sides,
square 1080x1080 Instagram feed composition
```

목적:
1. **정사각형 균형** — 사방 여백
2. **캡션·CTA 얹을 자리** — 중앙 포커스, 사방 breathing room

---

## 실행

```powershell
cd week7\instagram-card-generator
npm install
# .env (.env.example 참고) — G1과 동일 키 재사용 가능
node server.js
# → http://localhost:3000
```

## 구조

```
instagram-card-generator/
├── server.js          Express + OpenAI + sharp (1024×1024 → 1080×1080 resize)
├── index.html         React CDN + Tailwind
├── client.js          5톤 카드 2열 그리드 (정사각형 카드)
├── package.json       deps: express · dotenv · openai · sharp
├── .env.example       키 형식 가이드 (.env는 .gitignore)
└── generated/         생성 결과 5장
```

## API

```
GET  /api/tones     → 5개 톤 메타
GET  /api/results   → generated/ 폴더 스캔 → 기존 결과 URL 목록
POST /api/generate  → 1장 생성
     body: {tone}
     resp: {tone, size: '1080x1080', ms, b64}
```

## 비용·시간 (실측)

| 항목 | 값 |
|---|---|
| 1장 (1024×1024 medium) | ~$0.04 |
| 5장 풀 생성 | ~$0.20 |
| 1장 소요 시간 | 13~20초 |
| 5장 풀 (병렬 배치 2장씩) | ~60초 |

---

## 결과 (5장)

| 톤 | 1080×1080 |
|---|---|
| **TONE_1** Deep Navy & Gold | ![](generated/TONE_1_DEEP_NAVY_GOLD_1080x1080.png) |
| **TONE_2** Ink Wash (수묵) | ![](generated/TONE_2_INK_WASH_1080x1080.png) |
| **TONE_3** Sepia Diary | ![](generated/TONE_3_SEPIA_DIARY_1080x1080.png) |
| **TONE_4** Cool Midnight | ![](generated/TONE_4_COOL_MIDNIGHT_1080x1080.png) |
| **TONE_5** Dawn Mist | ![](generated/TONE_5_DAWN_MIST_1080x1080.png) |

**관찰**: 추가 2문구 효과로 모든 톤이 **중앙 정렬 + 사방 여백** 패턴으로 나옴. 인스타 캡션·CTA 얹을 자리 확보 OK.

---

## 결정 사항 (G1과 다른 부분만)

| 결정 | 선택 | 근거 |
|---|---|---|
| 코드 구조 | G1 통째 복사 후 수정 | 형 명시 — "빨리 가는 게 우선". 추후 A1(static-visual-maker)에서 추상화 |
| 모델 호출 사이즈 | 1024×1024 → resize 1080×1080 | gpt-image-1 정사각 직접 지원 사이즈 중 가장 가까움 |
| crop 처리 | 제거 (둘 다 1:1) | 비율 동일이라 단순 resize로 충분 |
| 톤·프롬프트 | G1과 동일 + 2문구 append | 채널 톤 일관성, G2 명세 요구 |
| 포트 | 3000 (G1 끄고) | 동시 가동 불필요 (형 결정) |

## 의도적으로 안 한 것

- G1 코드와 공통 모듈 추출 — 형 명시 "빨리 가는 게 우선". A1 단계에서 추상화 예정
- 결과물 일괄 생성 버튼 — 비용 제어 원조건
- 가사·텍스트 합성 — 원조건 명시 "순수 비주얼"
- 히스토리 저장 — 파일로 영속

---

## 다음 흐름

- **G3** (내 프로필 카드) — 동일 패턴 재활용 가능성
- **A1** (`static-visual-maker`) — G1·G2·G3 세 폴더 통합 자동화 (G3 마감 후)
