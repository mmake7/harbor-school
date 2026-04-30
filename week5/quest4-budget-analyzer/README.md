# Q4 — PRIME / Insight
가계부 분석 비서 (월간 리포트 + 대화형)

## 📌 폴더 안내

Q4 분석 비서는 Q3 가계부 앱과 같은 사이트로 통합 운영됩니다.
- 코드: [`../quest3-budget-app/api/analyze.js`](../quest3-budget-app/api/analyze.js)
- 화면: Q3 사이트의 "AI 분석" 섹션
- 배포 URL: (Q3와 동일) https://harbor-school-mmake7-3440s-projects.vercel.app/

이유: 5주차 PPT 기획안의 단일 Vercel 프로젝트 정책 + 사용자 경험 자연스러움

## 🎯 미션 충족 증거

### 필수 제출물 — 조회·분석·조언 SS 각 1
| 미션 항목 | SS 위치 |
|---|---|
| 조회 SS | [`../quest3-budget-app/screenshots/q4/01-overview.png`](../quest3-budget-app/screenshots/q4/01-overview.png) |
| 분석 SS | [`../quest3-budget-app/screenshots/q4/02-monthly-report.png`](../quest3-budget-app/screenshots/q4/02-monthly-report.png) |
| 조언 SS | [`../quest3-budget-app/screenshots/q4/03-advice.png`](../quest3-budget-app/screenshots/q4/03-advice.png) |
| 대화 SS (보너스) | [`../quest3-budget-app/screenshots/q4/04-chat.png`](../quest3-budget-app/screenshots/q4/04-chat.png) |

### 보너스 — 월간 리포트 / 등급
- ✅ 월간 리포트: 4축 분석 (현금흐름·카테고리·시간패턴·등급+조언)
- ✅ 등급: A+ ~ F (저축률·패턴 안정성 기반)
- 분석 결과: A 등급 받음 (저축률 61.7%, 고정비 관리 탁월)

### 차별화
1. **할루시 방지 검증 통과**: "데이터에 없는 정보는 솔직히 모른다고 답변"
   (예: "이번 달 카페 얼마?" → "그 정보는 데이터에 없어" + 미래 개선 제안)
2. **대화형 후속 질문**: AI가 다음 질문 2개 자동 추천
3. **DB 캐시**: 월 1회 호출 = 사실상 무료 (1회 ≈ ₩11)

## 🔧 기술 스택

- 모델: Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- 방식: Pre-aggregated 데이터 + 시스템 프롬프트
- 출력: JSON 구조화 (등급·4축·후속질문)
- 캐시: app.budget_analyses 테이블 (Supabase)

## 📊 토큰 사용량

- 월간 리포트 1회: ~4,300 토큰 ≈ ₩11
- 대화형 1회: ~3,300 토큰 ≈ ₩6
- 월 100회 채팅 시: ~₩600 (커피값의 6%)
