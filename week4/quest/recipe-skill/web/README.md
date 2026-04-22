# 🏠 혼삶 (Honsam) — 웹 통합 앱 (Q2~Q7)

> 이 프로젝트는 루트 README의 일부입니다. [**전체 문서 보기 →**](../README.md)

Q2~Q7 통합 웹 앱(Vercel + Supabase + Claude API)의 소스 디렉터리입니다.
전체 컨셉·스크린샷·API 엔드포인트·DB 스키마·로컬 실행 가이드는 루트 README를 참고하세요.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-web--mauve--tau--65.vercel.app-000000?style=for-the-badge)](https://web-mauve-tau-65.vercel.app)

---

## 📁 이 폴더 구조

```
web/
├── api/                # 12 serverless functions (Q2~Q7)
├── db/                 # Supabase SQL 스키마
├── public/index.html   # SPA (React 18 CDN)
├── package.json
└── vercel.json
```

## 🚀 로컬 실행 (요약)

```bash
npm install
cp .env.example .env.local   # DATABASE_URL, ANTHROPIC_API_KEY, NOTION_TOKEN, NOTION_DATABASE_ID
npx vercel dev
```

> 상세 절차·환경변수·DB 스키마 적용 순서는 [루트 README](../README.md#-로컬-실행) 참고.
