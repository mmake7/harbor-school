# Week 5 — PRIME

harbor.school 5주차 작업 공간.

## 컨셉

**PRIME** — 흩어진 정보를 모아 패턴으로 응축하는 개인 운영 시스템.
- **Notes** (회고·학습 기록) — 매일·매주·주제별 단방향 누적
- **Radar** (Deep Dive 리서치) — 1차 출처 직접 방문 + 4축 구조 정리
- **Spend** (가계부) — 수입·지출 입력 / 카테고리별 통계 / KST 일관 처리

흑백 미니멀 컨셉 일관성 유지.

## 폴더 구조

```
week5/
├── plan/                                기획안
│   └── PRIME_Week5_Plan.pptx            (16장, 흑백 미니멀)
├── quest1-notion-assistant/             Q1 — PRIME / Notes (회고 비서)
│   ├── README.md
│   ├── notes/                           (확장 예약)
│   └── screenshots/                     (5장)
├── quest2-research-agent/               Q2 — PRIME / Radar (Deep Dive 리서치)
│   ├── README.md
│   ├── research/                        리서치 .md (2건)
│   ├── insights/                        1페이지 전략 인사이트 (1건)
│   └── screenshots/                     (5장)
└── quest3-budget-app/                   Q3 — PRIME / Spend (가계부 앱)
    ├── README.md
    ├── api/budget.js                    Vercel 함수 1개, ?view= 분기
    ├── lib/datetime.js                  KST 헬퍼
    ├── public/index.html                흑백 미니멀 SPA
    ├── sql/{schema,seed}.sql            12 expense + 4 income 카테고리
    ├── scripts/{apply,test-conn}.js     로컬 DB 적용·검증
    ├── dev-server.js                    로컬 Express wrapper
    ├── vercel.json                      배포 설정
    └── test-screenshots/                Playwright E2E SS (5장)
```

## 진행 현황 (2026-04-30 기준)

| 항목 | 상태 |
|---|---|
| 기획안 PPT 16장 (흑백 미니멀) | ✅ 완료 |
| Q1 — Notion MCP OAuth 셋업 | ✅ 완료 |
| Q1 — 회고 시스템 뼈대 (4폴더 + 5항목) | ✅ 완료 |
| Q1 — 자기 진화 1회 (4 → 5항목) | ✅ 완료 |
| Q2 — Playwright MCP 셋업 | ✅ 완료 |
| Q2 — 폐쇄망 LLM Deep Dive | ✅ 완료 |
| Q2 — 엣지 sLLM × 농축산 Deep Dive | ✅ 완료 |
| Q2 — 1페이지 전략 인사이트 추출 | ✅ 완료 |
| Q3 — DB 스키마 v2 + apply.js 검증 | ✅ 완료 |
| Q3 — Vercel 함수 + KST 헬퍼 + curl 4종 검증 | ✅ 완료 |
| Q3 — 흑백 미니멀 SPA + Playwright E2E 5/5 PASS | ✅ 완료 |
| Q3 — Vercel 배포 (GitHub 연동) | ✅ 완료 — https://harbor-school-mmake7-3440s-projects.vercel.app/ |
| Q3 — 배포본 Playwright E2E 5/5 PASS | ✅ 완료 |
| Q4~ | ⏳ 예정 |

자세한 내용은 각 quest README 참조:
- [`quest1-notion-assistant/README.md`](./quest1-notion-assistant/README.md)
- [`quest2-research-agent/README.md`](./quest2-research-agent/README.md)
- [`quest3-budget-app/README.md`](./quest3-budget-app/README.md)
