> ⚠️ 골격본 — 클로드AI에서 받은 7주차 quest 정식 명세를 수신한 뒤 본문을 채운다. 현재는 자산 목록·폴더 구조만 사실 기반으로 정리.

# 7주차 — (TBD: quest 명세 수신 후 제목 확정)

5·6주차와 동일 형식. 라이브 URL · Quest 충족 표 · 회고 · 폴더 구조 · 잔여 작업의 5블록 구조.

---

## 라이브

- (TBD) — 라이브로 배포되는 산출물이 있다면 URL · 검증 상태 기입

---

## Quest 충족 상태

| # | 정체 | 상태 | 폴더 | 핵심 커밋 |
|---|---|---|---|---|
| **#1** | GPT Image API로 5톤 YouTube 썸네일 비주얼 생성 (React 미니앱) | ✅ 마감 | [`thumbnail-generator/`](./thumbnail-generator/) | (등록 시 갱신) |
| **#?** | (TBD) | ⏳ | [`movie-poster/`](./movie-poster/) | — |
| **#?** | (TBD) | ⏳ | [`MD/`](./MD/) | — |
| **#?** | (TBD) | ⏳ | [`agents/`](./agents/) | — |

> Quest #1은 클로드AI 프롬프트(수업 고블린) 정식 명세 수신 후 매핑. 나머지 폴더는 추후 quest 진입 시 매핑.

---

## 7주차 회고

(TBD — quest 마감 후 한 단락)

---

## 폴더 구조 (현재)

```
week7/
├── README.md                  (이 파일 — 골격)
├── poster-desktop-1440.png    (포스터 컨셉 페이지 데스크탑 1440 캡처)
│
├── thumbnail-generator/       ✅ Quest #1 — GPT Image 5톤 YouTube 썸네일 생성기
│   ├── server.js                Express + OpenAI + sharp (1920×1080 / 1080×1920 변환)
│   ├── index.html / client.js   React CDN + Tailwind, 5톤 카드 그리드
│   ├── package.json             express · dotenv · openai · sharp
│   ├── .env.example             키 형식 가이드 (.env는 .gitignore)
│   ├── README.md                실행법 · 비용 · 결과 그리드
│   └── generated/               생성 결과 10장 (가로 5 + 세로 5)
│
├── movie-poster/              (영화 포스터 디자인 — 기리고 / If Wishes Could Kill)
│   ├── INFO.md                  작품 리서치 v1.0 (작품 개요·인물 7인·비주얼 시그니처·흥행 지표)
│   ├── index.html               포스터 컨셉 3선 비교 페이지 (React CDN + Tailwind)
│   ├── assets/
│   │   └── poster-chain.png       영정 그리드 컨셉 (gpt-image-1 생성)
│   ├── prompts/                 4개 — v1-1 카운트다운 · v1-2 무당 · v2-1 친구 · v2-2 뱀 무당
│   ├── research/
│   │   ├── info.md                INFO.md와 동일 본문 사본
│   │   └── prompt-chain.md        영정 그리드(죽음의 사슬) 프롬프트 — gpt-image-1 1024×1536
│   ├── scripts/gen-stills.sh    fal.ai/flux-dev 호출 스크립트
│   └── stills/
│       ├── (수집) main-poster.webp / teaser-poster.webp / logo.webp / char-{sea|nari|gunwoo|hajun|hyungwook|haetsal|bangul}.webp
│       ├── v1-realistic/           v1-1-countdown.jpg · v1-2-shaman.jpg
│       └── v2-animals/             v2-1-friends.jpg · v2-2-snake-shaman.jpg
│
├── MD/                        (동네골목 기획 문서 5종 — 6주차 quest#3 자료와 동일 세트)
│   ├── README.md  MISSION.md  CONCEPT.md  ROADMAP.md
│   └── scenarios_mock.md  shops_mock.md
│
└── agents/                    (Claude Code subagent 정의 5종)
    ├── app-mission-architect.md       앱 아이디어를 MISSION.md로 구체화
    ├── dev-kickstart.md               MISSION.md → DEV.md 개발 계획
    ├── single-react-dev.md            단일 index.html SPA (React CDN + Tailwind)
    ├── single-server-specialist.md    server.js 미니 백엔드 (Express / http)
    └── tosspayments-widget-integrator.md  TossPayments 결제위젯 통합
```

---

## 자산 사실 메모 (명세 매핑 전 잡아둔 것)

### movie-poster

- **작품**: 〈기리고〉 / If Wishes Could Kill — Netflix 한국 오리지널, 2026-04-24 공개, 8부작
- **장르**: 호러 / 학원 / 오컬트 / 스릴러 — 다층 장르를 한 화면에 응축해야 하는 디자인 과제
- **핵심 모티프**: "소원의 대가는 죽음" — 앱 매개 저주
- **생성 이미지 4장 (fal.ai/flux-dev)** + **영정 그리드 1장 (gpt-image-1)** 보유
- **컨셉 비교 페이지** `index.html` 존재 — 데스크탑 1440 캡처 한 장 같이 있음

### MD

- 동네골목 기획 문서 5종 — 6주차에 본 것과 동일 세트
- 7주차 quest에 어떻게 들어맞는지 명세 수신 후 판단 (수업 학습을 동네골목에 반영하는 시점 후보)

### agents

- 5종 모두 Claude Code subagent 정의 — single-react-dev / single-server-specialist 등
- 7주차에 새로 작성된 건지, 재사용 자산인지 명세 수신 후 표기

---

## 잔여 작업

| 영역 | 작업 | 시점 |
|---|---|---|
| Quest 명세 매핑 | 클로드AI 프롬프트 수신 → 폴더↔quest 번호 확정 | 즉시 |
| README 본문 채움 | 라이브 URL · 회고 · 핵심 커밋 | 명세 수신 후 |
| .gitignore 점검 | movie-poster 대용량 자산(webp · jpg · png) push 여부 결정 | git add 직전 |

---

## 메모

- 6주차와 마찬가지로 공식 미션 PDF가 있는지 명세 수신 시점에 같이 확인
- 동네골목 메모리 기준 "7주차 디자인 수업 학습을 동네골목에 반영"이 다음 액션으로 박혀 있었음 (2026-05-08 EOD) — 이게 7주차 quest와 어떤 관계인지 명세 매핑 시 확인
