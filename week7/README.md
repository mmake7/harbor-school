# 7주차 — 디자인 시스템 + 개인 프로젝트 v1

5·6주차와 달리 항목이 **3-tier 구조**로 들어옴: 워밍업 고블린 → 자동화 에이전트 → 디자인 퀘스트 → Final 개인 프로젝트.

**용어 정의 (혼동 금지)**:
- **고블린** (🟢): 워밍업 단위. 톤 실험·간단 산출물. 클로드AI에서 받는 수업 단위 프롬프트.
- **에이전트** (🟡): 고블린들의 패턴을 자동화하는 도구.
- **퀘스트** (🟡): 디자인 시스템 적용 연습.
- **Final** (🔴/🔵): 이번 주 메인 산출물 + 보너스.

---

## 라이브

- (TBD) — Final 진입 시 라이브 URL 확보

---

## 7주차 전체 지도

| 카테고리 | # | 항목 | 난이도 | 상태 | 폴더 | 핵심 커밋 |
|---|---|---|---|---|---|---|
| 🟢 고블린 | **G1** | YouTube 썸네일 1920×1080 (발표용 ✨) | 쉬움 | ✅ 마감 | [`thumbnail-generator/`](./thumbnail-generator/) | `mmake7/harbor-school@5c95d44`, `3663ac5` |
| 🟢 고블린 | **G2** | 인스타 광고 카드 1080×1080 | 쉬움 | ✅ 마감 | [`instagram-card-generator/`](./instagram-card-generator/) | (등록 시 갱신) |
| 🟢 고블린 | **G3** | 내 프로필 카드 | 쉬움 | ⏳ | — | — |
| 🟡 에이전트 | **A1** | `static-visual-maker` (G1·G2·G3 자동화) | 중 | ⏳ | — | — |
| 🟡 퀘스트 | **Q1** | 카페 메뉴판 (디자인 시스템 적용 연습) | 중 | ⏳ | — | — |
| 🟡 퀘스트 | **Q2** | 카페 신메뉴 포스터 (디자인 시스템 적용 연습) | 중 | ⏳ | — | — |
| 🟡 퀘스트 | **Q3** | 내 명함 (톤 일관성 연습) | 중 | ⏳ | — | — |
| 🔴 Final | **F1** | 개인 프로젝트 v1 (이번 주 **메인**, 신규 프로젝트 본체) | 큼 | ⏳ | — | — |
| 🔵 Final 보너스 | **F2** | 오늘의집 클론 (여유 있으면) | 큼 | ⏳ | — | — |

### 자연 흐름 (난이도 순)

```
G1 ✅ → G2 → G3 → A1 (3개 패턴 추상화) → Q1·Q2·Q3 → F1 (메인) → F2 (보너스)
```

- G1·G2·G3가 워밍업이자 A1의 입력 패턴. **3개 다 끝나면 A1 자동화 가능**
- Q1·Q2·Q3가 디자인 시스템 적용 — 동네골목 디자인 정교화에 직접 흘러들 수 있음
- F1이 이번 주 진짜 메인. v1 시작점

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
| G2·G3 | 인스타 광고 카드, 프로필 카드 진입 | 다음 고블린 프롬프트 수신 시 |
| A1 | 위 3개 고블린 패턴을 자동화하는 에이전트 | G3 마감 후 |
| Q1~Q3 | 디자인 시스템 적용 연습 3종 | A1 후 또는 병행 |
| F1 | 개인 프로젝트 v1 — 메인 산출물 | 디자인 라인 정리 후 진입 |
| F2 | 오늘의집 클론 (보너스) | F1 여유 있을 때 |
| movie-poster · MD · agents 등 | 어느 항목에 흘러드는지 매핑 + git 등록 | 해당 항목 진입 시 |

---

## 메모

- 6주차와 마찬가지로 공식 미션 PDF가 있는지 명세 수신 시점에 같이 확인
- 동네골목 메모리 기준 "7주차 디자인 수업 학습을 동네골목에 반영"이 다음 액션으로 박혀 있었음 (2026-05-08 EOD) — Q1~Q3(디자인 시스템) 또는 F1(개인 프로젝트 v1)에 직접 연결될 가능성 높음
- **고블린·에이전트·퀘스트 구분**: 세 개념 모두 별개. 헷갈리지 말 것 (5/12 형 명시 + 전체 지도 수신 확정)
