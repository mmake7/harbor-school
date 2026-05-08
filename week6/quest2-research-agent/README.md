# Quest #2 — [Research] 경쟁 서비스 3곳 Chrome MCP 리서치

> ✅ **4 Part 풀 충족 + 1p 인사이트 over-deliver** (2026-05-08 정식 명세 기반 갱신)

---

## 정식 명세 (출처: harbor.school 6주차 quest #2)

| Part | 영역 |
|---|---|
| **Part 1** | 경쟁 서비스 3곳 선정 |
| **Part 2** | Chrome MCP 자동 탐색 + 스크린샷 |
| **Part 3** | `research.md` 비교 리포트 + AUDIENCES 인풋 |
| **Part 4** | 개인 프로젝트 저장소 커밋 |

---

## Part별 충족 매핑

### Part 1 — 3곳 선정 ✅

| # | 서비스 | 분류 |
|---|---|---|
| 1 | **당근마켓** | 국내 — 동네 기반 C2C 최강자 (4,300만 가입자) |
| 2 | **네이버 지도/플레이스** | 국내 — 가게 정보 사실상의 표준 |
| 3 | **인스타그램 동네 해시태그** | 글로벌 SNS — 인접 카테고리 (가게 자체 운영 채널) |

명세 추천 *"국내 1 + 해외 1 + 인접 1"*의 변형: 동네골목이 한국 시장 파일럿이라 **국내 비중 강화** (당근·네이버 둘 다 국내) + 인접 카테고리로 인스타(글로벌 SNS) 추가. 사유는 [`research.md`](./research.md) 첫 표 참조.

### Part 2 — Chrome MCP 자동 탐색 ✅

- **도구**: Chrome DevTools MCP (5주차 Playwright MCP에서 교체)
- **산출**:
  - `research/2026-05-07-daangn-market.md` — 당근 deep dive (4축 구조 240+줄)
  - `research/2026-05-07-naver-place.md` — 네이버 quick dive (100+줄)
  - `research/2026-05-07-instagram-local-tags.md` — 인스타 quick dive (130+줄)
- **스크린샷 9장** (각 서비스 핵심 화면):
  - 당근: 06 메인 / 07 비즈니스 / 08 동네업체 검색 / 09 동네생활 / 10 서비스 소개
  - 네이버: 11 지도 메인 / 12 플레이스 검색 결과 / 13 플레이스 상세
  - 인스타: 14 #신당동맛집 태그 페이지
- **AI 대화 스크린샷** (필수 제출물):
  - `screenshots/15-ai-research-dialogue.png` — ⚠ **형이 직접 캡처 필요** (현재 Claude Code 대화창 → Win+Shift+S로 영역 캡처 → 해당 경로 저장)
- **커밋**: `mmake7/harbor-school@45baeaf` (research 3건 + insights 1p), `92d1c9a` (당근 deep dive 분리)

### Part 3 — research.md 비교 리포트 ✅

- **단일 파일**: [`research.md`](./research.md) (정식 명세 형식 충족 — 5/8 보강)
- **비교표**: 4 서비스(당근·네이버·인스타·동네골목) × 5 축(Value Proposition·주요 기능·가격 정책·UX 특징·타겟 사용자)
- **차별화 포인트 3가지** 명시:
  1. 광고 없는 큐레이션 — vs 당근 (수익 모델 차이)
  2. 자연어 맥락 대화 — vs 네이버 (검색 vs 대화)
  3. 책임지는 큐레이터 — vs 인스타 (알고리즘 vs 사람)
- **AUDIENCES.md 인풋 섹션** 명시 — 경쟁사 사용자 불만 패턴 + 동네골목이 메우는 자리 매핑
- **추가 부산물 (over-deliver)**: [`insights/2026-05-07-dongne-golmok-differentiation.md`](./insights/2026-05-07-dongne-golmok-differentiation.md) — *4가지 발견 양식* 1p 전략 인사이트 + 5가지 액션 제안

### Part 4 — 개인 프로젝트 저장소 커밋 ✅

- **학습 repo**: `mmake7/harbor-school/week6/quest2-research-agent/` (이 폴더)
- **본 프로젝트 repo**: `mmake7/dongne-golmok/research/quest2-link.md` — 본 quest 산출물이 동네골목 컨셉·MISSION·랜딩·AI 프롬프트에 어떻게 반영됐는지 명시. *학습/사업 자산 흐름* 다이어그램 포함.

---

## 5주차 quest #2와의 차이

| 항목 | 5주차 | 6주차 |
|---|---|---|
| **MCP 도구** | Playwright MCP | **Chrome DevTools MCP** |
| **리서치 도메인** | 학술·기술 (vLLM 폐쇄망 / 엣지 sLLM × 농축산) | **경쟁 서비스** (당근·네이버·인스타) |
| **인사이트 결론** | 양봉 AI sLLM 자연어 진단 슬롯 | **4가지 발견 양식** (재미·검색·가까움·맥락) |
| **노션 업로드** | ✅ 완료 (Notes/Learnings 3페이지 + Daily 트리거) | ⏸ 보류 (노션 무료 한도 소진) |

---

## quest #5 시너지

본 리서치의 *4가지 발견 양식*은 quest #5(동네골목 pivot)의 **컨셉 코어**로 직접 반영됨:

| 활용 영역 | 반영 내용 |
|---|---|
| 차별점 정의 | "4가지 발견 양식" 표 그대로 동네골목 *맥락 발견* 슬롯 명시 |
| 랜딩 카피 후보 3개 | "광고 없는 동네 비서", "검색 말고 대화로", "골목 사정 아는 친구" |
| AI 시스템 프롬프트 톤 | "당신은 검색 엔진이 아니라 골목 비서다" |
| `MISSION.md` / `CONCEPT.md` | 당근/네이버/인스타와의 비교 표 흡수 |

→ 학습 quest #2의 산출물이 *본 프로젝트(quest #5)의 컨셉 코어*가 된 케이스. **두 quest가 서로 자산을 주고받는 관계.**

---

## 포인트 획득 기준 매핑

- [x] **기본 완료 (10pt)** — research.md + 비교표 4×5 + 차별화 포인트 3개 + AUDIENCES 인풋
- [x] **에이전트 활용 (5pt)** — Chrome MCP 자동 탐색 (각 서비스 페이지 직접 방문 + 스냅샷·스크린샷) + Claude Code 다회 대화로 4축 구조·인사이트 도출
- [x] **창의성 (5pt)** — *4가지 발견 양식* 프레임 (over-deliver 1p 인사이트). 단순 비교가 아니라 *발견 양식*이라는 메타 분류축으로 재구성 → 동네골목 컨셉 코어로 직접 채택
- [ ] **공유 보너스 (5pt)** — 단톡방 공유 시 충족

---

## 제출물 체크리스트

- [x] **research.md 링크**: https://github.com/mmake7/harbor-school/blob/main/week6/quest2-research-agent/research.md
- [x] **Chrome MCP 스크린샷 3장 이상**: `screenshots/06~14.png` (총 9장)
- [ ] **AI 대화 스크린샷**: `screenshots/15-ai-research-dialogue.png` ⚠ **형 직접 캡처 필요**
  - 캡처 권장 영역: 본 quest #2 진행 중 Claude Code와 나눈 대화창 (예: "Chrome MCP로 당근 조사", "4가지 발견 양식 인사이트 도출" 등)
  - 5주차 quest2 패턴: `harbor-school/week5/quest2-research-agent/screenshots/`에 동일 형식 있음
- [x] **본 프로젝트 연결**: `dongne-golmok/research/quest2-link.md` (별도 repo)

---

## 폴더 구조

```
quest2-research-agent/
├── README.md                       (이 파일 — 정식 명세 매핑)
├── research.md                     (통합 비교 리포트, 5/8 보강)
├── research/                       (개별 deep dive 3건)
│   ├── 2026-05-07-daangn-market.md
│   ├── 2026-05-07-naver-place.md
│   └── 2026-05-07-instagram-local-tags.md
├── insights/                       (1p 전략 인사이트, over-deliver)
│   └── 2026-05-07-dongne-golmok-differentiation.md
└── screenshots/                    (Chrome MCP 캡처)
    ├── 06~10.png                   (당근 5장)
    ├── 11~13.png                   (네이버 3장)
    ├── 14.png                      (인스타 1장)
    └── 15-ai-research-dialogue.png ⚠ 형 직접 캡처 필요
```

---

## 다음 (선택)

- [ ] AI 대화 스크린샷 캡처 (Win+Shift+S → `screenshots/15-ai-research-dialogue.png` 저장 → commit)
- [ ] 단톡방 공유 → 공유 보너스 5pt 충족
