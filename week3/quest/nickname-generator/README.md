# 🎨 AI 별명 공방

Claude AI가 당신에게 꼭 맞는 재미있는 별명을 지어드립니다.

## 기능

- 11가지 입력 항목으로 개성 파악
- 5가지 스타일 그룹 (귀여운/판타지/조선/동물/직장인)
- 별명 5개 생성 + 대표 이모지 + 의미 설명
- 파티클 애니메이션으로 선택
- 원클릭 복사

## 실행

1. `.env`에 `ANTHROPIC_API_KEY` 입력
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxx
   ```
2. `node server.js`
3. http://localhost:3000 접속

## 기술 스택

- Node.js (http 모듈, 무의존성)
- Anthropic Claude API (claude-sonnet-4-20250514)
- React CDN + Babel Standalone + Tailwind CDN

## 구조

```
nickname-generator/
├── server.js        # http 서버 + Claude API 프록시
├── index.html       # 3단계 위저드 UI
├── .env             # API 키 (커밋 금지)
├── .env.example     # 템플릿
├── .gitignore
└── README.md
```

## 주의

- `.env`는 `.gitignore`에 들어있어 커밋되지 않는다.
- API 키가 없으면 서버가 즉시 종료된다 (`process.exit(1)`).
