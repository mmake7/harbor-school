# 📋 4주차 퀘스트 제출 가이드

## 통합 프로젝트

Q1, Q2, Q3를 하나의 프로젝트로 통합 구현했습니다.

- **Live Demo**: https://web-mauve-tau-65.vercel.app
- **GitHub**: https://github.com/mmake7/harbor-school/tree/main/week4/quest/recipe-skill

## 제출 포인트별 증빙

### Q1 — Skill
- `ingredients/*.json` — 재료 파일 10개
- `.claude/skills/recipe/SKILL.md` — Skill 정의
- `recipes/*.md` — 생성된 레시피 마크다운
- `web/screenshots/q1-skill-*.png` — Skill 실행 스크린샷

### Q2 — Server + DB
- `web/api/ingredients.js` — CRUD API
- `web/public/index.html` — 관리 UI
- Supabase `fridge_ingredients` 테이블
- `web/screenshots/q2-*.png` — 재료 관리 화면

### Q3 — Server + DB + AI
- `web/api/recipe.js` — AI 레시피 생성 API
- Supabase `fridge_recipes` 테이블
- 히스토리 탭
- `web/screenshots/q3-*.png` — AI 레시피 생성 화면
