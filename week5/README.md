# 5주차 PRIME — 미션 제출

5주차 PRIME 부트캠프 8개 퀘스트(Q1~Q8) 통합 제출.

## 라이브
- 🌐 https://harbor-community.vercel.app/ (Q5~Q8 통합 사이트)
- 🌙 https://harbor-community.vercel.app/#/me (Q7+Q8 문카페)

## 컨셉

**PRIME** — 흩어진 정보를 모아 패턴으로 응축하는 개인 운영 시스템.
- Notes (회고·학습 기록) — 매일·매주·주제별 단방향 누적
- Radar (Deep Dive 리서치) — 1차 출처 직접 방문 + 4축 구조 정리
- Spend (가계부) — 수입·지출 입력 / 카테고리별 통계 / KST 일관 처리
- Insight (가계부 분석 비서) — Q3 위에 monthly + 대화형 분석 통합
- Community (게시판 + 쇼핑) — Auth 인프라 + 통합 사이트
- Moon Cafe (대시보드 + 듀오 AI) — Context Before/After 시연

## 퀘스트 구성

| 미션 | 폴더 | 라이브 위치 | 핵심 |
|---|---|---|---|
| Q1 (Notion Assistant) | quest1-notion-assistant/ | (별도) | 첫 에이전트 |
| Q2 (Research / Radar) | quest2-research-agent/ · q2-radar/ | (별도) | Deep Dive 분석 |
| Q3 (Budget App) | quest3-budget-app/ | (별도 vercel) | 가계부 SPA |
| Q4 (Budget Analyzer) | quest4-budget-analyzer/ | (별도) | Q3 위에 분석 비서 |
| Q5+Q6 (게시판 + 쇼핑) | quest56-community/ | `/board` · `/shop` | Auth + 통합 사이트 |
| Q7+Q8 (Context + 대시보드) | quest78-prime/ | `/me` 문카페 | 듀오 AI + Before/After |

각 폴더의 README에서 상세 내용 확인.

## 에이전트 대화 (필수 제출)

5주차 작업 전체에 걸친 Claude / Claude Code 대화 기록.

### 5주차 기획·메타
| 파일 | 내용 |
|---|---|
| ![](screenshots/agent/%ED%80%98%EC%8A%A4%ED%8A%B8%20%EA%B8%B0%ED%9A%8D%EC%95%88%EC%9E%91%EC%84%B1.png) | 5주차 기획안 작성 — 8개 퀘스트 의존성 다이어그램 |
| ![](screenshots/agent/%ED%80%98%EC%8A%A4%ED%8A%B8%20%EC%A3%BC%EC%9E%AC%20%EB%B6%84%EB%A5%98.png) | 퀘스트 주제 분류 — 어떤 사이트로 통합할지 |
| ![](screenshots/agent/%ED%80%98%EC%8A%A4%ED%8A%B8%20%EC%BB%A8%EC%85%89%EC%A0%95%EC%9D%98.png) | 퀘스트 컨셉 정의 — 가상 사용자 / 톤 결정 |

### Q1~Q4 진행 대화
| 파일 | 내용 |
|---|---|
| ![](screenshots/agent/Quest01%20%EC%A7%84%ED%96%89.png) | Q1 Notion Assistant 작업 |
| ![](screenshots/agent/Quest02%20%EC%A7%84%ED%96%891.png) | Q2 Research Agent 작업 (1) |
| ![](screenshots/agent/Quest02%20%EC%A7%84%ED%96%892.png) | Q2 Research Agent 작업 (2) |
| ![](screenshots/agent/Quest03%20%EC%A7%84%ED%96%89.png) | Q3 Budget App 작업 |
| ![](screenshots/agent/Quest04%20%EC%A7%84%ED%96%89.png) | Q4 Budget Analyzer 작업 |

### Q5~Q8 진행 대화
- Q5+Q6: [`quest56-community/screenshots/agent/`](quest56-community/screenshots/agent/)
- Q7+Q8: [`quest78-prime/screenshots/agent/`](quest78-prime/screenshots/agent/)

## 작업 공간 구조

이 프로젝트는 두 GitHub 저장소에 동일 내용으로 존재:

| 저장소 | 용도 |
|---|---|
| `mmake7/harbor-school/week5/` (이 저장소) | 수업 검수용 |
| `mmake7/harbor-community/` | 라이브 배포용 (Vercel) |

## 5주차 회고
- ✅ Q5+Q6+Q7+Q8 한 사이트로 통합 (Vercel 12 함수 한도 중 4개 사용)
- ✅ 듀오 AI 캐릭터 (카페지기 + 달지기) Before/After 임팩트
- ✅ 라이브 배포 + 시크릿 모드 검증 완료
