# YouTube 썸네일 톤 생성기

GPT Image (`gpt-image-1`) API로 **5개 톤 × (가로 1920×1080 + 세로 1080×1920) = 10장**의 YouTube 썸네일 비주얼을 생성하는 React 미니앱.

- 가사·텍스트 합성 없음, **순수 비주얼만**
- 톤별 1버튼 → 가로·세로 동시 생성 (API 2회 병렬)
- 그리드 표시 + 톤 이름 + 개별 ⬇ 다운로드 버튼

---

## 실행

```powershell
cd week7\thumbnail-generator
npm install
# .env 작성 (.env.example 참고)
node server.js
# → http://localhost:3000
```

## 구조

```
thumbnail-generator/
├── server.js          Express 서버 — OpenAI 호출 + sharp 변환
├── index.html         React CDN + Tailwind 로딩
├── client.js          5개 톤 카드 그리드 (React)
├── package.json       deps: express, dotenv, openai, sharp
├── .env.example       키 형식 가이드 (실제 키는 .env, gitignored)
└── generated/         생성 결과물 10장
```

## 사이즈 처리

`gpt-image-1`은 1920×1080·1080×1920을 직접 지원하지 않음. 서버에서 `sharp`으로 변환:

| 방향 | 모델 호출 | sharp 처리 | 최종 |
|---|---|---|---|
| 가로 | 1536×1024 (3:2) | 상하 80px crop → 1536×864 (16:9) → 업스케일 | **1920×1080** |
| 세로 | 1024×1536 (2:3) | 좌우 80px crop → 864×1536 (9:16) → 업스케일 | **1080×1920** |

## 비용 (실측)

| 항목 | 비용 |
|---|---|
| 1장 (1536×1024 또는 1024×1536, medium) | ~$0.04 |
| 10장 풀 생성 | ~$0.40 |
| 톤당 생성 (가로+세로 2장) | ~$0.08 |

소요 시간: 1장당 16~24초. 톤당 1버튼(병렬) 기준 20~30초/톤.

## API

```
GET  /api/tones                   → 5개 톤 메타 [{key, name, summary}]
POST /api/generate                → 1장 생성
     body: {tone, orientation}
     resp: {tone, orientation, size, ms, b64}
```

프롬프트 5종은 `server.js`의 `TONES` 상수에 박혀있음. 클라이언트는 톤 키만 보내며 프롬프트 본문은 노출되지 않음.

---

## 결과 (10장)

### TONE_1 — Deep Navy & Gold
| 가로 1920×1080 | 세로 1080×1920 |
|---|---|
| ![TONE_1 landscape](generated/TONE_1_DEEP_NAVY_GOLD_1920x1080.png) | ![TONE_1 portrait](generated/TONE_1_DEEP_NAVY_GOLD_1080x1920.png) |

> 깊은 군청 밤하늘 + 얇은 금빛 수평선 + 미니멀 한국적 ambient

### TONE_2 — Ink Wash (수묵)
| 가로 1920×1080 | 세로 1080×1920 |
|---|---|
| ![TONE_2 landscape](generated/TONE_2_INK_WASH_1920x1080.png) | ![TONE_2 portrait](generated/TONE_2_INK_WASH_1080x1920.png) |

> 전통 수묵화 sumi-e, 비 내리는 먼 산, 한지 배경의 정적

### TONE_3 — Sepia Diary
| 가로 1920×1080 | 세로 1080×1920 |
|---|---|
| ![TONE_3 landscape](generated/TONE_3_SEPIA_DIARY_1920x1080.png) | ![TONE_3 portrait](generated/TONE_3_SEPIA_DIARY_1080x1920.png) |

> 세피아 톤 종이, 커피 자국, 압화, 만년필 잉크 흔적의 향수

### TONE_4 — Cool Midnight
| 가로 1920×1080 | 세로 1080×1920 |
|---|---|
| ![TONE_4 landscape](generated/TONE_4_COOL_MIDNIGHT_1920x1080.png) | ![TONE_4 portrait](generated/TONE_4_COOL_MIDNIGHT_1080x1920.png) |

> 단색 미드나잇 블루, 먼 가로등 한 점, 외로운 도심 야경

### TONE_5 — Dawn Mist
| 가로 1920×1080 | 세로 1080×1920 |
|---|---|
| ![TONE_5 landscape](generated/TONE_5_DAWN_MIST_1920x1080.png) | ![TONE_5 portrait](generated/TONE_5_DAWN_MIST_1080x1920.png) |

> 라벤더→그레이블루 새벽 안개, 멀리 자전거 실루엣, 4시의 각성

---

## 결정 사항 (요약)

| 결정 | 선택 | 근거 |
|---|---|---|
| 백엔드 분리 | Express 서버 프록시 | API 키 클라이언트 노출 금지 |
| 사이즈 정확도 | sharp crop+resize | `gpt-image-1` 직접 1920×1080 미지원 |
| 품질 | `medium` | 톤 표현 충분 + 비용 1/4 (high 대비) |
| 버튼 구조 | 톤당 1버튼 (가로·세로 병렬) | 원조건 "톤별 버튼" + 사용성 |
| 프롬프트 | 서버 상수 | 클라이언트 노출 방지, 일관성 |

## 의도적으로 안 한 것

- 재시도/지수백오프 (rate limit 시 단순 에러 표시)
- 톤 추가·편집 UI (요구사항 외)
- mock 모드 (키 없이 동작) — 요구사항 외
- 히스토리 저장 — 폴더에 파일로 영속
- high quality 토글 — 결과 만족, 비용 4배
