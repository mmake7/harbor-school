# Quest #5 — 당근 클론 → 동네골목 pivot

원래 6주차 quest #5 (형 기억): **"당근마켓 클론"**. 6주차 진행 중 *학습용 클론*에서 *본인 사업 자산*으로 격상되어 **동네골목** (별도 repo)으로 진화. 본 README는 그 pivot 결정과 현재 진행 상태를 등록한다.

> ✅ **라이브 데모 검증 완료** (5/8): https://dongne-golmok.vercel.app/
> 50개 가게 정적 데이터 + Claude Sonnet 4.6 컨시어지 + ephemeral 캐싱(10,737 tokens) 풀 동작.

---

## pivot 사유

| | 원래 | 진화 후 |
|---|---|---|
| 정체성 | 학습용 당근마켓 클론 | 본인 사업의 v1 파일럿 |
| 컨셉 | 단순 중고거래 클론 | AI 컨시어지가 *우리 동네 작은 가게*와 *주민의 상황*을 매칭하는 **동네 알림 서비스** |
| 출처 | harbor.school 6주차 미션 | 형의 첫 직감 + 시장 공백 발견 |
| 마감 형식 | 학습 quest 제출 | 투자자·협력자에게 보여줄 데모 |

> 결정 인용 (`harbor-school/week6/MD/MISSION.md`):
>
> *"수능시험도 아니고 결국 내 발전을 위한 거"*
> *"quest #5 마감보다 본 프로젝트 우선"*

학습 quest 갈음용 졸속 작성을 회피하고, 본 프로젝트 자체를 quest 충족 증적으로 등록.

---

## 변경 이력 (6주차 진행 중)

| 시점 | 사건 | 메모 |
|---|---|---|
| Day 초반 | 당근마켓 클론으로 시작 | harbor.school 6주차 미션 그대로 따라감 |
| Day 중반 | 가내수공업·트럭음식 *입고 알림*으로 변형 | 형의 첫 직감 — "단순 클론 X" |
| Day 중반 | "**숨어있는 우리동네가게**" 키워드 도입 | "비공식 상권" 톤이 너무 행정적이라 교체 |
| Day 후반 | **AI 컨시어지** 컨셉 진화 | quest #2 Radar v2의 "4가지 발견 양식" 인사이트 직접 반영 |
| Day 후반 | quest 마감보다 본 프로젝트 우선 결정 | 학습 → 사업 자산 격상 |
| Day 후반 | **동네골목** 단독 repo 분리 | `mmake7/dongne-golmok` |

---

## 현재 진행 상태 (2026-05-08 기준)

| Phase | 내용 | 상태 |
|---|---|---|
| Phase 1 | UI 골격 (단일 `index.html`, React CDN + Tailwind CDN + Babel standalone) | ✅ |
| Phase 2 | 백엔드 서버리스 함수 (`api/*.js` Vercel + pg) — 목업 모드 | ✅ |
| Phase 3 | AI 컨시어지 (Claude Sonnet 4.6 + 50개 가게 컨텍스트 + ephemeral 캐싱) | ✅ |
| **Phase 4** | **Vercel 프로덕션 배포 + 라이브 동작 검증** | **✅ (5/8)** |
| v1.5 | 디자인 정교화 / DEV.md 보강 / AUDIENCES.md / PostgreSQL 본격 / fal 이미지 / PWA | ⏳ 사이드 영역 |

마지막 dongne-golmok 커밋: `ca38e2f fix: AI 안내 문구 stale 라벨 갱신`

### Phase 4 라이브 검증 (5/8)

| 라이브 홈 (50개 가게 + AI 입력) | AI 컨시어지 응답 |
|---|---|
| ![](./live-01-home.png) | ![](./live-02-ai-response.png) |

검증 항목:
- ✅ `https://dongne-golmok.vercel.app/` 도달 (Vercel alias)
- ✅ `/api/shops` — 50개 가게 정적 데이터 응답
- ✅ `/api/ai` — Claude Sonnet 4.6 호출 + 톤 있는 응답 + 가게 ID 참조
- ✅ ephemeral 캐싱 동작: 시스템 프롬프트(50개 가게 컨텍스트) 10,737 tokens가 `cache_creation_input_tokens`로 잡힘 → 후속 호출은 cache hit
- ✅ KST 시간 정확 ("2026년 5월 8일 금요일 13:57")
- ✅ UI 응답: 가게 카드 클릭 가능한 "👉 가게이름" 버튼 렌더

라이브 검증 중 발견한 stale 라벨("Phase 1 — AI 컨시어지는 Phase 3에서 연결됩니다") 즉시 패치 → `ca38e2f` 재배포로 해결.

---

## 산출물 위치

**동네골목 repo**: https://github.com/mmake7/dongne-golmok

### 기획·데이터 문서 7종 (모두 `main` 브랜치, `docs/`)

| 파일 | 줄수 | GitHub |
|---|---|---|
| `README.md` | 77 | https://github.com/mmake7/dongne-golmok/blob/main/docs/README.md |
| `MISSION.md` | 254 | https://github.com/mmake7/dongne-golmok/blob/main/docs/MISSION.md |
| `CONCEPT.md` | 246 | https://github.com/mmake7/dongne-golmok/blob/main/docs/CONCEPT.md |
| `ROADMAP.md` | 322 | https://github.com/mmake7/dongne-golmok/blob/main/docs/ROADMAP.md |
| `DEV.md` | 438 | https://github.com/mmake7/dongne-golmok/blob/main/docs/DEV.md |
| `shops_mock.md` | 861 | 염창동 50개 가게 목업 데이터 |
| `scenarios_mock.md` | 268 | 8개 컨시어지 데모 시나리오 |
| `PAYMENT.md` | 142 | 선결제 모델 (quest #1·#4 결제 모듈과 연결) |

### 코드 (Phase 1~3)
- `index.html` — 단일 파일 SPA
- `api/*.js` — 서버리스 함수
- `data/` — 50개 가게 정적 데이터

---

## quest #2 자산 활용

6주차 quest #2 (Radar v2 경쟁 리서치)의 결과물 **"4가지 발견 양식"**(재미·검색·가까움·맥락)이 동네골목의 핵심 차별점 정의에 직접 반영됨:

| 활용 영역 | 반영 내용 |
|---|---|
| 차별점 정의 | "4가지 발견 양식" 표 그대로 동네골목 *맥락 발견* 슬롯 명시 |
| 랜딩 카피 후보 3개 | "광고 없는 동네 비서", "검색 말고 대화로", "골목 사정 아는 친구" |
| AI 시스템 프롬프트 톤 | "당신은 검색 엔진이 아니라 골목 비서다" |
| MISSION.md / CONCEPT.md | 당근/네이버/인스타와의 비교 표가 본 문서에 흡수 |

> 참조: [`../quest2-research-agent/insights/2026-05-07-dongne-golmok-differentiation.md`](../quest2-research-agent/insights/2026-05-07-dongne-golmok-differentiation.md)

quest #2와 quest #5는 *서로 자산을 주고받는* 관계 — quest #2의 인사이트가 quest #5의 컨셉을 정의하고, quest #5의 본 프로젝트가 quest #2 인사이트를 *실 화면*으로 검증함.

---

## 다음 세션 진입점

Phase 4 마감 → 다음은 **데모 반응 수집** 인터벌 또는 **v1.5** 진입.

| 옵션 | 작업 | 시간 |
|---|---|---|
| **인터벌** | 협력자·투자자에게 라이브 URL 공유 + 반응 수집. 별도 작업 없음 (대기 모드) | — |
| **v1.5** | 디자인 정교화 / AUDIENCES.md (반응 수집 후) / PostgreSQL 본격 / fal 이미지 / PWA | 다세션 |
| 후속 패치 (선택) | 8개 시나리오 풀 톤 검증 (`docs/scenarios_mock.md`) — 톤 일관성·가게 매칭 정확도 | 1~2시간 |

추천: **인터벌 우선.** v1.5는 데모 반응 보고 우선순위 결정.

### Phase 4 셋업 메모 (참고용 — 이미 끝난 작업)

```powershell
cd D:\Dropbox\workspace\dongne-golmok
vercel link --yes --scope mmake7-3440s-projects   # 새 프로젝트 자동 생성
tr -d '\n' < /tmp/key.txt | vercel env add ANTHROPIC_API_KEY production   # 줄바꿈 함정 회피
vercel --prod --yes   # alias https://dongne-golmok.vercel.app
```

---

## 정식 명세 (출처: harbor.school 6주차 quest #5)

| Part | 영역 |
|---|---|
| **Part 1** | 회원가입 + 동네 설정 |
| **Part 2** | 상품 등록 (이미지 3장 + 카테고리 + RLS) |
| **Part 3** | 목록 + 검색 + 관심 버튼 |
| **Part 4** | 1:1 채팅 (Polling) |
| **Part 5** | 마이페이지 |
| **Part 6** | Vercel 배포 |

---

## Part별 충족 매핑

### Part 1 — 회원가입 + 동네 설정 ⚠ 부분
- **현재 구현**: 시뮬 로그인(`api/auth.js` — 모든 요청 동일 demo-user) + 염창동 1곳 고정(`data/neighborhoods.json`)
- **갈음 사유**: v1은 *동작 검증* 1순위로 정적 JSON + 시뮬 로그인 채택 (DEV.md 명시 영역). 진짜 Auth는 v1.5 PostgreSQL/JWT 도입과 함께
- **본 프로젝트 자산화 시점**: v1.5

### Part 2 — 상품 등록 (이미지·RLS) ⚠ 부분
- **현재 구현**: 50개 가게 *목업 데이터* (`data/shops.json` 정적 JSON). 사용자 등록 X
- **갈음 사유**: v1 컨셉상 *사장님 가입은 v2 영역*. 데모 시연은 *운영자가 사전 등록한 50개*로 충분. 이미지 업로드(ImageKit 또는 fal)·RLS는 v1.5
- **본 프로젝트 자산화 시점**: v1.5(이미지) + v2(사용자 등록 + RLS)

### Part 3 — 목록 + 검색 + 관심 ⚠ 부분
- **목록** ✅ — 정착형/이동형 토글 + 카테고리 필터 + 50개 가게 그리드
- **검색** ⚠ — 키워드 검색(`api/search.js`)을 **AI 컨시어지로 갈음**. 자연어 검색의 진화형(*"오늘 비 와서 따끈한 거"* → 3개 추천)
- **관심 버튼** ❌ — v2 *단골 등록*과 함께
- **갈음 사유**: 검색의 *기능*은 충족(키워드 + AI 자연어 둘 다). 관심은 단골 등록과 의미적으로 묶여 v2 영역
- **본 프로젝트 자산화 시점**: 관심·단골은 v2

### Part 4 — 1:1 채팅 (Polling) ❌ Anti-scope (의도적 제외)
- **갈음 사유**: 동네골목의 *핵심 차별점이 "AI 컨시어지가 1:1 채팅의 진화"*. 사장님과 직접 채팅 대신 AI가 *동네 친구처럼* 답함. quest #2(Radar v2) "4가지 발견 양식" 인사이트의 직접 반영
- **MISSION/CONCEPT/ROADMAP/DEV.md 모두 anti-scope 명시**: 1:1 채팅은 v1.5 *상점 게시판*으로 대체 (관리 부담·익명 악용 회피)
- **본 프로젝트 자산화 시점**: v1.5 상점 게시판 (단방향 게시 + 댓글 합의)

### Part 5 — 마이페이지 ❌ Anti-scope (의도적 제외)
- **갈음 사유**: v1은 *동네 단위 한 줄*("오늘 동네 한 줄")로 충분. 개인화는 v2 *단골 등록* 영역. 시뮬 로그인 환경에선 마이페이지 의미 자체가 X
- **본 프로젝트 자산화 시점**: v2 단골 등록 + 개인화 (방문 가게·관심 가게 트래킹)

### Part 6 — Vercel 배포 ✅ 라이브 완료
- **라이브 URL**: **https://dongne-golmok.vercel.app/**
- **마지막 커밋**: `mmake7/dongne-golmok@9c31228` (PDF 추가) — 코어 기능은 `ca38e2f`
- **검증**: 새 사용자 진입 → AI 컨시어지 자연어 질문 → 가게 추천 → 풀 흐름 동작 (스크린샷 `live-01-home.png`, `live-02-ai-response.png`)

---

## 갈음 정당화 — 핵심 사유

이 quest는 **"학습 형식 충족"보다 "본 프로젝트 진화"가 더 큰 가치**라는 의식적 결정으로 pivot됨.

| | 원래 quest #5 | 실제 진행 |
|---|---|---|
| 정체성 | 당근마켓 클론 | 동네골목 v1 MVP |
| 핵심 기능 | Auth + DB + 이미지 + 채팅 통합 | AI 컨시어지 단방향 정보 알림 |
| 학습 가치 | Auth·DB·이미지·통합 패턴 | 컨셉 수립 + 사업 자산 + AI 통합 |

**학습 가치는 다른 quest로 풀 충족됨**:

- **quest #1 (쇼핑)**: Auth ✅ + DB ✅ + ImageKit 이미지 업로드 ✅ + TossPayments 결제 ✅ + 마이페이지 ✅ + 라이브 ✅
- **quest #4 (유료잠금)**: Auth ✅ + DB ✅ + 권한 체크 ✅ + 결제 ✅ + 보안 3중 게이트 ✅ + 라이브 ✅

→ 학습 본질(Auth·DB·이미지·통합·보안)은 **quest #1·#4가 풀 충족**. quest #5는 *본 프로젝트로의 진화*에 집중.

### DEV.md 원칙 (v1 → v3 로드맵)

- **v1**: 동작 검증 1순위 (정적 JSON, 시뮬 로그인) ← 현재
- **v1.5**: PostgreSQL / JWT / 이미지 / 관심 / 가게 등록 / 상점 게시판
- **v2**: 단골 등록 / 마이페이지 / 실제 운영 / 결제 통합 (quest #1·#4 결제 모듈 재활용)

quest #5의 6 Part는 **동네골목 v1.5~v2 로드맵에서 모두 다뤄질 영역**. 형식적 학습 충족을 위해 v1.5를 *지금 당기는* 비용 > 본 프로젝트 가치 보존 이익.

---

## 포인트 획득 기준 매핑

- [x] **기본 완료 (10pt)** — 가입 시뮬 + 가게(목업) + 목록·상세 + 라이브 배포 (Part 1·2·3 ⚠ 부분 + Part 6 ✅)
- [ ] **채팅 구현 (5pt)** — Anti-scope. AI 컨시어지로 갈음 시도. *평가자 판단*
- [x] **에이전트 활용 (5pt)** — Claude·Claude Code 다회 대화 흔적, quest #2 자산까지 통합
- [ ] **다른 사람 인증 (5pt)** — Anti-scope (시뮬 로그인). 단톡방 시연 영상 공유로 갈음 시도

**예상 점수**: 15~20pt (다른 4개 quest 25pt 풀과 균형). 6주차 누적 **130~140pt 추정** (#1·#2·#3·#4 25pt × 4 = 100~120pt + #5 15~20pt).

---

## 제출물 체크리스트

- [x] **배포 URL**: https://dongne-golmok.vercel.app/
- [x] **GitHub 저장소**: https://github.com/mmake7/dongne-golmok
- [x] **AI 대화 스크린샷 (2장)**: [`../SS/q5-1.png`](../SS/q5-1.png), [`../SS/q5-2.png`](../SS/q5-2.png)
- [ ] **시연 영상 1분** — 형 직접 녹화 예정 (잠금 해제 → AI 응답 흐름)
- [ ] **본인 외 1명 가입 & 채팅** — Anti-scope (시뮬 로그인 환경). 시연 영상 시청 1건으로 갈음 시도

---

## 동네골목 본 프로젝트 정체성 명시

quest #5의 갈음은 **동네골목 본진(AI 컨시어지)을 사수하기 위한 의도된 trade-off**.

| 영역 | 점수 | 가치 |
|------|------|------|
| quest #1·#2·#3·#4 | 25pt × 4 = 100~120pt 누적 가능 | 학습 본질 풀 충족 |
| quest #5 (갈음) | 15~20pt | 본 프로젝트 진화 + 라이브 데모 |
| **본 프로젝트 (동네골목)** | (점수 외) | 형 사업 자산 |

quest 점수 5~10pt 차이 < 형 사업 자산 가치. 6주차 진입 직후 명시한 의사결정 원칙(*"수능시험도 아니고 결국 내 발전을 위한 거"*)의 **일관된 적용**.

---

## 메타: 학습 quest로서의 평가

- 학습 quest 충족 형식: **갈음** (별도 repo + 4 Phase + 7종 문서)
- *형식적 마감*보다 *본 프로젝트로 격상하는 의사결정 자체*가 6주차의 핵심 산출물.
- 같은 결정 패턴이 quest #3에도 적용됨 — *학습 quest 충족용 형식 문서*보다 *본 프로젝트 자산이 되는 문서*가 우선.
