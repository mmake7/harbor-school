# Quest #3 — [Planning] 개인 프로젝트 기획서 3종

> ✅ **4 Part 풀 충족 + DEV/AUDIENCES v0.1 신규 작성** (2026-05-08 정식 명세 기반 갱신)

---

## 정식 명세 (출처: harbor.school 6주차 quest #3)

| Part | 영역 |
|---|---|
| **Part 1** | MISSION.md (문제·타겟 유저·해결 방법·영어 Tagline) |
| **Part 2** | DEV.md (MVP 범위·기술 스택·주차별 체크리스트) |
| **Part 3** | AUDIENCES.md (페르소나 3명·모이는 곳 3곳·첫 10명 획득 전략 3가지) |
| **Part 4** | 개인 프로젝트 저장소에 커밋 |

---

## Part별 충족 매핑

### Part 1 — MISSION.md ✅

- **위치**: `dongne-golmok/docs/MISSION.md` (254줄, 6주차 진행 중 작성, 본 quest 이전)
- **GitHub**: https://github.com/mmake7/dongne-golmok/blob/main/docs/MISSION.md
- **명세 항목 충족**:
  - [x] **문제 정의** (1문단) — `## 정체성` 섹션 + "공식 상권 바깥에서 동네를 만드는 작은 가게들이 발견되지 않는 문제" 명시
  - [x] **타겟 유저** (구체적) — `## v1 범위` 섹션에 *등록자(가게 사장님 4유형) + 이용자(주민)* 분류
  - [x] **해결 방법** (한 문단) — `## Mission Statement` 섹션:
    > "공식 상권 바깥에서 동네를 만드는 작은 가게들과, 그들을 단골로 누리는 주민들이, 서로를 자연스럽게 발견하는 동네 알림 생태계를 만든다."
  - [x] **영어 Tagline** — `## Project Name` 섹션에 *Dongne Golmok / GOLMOK*. 워터마크·도메인·로고에 영문 단축형 병행

> 위치 메모: 명세는 *"저장소 루트"*를 권장하나 MISSION은 작성 시점부터 `docs/`에 배치됨 (커뮤니티 표준). 동일 repo·동일 브랜치 내라 발견성은 동등. 추후 v1.5에서 정리 검토.

### Part 2 — DEV.md (v0.1, 본 quest 신규) ✅

- **위치**: `dongne-golmok/DEV.md` (root, v0.1)
- **GitHub**: https://github.com/mmake7/dongne-golmok/blob/main/DEV.md
- **명세 항목 충족**:
  - [x] **MVP 범위** (핵심 기능 yes/no 명확) — ✅ YES 3개 (AI 컨시어지 / 가게 목록 / 오늘의 한 줄) + ❌ NO 6개 (1:1 채팅·결제·매너온도·푸시·GPS·가게 모집)
  - [x] **기술 스택** (이미 배운 것 기반) — React CDN + Vercel Serverless + Supabase + Claude API + ImageKit. *선정 사유* 컬럼으로 의사결정 명시
  - [x] **주차별 체크리스트** — Week 6 (✅ Phase 1~4) / Week 7 (디자인) / Week 8 데모데이 / v1.5
- **추가**: 핵심 의사결정 로그 (Supabase JS 회피 / Vercel Blob 비채택 / 1:1 채팅 비채택 등)
- **v0.1 표시 사유**: 이 신규 본은 quest #3 충족 + v1.5 기초 자산. 본격 보강은 v1.5 단계 dev-kickstart 에이전트로. 더 깊은 구현 가이드는 [`docs/DEV.md`](https://github.com/mmake7/dongne-golmok/blob/main/docs/DEV.md) (438줄) 별도 존재

### Part 3 — AUDIENCES.md (v0.1, 본 quest 신규) ✅

- **위치**: `dongne-golmok/AUDIENCES.md` (root, v0.1)
- **GitHub**: https://github.com/mmake7/dongne-golmok/blob/main/AUDIENCES.md
- **명세 항목 충족**:
  - [x] **타겟 페르소나 3명** (이름·나이·직업·문제 구체적):
    1. 박지영 (38세 워킹맘) — 헛걸음·반복 확인 제거
    2. 김서준 (29세 1인 가구 직장인) — 동네 친구 한 명 얻은 경험
    3. 이영자 (62세 어르신 단골) — 사이트 한 번 켜면 끝, 회원가입 X
  - [x] **그들이 모이는 곳 3곳** (구체적 채널):
    1. 강서구 맘카페 (네이버) — 페르소나 1
    2. 오프라인 가게 부착물 (QR 스티커) — 페르소나 3
    3. 당근마켓 동네생활 게시판 (염창동) — 페르소나 2
  - [x] **첫 10명 획득 전략 3가지** (구체적 행동 + 타임라인 + 성공 기준):
    1. 단골 가게 시드 5명 (오프라인, v2 첫 주)
    2. 강서구 맘카페 후기글 (온라인, v2 첫 달)
    3. 동네 트럭·노점 시연 영상 (SNS, v2.5)
- **추가**: 경쟁사 약점 → 동네골목 차별화 표 (quest #2 자산 활용)

### Part 4 — 개인 프로젝트 저장소 커밋 ✅

- **repo**: https://github.com/mmake7/dongne-golmok
- DEV.md / AUDIENCES.md → `main` 브랜치 **루트**에 push (`5c823ca`)
- MISSION.md → `main` 브랜치 `docs/`에 push (이전 작성, 동일 repo)
- **추가 보너스 over-deliver** (`docs/` 안):
  - `CONCEPT.md` (246줄) — AI 컨시어지 컨셉
  - `ROADMAP.md` (322줄) — v1 → v3 단계별
  - `shops_mock.md` (861줄) — 50개 가게 목업
  - `scenarios_mock.md` (268줄) — 8개 컨시어지 데모
  - `PAYMENT.md` (142줄) — 선결제 모델 (quest #1·#4 결제 모듈 연결)

---

## 포인트 획득 기준 매핑

- [x] **기본 완료 (10pt)** — MISSION + DEV + AUDIENCES 3개 md 모두 push 완료, 명세 항목 100% 충족
- [x] **에이전트 활용 (5pt)** — Claude (claude.ai) + Claude Code 다회 대화로 기획 다듬음. quest #2 리서치 자산까지 결합
- [x] **창의성 (5pt)** — 페르소나 3명 모두 *동네골목 컨텍스트에 맞는 구체적 사용 행동* 명시 (헛걸음 / 동네 친구 / 어르신 회원가입 X). 첫 10명 획득 전략 중 *"화요 순대차 시연 영상"*은 동네골목 특화 (트럭·노점이 핵심 차별점)
- [ ] **공유 보너스 (5pt)** — 단톡방 공유 시 충족

---

## 제출물 체크리스트

- [x] **GitHub 저장소 링크**: https://github.com/mmake7/dongne-golmok
- [x] **MISSION.md 본문 1문단** (인용용):
  > "공식 상권 바깥에서 동네를 만드는 작은 가게들과, 그들을 단골로 누리는 주민들이, 서로를 자연스럽게 발견하는 동네 알림 생태계를 만든다."
- [x] **AI 대화 스크린샷**: [`../SS/q3.png`](../SS/q3.png) — quest #3 진행 중 Claude와의 기획 대화 캡처

---

## 참고 — v0.1 표시 사유

DEV.md / AUDIENCES.md는 **quest #3 충족 + 본 프로젝트 v1.5 기초 자산**을 동시에 채우는 v0.1 버전.

- DEV.md → v1 구현 진입 시 `dev-kickstart` 에이전트로 보강 (DB ERD, API 명세, 환경변수, CI/CD)
- AUDIENCES.md → v1.5 단계에서 페르소나 5명·채널·리텐션·바이럴 전략 보강

명세는 100% 충족하되, 본 프로젝트 자산으로의 발전 여지를 남김. *"학습용 졸속 작성"이 아닌 "본 프로젝트 자산"으로 진행*하는 동네골목의 일관 원칙 (cf. quest #5 pivot 결정).

---

## 진행 상태

- [x] MISSION.md (이전 작성)
- [x] DEV.md v0.1 (5/8 신규)
- [x] AUDIENCES.md v0.1 (5/8 신규)
- [x] 모두 dongne-golmok repo `main`에 push (`5c823ca`)
- [x] AI 대화 스크린샷 SS/q3.png 확보
