# 🌙 달빛 서당 — AI 수업 질문 에이전트

harbor.school AI 수업 내용을 기억하는 **달빛 선녀**가 질문에 답해드립니다.

## 기능

- **1~3주차 수업 전체 컨텍스트**를 시스템 프롬프트로 주입
- **세션 메모리**로 이전 대화 맥락 유지 (localStorage + 서버 인메모리)
- **달빛 선녀 페르소나** — 따뜻한 무당 스타일 말투의 학문 스승
- 텍스트 자료 + 실습 코드 예제 모두 참조
- 빠른 질문 버튼 (1주차/2주차/3주차 주제별)
- 코드 블록 자동 렌더링 + 복사
- 1시간 미사용 세션 자동 정리

## 실행

1. `.env`에 `ANTHROPIC_API_KEY` 입력
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxx
   ```
2. `node server.js`
3. http://localhost:3000 접속

## 기술 스택

- Node.js (http + https 모듈, 무의존성)
- Anthropic Claude API (claude-sonnet-4-20250514)
- React CDN + Babel Standalone + Tailwind CDN

## 구조

```
study-agent/
├── server.js              # http 서버 + 컨텍스트 로더 + 세션 관리
├── index.html             # 달빛 서당 React UI
├── .env                   # API 키 (커밋 금지)
├── .env.example           # 템플릿
├── .gitignore
├── README.md
└── context/
    ├── week1.md           # 1주차 — 개발 환경 + 에이전트 퀘스트
    ├── week2.md           # 2주차 — 웹 앱 구조 + 계산기/변환기
    ├── week3.md           # 3주차 — 서버 + AI API 연동 (REVIEW 기반)
    └── code-examples.md   # 수업 실습 코드 9가지 패턴
```

## API 엔드포인트

- `POST /api/chat` — `{ sessionId?, message }` → `{ sessionId, answer }`
- `POST /api/reset` — `{ sessionId }` → 해당 세션 초기화
- `GET  /api/health` — 서버 상태, 세션 수, 컨텍스트 글자 수

## 동작 원리

1. 서버 시작 시 `context/*.md`를 모두 읽어 하나의 거대한 시스템 프롬프트로 조립.
2. 클라이언트가 `/api/chat`으로 질문 → `sessionId`로 히스토리 조회.
3. 히스토리 전체를 Claude API에 전달 (멀티턴).
4. 응답을 히스토리에 누적 후 반환.
5. `sessionId`는 브라우저 localStorage에 저장되어 새로고침해도 이어짐.

## 주의

- `.env`는 `.gitignore`로 커밋 제외됨.
- API 키가 없으면 서버가 즉시 종료됨 (`process.exit(1)`).
- 세션은 **인메모리**라 서버 재시작 시 전부 소실됨.
- 컨텍스트가 길어지면 토큰 비용이 증가 — 실제 운영이라면 RAG나 컨텍스트 요약이 필요.
