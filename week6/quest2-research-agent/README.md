# Quest 2 — PRIME / Radar v2 (경쟁 서비스 deep dive 리서치 비서)

## 컨셉

5주차 Quest 2 "Radar" 방법론을 계승하되, **MCP 도구**와 **리서치 도메인**을 교체한다.
한 경쟁 서비스를 던지면 비서가 실제 화면·기능·UX를 직접 탐색해 4축 구조로 정리한 .md 리포트를 만드는 deep dive 리서치 에이전트. 시장 공백 탐지 + 솔직한 한계 명시.

## 5주차 → 6주차 차이점

| 항목 | 5주차 (Quest 2) | 6주차 (Quest 2) |
|------|------------------|------------------|
| **MCP 도구** | Playwright MCP | **Chrome DevTools MCP** |
| **리서치 도메인** | 학술·기술 리서치 (vLLM 폐쇄망, 엣지 sLLM × 농축산) | **동네골목 경쟁 서비스 리서치** |
| **출처 성격** | 논문·기술 블로그·기업 자료 (1차 텍스트) | 실제 운영 중인 서비스 화면·UX·기능 (1차 인터랙션) |
| **목적** | 시장 공백 탐지 (양봉 AI 슬롯) | **동네골목 차별화 슬롯 정의** |

## 리서치 대상 (3개)

1. **당근마켓** — 하이퍼로컬 중고거래·동네생활 지배 사업자
2. **네이버 지도 / 플레이스** — 동네 가게 검색·리뷰의 사실상 표준
3. **인스타그램 동네 해시태그** — `#우리동네`, `#OO동맛집` 류 비공식 동네 콘텐츠 채널

## 4축 구조 방법론 (5주차 계승)

각 리포트는 다음 4축으로 정리한다:

1. **현황 (What)** — 서비스가 실제로 무엇을 하는가, 핵심 기능·UX·사용자 경로
2. **강점·약점 (How)** — 무엇이 잘 되어 있고 무엇이 비어 있는가
3. **시장 공백 (Gap)** — 동네골목이 비집고 들어갈 슬롯
4. **솔직한 한계 (Limit)** — 이 리서치가 답하지 못하는 것 / 추가 검증 필요한 가설

## 산출물 (예정)

- `research/2026-05-XX-danggeun-deep-dive.md` — 당근마켓 4축 분석
- `research/2026-05-XX-naver-place-deep-dive.md` — 네이버 지도/플레이스 4축 분석
- `research/2026-05-XX-instagram-local-deep-dive.md` — 인스타 동네 해시태그 4축 분석
- `insights/2026-05-XX-dongne-golmok-differentiation.md` — 1페이지 차별화 인사이트 (동네골목이 들어갈 슬롯)
- `screenshots/` — Chrome DevTools MCP로 캡처한 실제 화면 N장

## 진행 상태

- [x] 폴더·README 셋업 (5주차 Radar 방법론 계승)
- [ ] Chrome DevTools MCP 동작 확인 (`mcp__chrome-devtools__*` 툴)
- [ ] 당근마켓 deep dive
- [ ] 네이버 지도/플레이스 deep dive
- [ ] 인스타 동네 해시태그 deep dive
- [ ] 1페이지 차별화 인사이트 추출
- [ ] 노션 업로드 + Daily 트리거 메모

---

## 참고 — 5주차 Quest 2 (Playwright MCP / 학술·기술 리서치)

5주차 결과물은 `../../week5/quest2-research-agent/` 참조:
- `research/2026-04-30-vllm-qwen-airgap.md` (9 출처)
- `research/2026-04-30-edge-sllm-agriculture.md` (19 출처, 양봉 ★ 10건)
- `insights/2026-04-30-bee-ai-strategic-insight.md` (1p 전략 인사이트)

5주차 비서의 핵심 인사이트 (방법론 검증):

> "엣지 sLLM은 *느려서* 못 쓰는 게 아니라 *어디 쓸지* 못 찾은 단계 — **양봉 AI 분야의 *센서 → sLLM 자연어 진단·보고 레이어*는 글로벌·국내 모두 0건의 정확한 시장 공백.**"

→ 같은 4축 + 시장 공백 탐지 방법론을 동네골목 경쟁 서비스 리서치에 적용한다.
