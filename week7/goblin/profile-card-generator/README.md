# 프로필 카드 톤 생성기 (G3)

GPT Image (`gpt-image-1`) API로 **5개 톤 × 1200×630 가로 카드 = 5장**의 프로필 카드 배경 비주얼을 생성하는 React 미니앱. OG (오픈그래프) / 블로그 헤더 / LinkedIn 다용도 표준 사이즈.

- **G1·G2와 동일한 5톤** 사용 — 채널·블로그 톤 일관성 유지
- **좌측 비주얼 + 우측 텍스트 오버레이 공간** 구도 (이름·역할 얹기용)
- 텍스트 합성 없음, **순수 비주얼 배경만**
- 톤별 1버튼 → 단일 API 호출
- 그리드 표시 + 톤 이름 + 개별 ⬇ 다운로드 버튼
- 페이지 로드 시 기존 결과 자동 표시

---

## G1·G2와의 차이

| 항목 | G1 (YouTube) | G2 (인스타) | G3 (프로필 카드) |
|---|---|---|---|
| 사이즈 | 1920×1080 + 1080×1920 | 1080×1080 | **1200×630 가로** |
| 톤당 출력 | 2장 | 1장 | 1장 |
| 총 결과물 | 10장 | 5장 | 5장 |
| 모델 호출 사이즈 | 1536×1024 + 1024×1536 | 1024×1024 | 1536×1024 |
| sharp 처리 | crop 80px + resize | resize만 | **crop 109px + 1200×630 다운스케일** |
| SUFFIX | 없음 | square + breathing room | **좌측 가중치 + 우측 텍스트 공간 + 무드 우선** |
| 비용 | ~$0.40 | ~$0.20 | ~$0.30 |
| 용도 | YouTube 썸네일 | 인스타 feed | OG / 블로그 / LinkedIn |

## 프롬프트 추가 SUFFIX (G3 전용)

각 톤 끝에 append (server.js `PROFILE_SUFFIX` 상수):

```
, compositional weight on the left side, 
leaving right side as breathing space for name and role text overlay,
prioritize mood, texture, and color over literal objects;
any objects should appear as faint, abstracted suggestions,
1200x630 horizontal profile card background composition
```

3가지 목적:
1. **좌측 가중치 + 우측 텍스트 공간** — 이름·역할 텍스트 오버레이 자리
2. **무드·텍스처·컬러 우선** — 정체성 카드 성격 (구체 사물 약화)
3. **사이즈·포맷 명시** — 1200×630 가로 카드

---

## 실행

```powershell
cd week7\profile-card-generator
npm install
# .env (.env.example 참고) — G1·G2와 동일 키 재사용
node server.js
# → http://localhost:3000
```

## 구조

```
profile-card-generator/
├── server.js          Express + OpenAI + sharp (1536×1024 → crop → 1200×630)
├── index.html         React CDN + Tailwind
├── client.js          5톤 카드 1열 그리드 (가로 카드 비율)
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
     resp: {tone, size: '1200x630', ms, b64}
```

## 사이즈 처리 (정확한 비율)

```
1200×630 = 1.905:1
1536×1024 = 1.5:1 (3:2)

→ 1536×1024 생성 → 상하 109px crop → 1536×806 (1.905:1) → 1200×630 다운스케일
```

`sharp.extract({left:0, top:109, width:1536, height:806}).resize(1200, 630)`

## 비용·시간 (실측)

| 항목 | 값 |
|---|---|
| 1장 (1536×1024 medium) | ~$0.06 |
| 5장 풀 생성 | ~$0.30 |
| 1장 소요 시간 | 18~19초 |
| 5장 풀 (병렬 배치 2장씩) | ~60초 |

---

## 결과 (5장)

| 톤 | 1200×630 |
|---|---|
| **TONE_1** Deep Navy & Gold | ![](generated/TONE_1_DEEP_NAVY_GOLD_1200x630.png) |
| **TONE_2** Ink Wash (수묵) | ![](generated/TONE_2_INK_WASH_1200x630.png) |
| **TONE_3** Sepia Diary | ![](generated/TONE_3_SEPIA_DIARY_1200x630.png) |
| **TONE_4** Cool Midnight | ![](generated/TONE_4_COOL_MIDNIGHT_1200x630.png) |
| **TONE_5** Dawn Mist | ![](generated/TONE_5_DAWN_MIST_1200x630.png) |

**관찰**:
- TONE_2·4·5: **좌측 가중치 + 우측 텍스트 공간** 구도 명확 ✅
- TONE_1: 추상적이라 좌우 거의 균일 (별 분포에 약간의 편차)
- TONE_3: 압화가 우측에 위치해 텍스트 공간 일부 침범 — 색감·텍스처 일관성은 유지

---

## 결정 사항 (G2와 다른 부분만)

| 결정 | 선택 | 근거 |
|---|---|---|
| 코드 구조 | G3 독립 폴더 (shared 모듈 도입 X) | 형 명시 — 폴더 3개 고정 후 A1에서 한꺼번에 추상화. polluting refactor 회피 |
| 모델 호출 사이즈 | 1536×1024 | 1200×630에 가까운 비율, 다운스케일로 손실 적음 |
| sharp 처리 | crop 109px + resize | 1.5:1 → 1.905:1 변환 (G1과 유사) |
| 무드 우선 적용 | SUFFIX 강조 문구 | 기존 톤·사물 그대로 + 모델 가이드 — 일관성 유지 |
| 포트 | 3000 (G2 끄고) | 동시 가동 불필요 |

## 의도적으로 안 한 것

- shared 모듈 추출 — A1 단계의 본진
- 톤별 사물 묘사 약화 (적극적 치환) — SUFFIX로 충분, 일관성 유지
- 텍스트(이름·역할) 합성 — 원조건 명시 "순수 비주얼 배경만"
- 좌측 가중치 더 강화 — TONE_3 침범은 미세 이슈, 충분한 결과

---

## 다음 흐름

- **A1** (`static-visual-maker`) — G1·G2·G3 세 폴더 통합 자동화. 톤 정의 / 사이즈 변환 / 프롬프트 SUFFIX 패턴이 공통 영역
