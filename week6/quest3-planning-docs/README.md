# Quest #3 — 기획서 갈음 정당화

5주차에 있던 공식 plan PDF가 6주차에는 부재 — quest #3의 정확한 명세는 *형의 기억* 외에 검증 불가. 형 기억 기준 명세는 **"MISSION / DEV / AUDIENCES 3종 기획서 작성"**이었음. 본 문서는 그것을 *동네골목 본 프로젝트의 기획 문서*로 어떻게 갈음했는지를 기록한다.

---

## 충족 방식

동네골목(`mmake7/dongne-golmok`) 본 프로젝트의 기획 문서로 갈음. **요청 명세보다 한 종 더 작성됨** (MISSION + CONCEPT + ROADMAP + DEV).

| 산출물 | 줄수 | dongne-golmok GitHub |
|---|---|---|
| **MISSION.md** | 254 | https://github.com/mmake7/dongne-golmok/blob/main/docs/MISSION.md |
| **CONCEPT.md** | 246 | https://github.com/mmake7/dongne-golmok/blob/main/docs/CONCEPT.md |
| **ROADMAP.md** | 322 | https://github.com/mmake7/dongne-golmok/blob/main/docs/ROADMAP.md |
| **DEV.md** (덤) | 438 | https://github.com/mmake7/dongne-golmok/blob/main/docs/DEV.md |
| 합계 | **1,260줄** | |

추가로 동네골목 v1 데모용 자산 3종도 같은 `docs/` 폴더에 함께 작성됨:

| 파일 | 줄수 | 용도 |
|---|---|---|
| `shops_mock.md` | 861 | 염창동 50개 가게 목업 데이터 |
| `scenarios_mock.md` | 268 | 8개 컨시어지 데모 시나리오 |
| `PAYMENT.md` | 142 | 결제(선결제) 모델 정리 — quest #1·#4 결제 모듈과 연결 |

> 이 7개 문서가 *동네골목이 어떤 프로젝트인지* 외부에 설명할 수 있는 자산 1세트.

---

## 명세 매핑

원래 명세(형 기억): **MISSION / DEV / AUDIENCES**

| 원래 명세 | 동네골목 산출 | 매핑 근거 |
|---|---|---|
| **MISSION** | `MISSION.md` (254줄) | 1:1 매핑 — 정체성·문제·사용자·v1 범위·반범위·성공기준 |
| **DEV** | `DEV.md` (438줄) | 1:1 매핑 — v1 구현 가이드. 기존 "v1 구현 진입 시 작성 예정"이었으나 실제로 *Phase 2·3 구현 중에 함께 작성*되어 이미 존재 |
| **AUDIENCES** | (미작성) | v1.5 단계 사용자 검증 전략. **갈음 X**, 의도적 미작성 |

추가로 작성된 것:

| 추가 산출 | 명세에 없으나 작성 이유 |
|---|---|
| `CONCEPT.md` | "어떤 느낌의 프로젝트인가"를 별도 정의. MISSION이 *정체성*, CONCEPT이 *체감* 담당 — 동네골목처럼 *톤이 핵심*인 프로젝트엔 둘이 분리되는 게 자연스러움 |
| `ROADMAP.md` | v1 → v1.5 → v2 → v3 단계별 그림. AUDIENCES의 사용자 발견·검증 시점 일부를 ROADMAP의 v1.5·v2 단계가 흡수 |

---

## AUDIENCES.md 미작성 사유

- **의도적 미작성** (졸속 작성 회피).
- AUDIENCES는 *사용자 검증 전략* 문서 — 데모 후 협력자·투자자 반응을 받아야 의미 있는 가설을 세울 수 있음.
- v1 데모를 한 번도 실 사용자에게 보여주지 않은 상태에서 작성하면 *상상 기반 문서*가 됨 — 동네골목 본 프로젝트의 *실 자산*이 못 됨.
- v1.5 단계(데모 반응 수집 후) 작성 예정. 학습 quest 갈음용으로 졸속 작성하는 비용 > 갈음의 가치.

---

## 충족 증적

- **동네골목 GitHub repo**: https://github.com/mmake7/dongne-golmok
- 4개 핵심 문서(MISSION/CONCEPT/ROADMAP/DEV) 모두 `main` 브랜치에 push 완료
- 문서 목차는 `docs/README.md`의 "## 문서 구조" 섹션에 명시
- 본 quest 갈음 결정의 근거는 `harbor-school` repo의 `week6/MD/MISSION.md`에서 인용:

> *"수능시험도 아니고 결국 내 발전을 위한 거"*
>
> *"quest #5 마감보다 본 프로젝트 우선"*

같은 원칙이 quest #3에도 적용됨 — *학습 quest 충족용 형식 문서*보다 *본 프로젝트 자산이 되는 문서*가 우선.

---

## 메타: 6주차 plan PDF 부재

5주차에는 `week5/plan/PRIME_Week5_Plan.pdf` 같은 공식 미션 문서가 있었으나, 6주차는 발행되지 않음. 따라서 quest #3의 *정확한* 명세를 외부에서 검증할 수 없음. 본 갈음 결정은 **형 기억 + 동네골목 산출 비교**에 근거. PDF가 추후 발견되면 매핑 재검토 가능.
