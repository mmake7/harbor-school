# Static Visual Maker (A1)

G1·G2·G3 세 미니앱의 공통 패턴을 **config로 추상화한 통합 에이전트**.

- **5톤 × 3 비주얼 타입** 한 앱에서 조합 가능
- 비주얼 타입을 config 객체로 분리 → 새 타입·새 톤 추가는 `shared/*.js`에 객체 한 줄 push로 끝
- 1단계 타입 선택 → 2단계 톤별 생성 → 3단계 결과 그리드의 흐름
- 기존 G1·G2·G3 폴더는 그대로 보존 (학습 비교용)

> 새 타입·새 톤 추가 방법은 [`USAGE.md`](./USAGE.md) 참조.

---

## G1·G2·G3와의 관계

| 영역 | G1·G2·G3 | A1 (이 폴더) |
|---|---|---|
| 톤 정의 | 각 폴더 `server.js`에 중복 박힘 | `shared/tones.js` 단일 출처 |
| SUFFIX | 각 폴더 별도 상수 | `shared/visualTypes.js`의 `additionalPrompt` |
| 사이즈 변환 | 각 폴더 별도 `sharp` 분기 | `shared/imageGenerator.js` 통합 (config 기반) |
| 파일명 규칙 | 폴더별 다름 | `TONE_ID__VISUAL_TYPE_ID__OUTPUT_NAME_WxH.png` |
| UI | 1단계 (톤 그리드만) | 2단계 (타입→톤) |
| 확장 비용 | 새 미니앱 = 폴더 1개 풀 복사 | 새 타입 = config 객체 1개 |

→ **G1·G2·G3는 학습 비교용으로 그대로 보존**. A1만 별도 통합 앱.

---

## 실행

```powershell
cd week7\static-visual-maker
npm install
# .env (.env.example 참고) — G1·G2·G3와 동일 키 재사용
node server.js
# → http://localhost:3000
```

## 구조

```
static-visual-maker/
├── server.js                     메인 서버 (shared/ 사용)
├── index.html                    React CDN + Tailwind
├── client.js                     1단계 타입 선택 → 2단계 톤별 카드 → 결과 그리드
├── package.json                  G1·G2·G3와 동일 deps
├── .env / .env.example / .gitignore
├── shared/
│   ├── tones.js                  5톤 config (id, label, summary, basePrompt, paletteHint)
│   ├── visualTypes.js            3타입 config (id, label, additionalPrompt, outputs[])
│   ├── imageGenerator.js         OpenAI 호출 + sharp 변환 통합
│   └── results.js                generated/ 스캔 + 파일명 규칙
└── generated/                    결과물 (TONE__TYPE__OUTPUT_WxH.png)
```

## API

```
GET  /api/tones          → 5톤 메타 [{id, label, summary, paletteHint}]
GET  /api/visual-types   → 3타입 메타 [{id, label, summary, compositionHint, outputs[]}]
GET  /api/results        → generated/ 스캔 → [{toneId, visualTypeId, outputName, finalSize, url}]
POST /api/generate       → 1톤×1타입 생성 (outputs 전부 병렬)
     body: {toneId, visualTypeId}
     resp: {toneId, visualTypeId, ms, outputs: [{name, finalSize, ms, url}]}
```

## 비용 예측 (medium quality, 실측 기반)

| 조합 | 장수 | 추정 비용 | 시간 |
|---|---|---|---|
| 1톤 × Instagram | 1 | ~$0.04 | ~15s |
| 1톤 × 프로필 | 1 | ~$0.06 | ~19s |
| 1톤 × YouTube | 2 | ~$0.12 | ~20s (병렬) |
| **풀 5톤 × 3타입** | **20** | **~$0.90** | ~3분 |

---

## 검증 (5/12)

스모크 테스트: **TONE_1 × instagram-card** 1장
- 응답 정상, 새 파일명 패턴 적용, `/api/results` 자동 파싱 OK
- 결과: ![](generated/TONE_1_DEEP_NAVY_GOLD__instagram-card__square_1080x1080.png)
- 15.3초, 톤 일치 (군청 + 별 + 금빛 수평선)

> 풀 5×3=20장 생성은 비용 통제 위해 형 결정 시점에. 현재는 스모크 1장만 git에 포함.

---

## 결정 사항

| 결정 | 선택 | 근거 |
|---|---|---|
| 코드 구조 | shared/ 폴더 4파일로 추출 | 형 명세 — config 기반 확장성 |
| 커스텀 타입 | 제외, 고정 3타입 | 형 결정 — form UI 시간/복잡도 회피 |
| 파일명 패턴 | `TONE_ID__TYPE_ID__OUTPUT_WxH.png` | 형 결정 — 파싱 명확, 기존과 충돌 X |
| 기존 결과 자동 로드 | A1 자신의 generated/ 만 | 형 결정 — 깔끔한 분리 |
| 어긋난 부분 임의 통일 | 없음 (모든 차이가 의도된 차이) | 형 명세 폭주 금지 준수 |

## 의도적으로 안 한 것

- 톤별 사물 묘사 추상화 — basePrompt는 G1·G2·G3 그대로
- 커스텀 타입 form — 위 결정대로 제외
- 톤·타입 편집 UI — config 직접 수정 패턴
- 일괄 풀 생성 버튼 — 비용 통제 원칙 (톤별 1버튼 유지)
- 히스토리/메타데이터 저장 — 파일로 영속
