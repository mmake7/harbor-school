# 7주차 — 디자인 시스템 + 개인 프로젝트 v1

5·6주차와 달리 항목이 **3-tier 구조**로 들어옴: 워밍업 고블린 → 자동화 에이전트 → 디자인 퀘스트 → Final 개인 프로젝트.

**용어 정의 (혼동 금지)**:
- **고블린** (🟢): 워밍업 단위. 톤 실험·간단 산출물. 클로드AI에서 받는 수업 단위 프롬프트.
- **에이전트** (🟡): 고블린들의 패턴을 자동화하는 도구.
- **퀘스트** (🟡): 디자인 시스템 적용 연습.
- **Final** (🔴/🔵): 이번 주 메인 산출물 + 보너스.

---

## 라이브·실행

5·6주차와 달리 외부 호스팅 없음. **로컬 실행 미니앱 4개** + 결과물 풀세트를 GitHub에 박아둠.

| 앱 | 실행 | 결과물 |
|---|---|---|
| G1 YouTube 썸네일 | `cd thumbnail-generator && node server.js` → `:3000` | [generated/ 10장](./thumbnail-generator/generated/) |
| G2 Instagram 카드 | `cd instagram-card-generator && node server.js` → `:3000` | [generated/ 5장](./instagram-card-generator/generated/) |
| G3 프로필 카드 | `cd profile-card-generator && node server.js` → `:3000` | [generated/ 5장](./profile-card-generator/generated/) |
| A1 Static Visual Maker | `cd static-visual-maker && node server.js` → `:3000` | [generated/ 1장 (스모크)](./static-visual-maker/generated/) |
| Q3 명함 (DAONi 박인수) | `cd business-card && node server.js` → `:3000` | [output/ 앞·뒤 PNG + 합본 PDF](./business-card/output/) |

> 각 앱은 `gpt-image-1` API를 호출하므로 `.env`에 `OPENAI_API_KEY` 필요. `.env.example` 참조.
>
> **A1이 정점**: G1·G2·G3의 패턴을 하나의 통합 앱으로 추상화. 새 톤·새 타입은 `static-visual-maker/shared/`의 config 객체 한 줄 push로 추가됨 ([USAGE.md](./static-visual-maker/USAGE.md)).

- Final(F1) 진입 시 외부 호스팅 URL 추가 예정

---

## 7주차 전체 지도

| 카테고리 | # | 항목 | 난이도 | 상태 | 폴더 | 핵심 커밋 |
|---|---|---|---|---|---|---|
| 🟢 고블린 | **G1** | YouTube 썸네일 1920×1080 (발표용 ✨) | 쉬움 | ✅ 마감 | [`thumbnail-generator/`](./thumbnail-generator/) | `mmake7/harbor-school@5c95d44`, `3663ac5` |
| 🟢 고블린 | **G2** | 인스타 광고 카드 1080×1080 | 쉬움 | ✅ 마감 | [`instagram-card-generator/`](./instagram-card-generator/) | (등록 시 갱신) |
| 🟢 고블린 | **G3** | 내 프로필 카드 (1200×630 OG/블로그/LinkedIn) | 쉬움 | ✅ 마감 | [`profile-card-generator/`](./profile-card-generator/) | (등록 시 갱신) |
| 🟡 에이전트 | **A1** | `static-visual-maker` (G1·G2·G3 통합 + config 추상화) | 중 | ✅ 마감 | [`static-visual-maker/`](./static-visual-maker/) | (등록 시 갱신) |
| 🟡 퀘스트 | **Q1** | 카페 메뉴판 (디자인 시스템 적용 연습) | 중 | ⏳ | — | — |
| 🟡 퀘스트 | **Q2** | 카페 신메뉴 포스터 (디자인 시스템 적용 연습) | 중 | ⏳ | — | — |
| 🟡 퀘스트 | **Q3** | 내 명함 (DAONi 박인수, 90×54mm 인쇄용 PDF + 단톡방 공유용 PNG) | 중 | ✅ 마감 | [`business-card/`](./business-card/) | (등록 시 갱신) |
| 🔴 Final | **F1** | 개인 프로젝트 v1 (이번 주 **메인**, 신규 프로젝트 본체) | 큼 | ⏳ | — | — |
| 🔵 Final 보너스 | **F2** | 오늘의집 클론 (여유 있으면) | 큼 | ⏳ | — | — |

### 자연 흐름 (난이도 순)

```
G1 ✅ → G2 ✅ → G3 ✅ → A1 ✅ → Q3 ✅ → [Q1·Q2·F1·F2 — 재정렬 예정]
        전반전(고블린+에이전트) 마감     명함 마감   형이 클로드AI와 협의 중
```

> ⚠️ **퀘스트 + Final 구간은 재정렬 예정**. 클로드AI와 형이 순서·내용 조정 중 (5/12). 위 표의 Q1~F2는 초안 지도일 뿐 변경 가능.

---

## 전반전 회고 (G1 → A1 마감, 5/12)

**5톤 비주얼 디자인 시스템을 코드로 표현해보는 한 사이클**. G1(YouTube 썸네일·1920×1080)·G2(Instagram 카드·1080×1080)·G3(프로필 카드·1200×630) 세 고블린이 같은 5톤(Deep Navy & Gold / Ink Wash / Sepia Diary / Cool Midnight / Dawn Mist)을 서로 다른 캔버스에 그려보는 동일 톤 다른 비율 실험이었다. 그 다음 A1(`static-visual-maker`)이 셋의 공통 패턴을 `shared/` 4파일(tones / visualTypes / imageGenerator / results)로 추상화 — **새 톤·새 비주얼 타입 추가가 config 객체 한 줄 push로 끝나는 구조**. 실측 비용은 G1 ~$0.40, G2 ~$0.20, G3 ~$0.30 (총 ~$0.90, medium quality). `gpt-image-1`의 사이즈 제약(1024×1024 / 1024×1536 / 1536×1024 3종)은 `sharp`로 crop + resize해 임의 비율 흡수. **G1·G2·G3 폴더는 학습 비교용으로 그대로 보존** — A1이 추상화의 결과물이라면 G1~G3는 그 추상화의 입력이자 학습 비교 기준.

---

## 폴더 구조 (현재)

```
week7/
├── README.md                  (이 파일 — 7주차 전체 지도)
├── poster-desktop-1440.png    (포스터 컨셉 페이지 데스크탑 1440 캡처)
│
├── thumbnail-generator/       ✅ G1 — GPT Image 5톤 YouTube 썸네일 생성기
│   ├── server.js                Express + OpenAI + sharp (1920×1080 / 1080×1920 변환)
│   ├── index.html / client.js   React CDN + Tailwind, 5톤 카드 그리드 + 자동 로드
│   ├── package.json             express · dotenv · openai · sharp
│   ├── .env.example             키 형식 가이드 (.env는 .gitignore)
│   ├── README.md                실행법 · 비용 · 결과 그리드
│   └── generated/               생성 결과 10장 (가로 5 + 세로 5)
│
├── instagram-card-generator/  ✅ G2 — GPT Image 5톤 인스타 광고 카드 (1080×1080)
│   ├── server.js                Express + OpenAI + sharp (1024×1024 → 1080×1080 resize)
│   ├── index.html / client.js   React CDN + Tailwind, 5톤 2열 그리드 + 자동 로드
│   ├── package.json             G1과 동일 deps
│   ├── .env.example             키 형식 가이드 (.env는 .gitignore, G1 키 재사용)
│   ├── README.md                G1과의 차이 비교표 + 결과 그리드 5장
│   └── generated/               생성 결과 5장 (정사각형 1종)
│
├── profile-card-generator/    ✅ G3 — GPT Image 5톤 프로필 카드 (1200×630 가로)
│   ├── server.js                Express + OpenAI + sharp (1536×1024 → crop → 1200×630)
│   ├── index.html / client.js   React CDN + Tailwind, 5톤 가로 카드 그리드 + 자동 로드
│   ├── package.json             G1과 동일 deps
│   ├── .env.example             키 형식 가이드 (.env는 .gitignore, G1 키 재사용)
│   ├── README.md                G1·G2 비교표 + 결과 그리드 5장 + 좌측 가중치 분석
│   └── generated/               생성 결과 5장 (1200×630 가로 1종)
│
├── static-visual-maker/       ✅ A1 — G1·G2·G3 통합 에이전트 (config 기반 확장)
│   ├── server.js                메인 서버 (shared/ 사용, 라우트 5개)
│   ├── index.html / client.js   1단계 타입 선택 → 2단계 톤별 카드 → 결과 그리드
│   ├── package.json             G1과 동일 deps
│   ├── .env.example             키 형식 가이드 (.env는 .gitignore, 동일 키)
│   ├── shared/                  공통 코드 — tones · visualTypes · imageGenerator · results
│   ├── README.md                A1 개요 + G1·G2·G3 관계
│   ├── USAGE.md                 새 톤·새 타입 추가 방법 (확장성 문서)
│   └── generated/               결과물 (TONE__TYPE__OUTPUT_WxH.png 패턴)
│
├── movie-poster/              (영화 포스터 디자인 — 기리고 / If Wishes Could Kill)
│   ├── INFO.md / research/ / prompts/ / scripts/ / stills/ / assets/
│   └── index.html               포스터 컨셉 3선 비교 페이지
│
├── MD/                        (동네골목 기획 문서 5종 — 6주차 quest#3 자료와 동일 세트)
│   └── README.md  MISSION.md  CONCEPT.md  ROADMAP.md  scenarios_mock.md  shops_mock.md
│
└── agents/                    (Claude Code subagent 정의 5종)
    └── app-mission-architect / dev-kickstart / single-react-dev / single-server-specialist / tosspayments-widget-integrator
```

### 정체 미상 자산 (지도에 매핑 필요)

| 폴더/파일 | 추정 |
|---|---|
| `movie-poster/` | 영화 포스터 디자인 작업. 디자인 시스템 연습 맥락이라 Q1~Q3 어느 자리에 흘러들 가능성. 또는 G1·G2의 사전 디자인 실험 |
| `MD/` | 동네골목 기획 문서 — **F1**(개인 프로젝트 v1)이 동네골목 v1.5라면 직접 연결 |
| `agents/` | Claude Code subagent 5종 — A1(static-visual-maker)와 같은 자동화 라인. 참고 자료 |
| `poster-desktop-1440.png` | movie-poster 페이지 캡처 |
| `ss/` | (정체 미확인) |

→ 지도에 위 폴더들이 명시적으로 안 들어있음. 각 항목 진입 시점에 매핑 결정.

---

## 잔여 작업

| 영역 | 작업 | 시점 |
|---|---|---|
| Q1~Q3 (디자인 퀘스트) | 카페 메뉴판·신메뉴 포스터·내 명함 | **재정렬 예정** — 형이 클로드AI와 순서·내용 조정 중 |
| F1 (개인 프로젝트 v1) | 이번 주 메인 산출물 — 정의 자체가 변경될 수 있음 | 클로드AI 협의 후 |
| F2 (오늘의집 클론) | 보너스 | F1 여유 있을 때 |
| `movie-poster/` · `MD/` · `agents/` · `ss/` · `poster-desktop-1440.png` | 어느 항목에 흘러드는지 매핑 + git 등록 | 해당 항목 진입 시 |

---

## 메모

- 6주차와 마찬가지로 공식 미션 PDF는 없음. 7주차는 고블린·퀘스트가 클로드AI 프롬프트로 단위별 수신되는 구조.
- 동네골목 메모리 기준 "7주차 디자인 수업 학습을 동네골목에 반영"이 다음 액션으로 박혀 있었음 (2026-05-08 EOD) — Q1~Q3(디자인 시스템) 또는 F1(개인 프로젝트 v1)에 직접 연결될 가능성 높음. 단, 후반전 구성 자체가 재정렬 중.
- **고블린·에이전트·퀘스트 구분**: 세 개념 모두 별개. 헷갈리지 말 것 (5/12 형 명시 + 전체 지도 수신 확정).
- **후반전(Q1~F2) 재정렬 협의 중 (5/12 EOD)** — 클로드AI와 형이 순서·내용 조정. 이 README의 후반전 표는 초안 지도, 결과 수신 시 갱신.
