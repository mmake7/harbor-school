# Q4 — PRIME / Insight

## 📌 안내

Q4 분석 비서는 Q3 가계부 앱과 통합 운영됩니다.
- 코드: [`../quest3-budget-app/`](../quest3-budget-app/)
- 배포: 같은 Vercel 프로젝트 (단일 사이트)
- 자세한 내용: [quest3-budget-app README](../quest3-budget-app/README.md)

## 🎯 Q4 핵심

- 컨셉: PRIME / Insight (월간 리포트 + 대화형 비서)
- 미션 충족:
  - 조회·분석·조언 SS: [`../quest3-budget-app/screenshots/q4/`](../quest3-budget-app/screenshots/q4/)
  - 보너스: 등급 (A~F), 월간 리포트, 대화형 답변
- 차별화: 할루시 방지 검증 (데이터에 없으면 "없다" 정직 답변)

## 🔧 기술 스택

- Claude Haiku 4.5 (분석 모델)
- Pre-aggregated 데이터 + 시스템 프롬프트
- DB 캐시 (월 1회 호출, 비용 ≈ ₩11)
- 출력: JSON 구조화 (등급, 4축 분석, 후속 질문)
