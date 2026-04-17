# 🎨 AI 별명 공방

Claude AI가 당신에게 꼭 맞는 재미있는 별명을 지어드립니다. 11가지 입력 항목 + 5가지 스타일로 파티클 애니메이션까지 곁들인 별명 생성기.

## ⚠️ 실행 전 필수 설정

이 프로젝트는 **Anthropic Claude API 키**가 필요합니다.

### 1단계 — API 키 발급

1. https://console.anthropic.com/settings/keys 접속
2. **Create Key** 클릭 → 키 복사 (`sk-ant-api03-...` 형식)

### 2단계 — 환경 변수 설정

```bash
cp .env.example .env
```

그 후 `.env` 파일을 열어 API 키 입력:

```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
```

### 3단계 — 실행

```bash
node server.js
```

브라우저에서 http://localhost:3000 접속.

> 별도의 `npm install`은 필요 없습니다. Node 내장 모듈만 사용합니다.

## 🎯 주요 기능

- 📝 **11가지 입력 항목** — 이름 + 성격, 취미, MBTI, 좋아하는 동물, 행운의 색/숫자, 직업, 판타지 직업, 낮/밤형, 자기소개 한 단어, 자주 하는 말
- 🎭 **5가지 스타일 그룹** — 🌸 귀여운 / ⚔️ 판타지 / 🏯 조선시대 / 🦁 동물 / 💼 직장인 밈
- 🃏 **별명 카드 5개** — 대표 이모지 + 이름 + 20자 의미 설명
- ✨ **파티클 애니메이션** — 선택 시 하트·별·꽃잎이 튀어나오며 금박 테두리 효과
- 📋 **원클릭 복사** — 토스트 메시지로 피드백
- 🔄 **다시 만들기** — 같은 정보·스타일로 새 별명 5개

## 🛠️ 기술 스택

- **Node.js** (내장 `http`, `https` 모듈, Express 없이)
- **Anthropic Claude API** (`claude-sonnet-4-20250514`)
- **React 18 CDN** + **Babel Standalone** + **Tailwind CDN**
- 자체 `.env` 파서 (dotenv 미사용)

## 📸 동작 화면

`./screenshots/demo.png` 참고 (스크린샷 추가 예정)

## 📂 프로젝트 구조

```
nickname-generator/
├── server.js          # http 서버 + Claude API 프록시 + JSON 파싱
├── index.html         # 3단계 위저드 (정보 → 스타일 → 결과) + 파티클
├── .env.example       # API 키 템플릿
├── .gitignore
├── README.md
└── screenshots/       # 동작 화면 캡처 보관
```

## 💡 사용 팁

- **필수는 이름 하나뿐**, 나머지는 선택이지만 많이 채울수록 개인화된 별명이 나옵니다.
- 같은 정보라도 **스타일을 바꾸면** 전혀 다른 느낌의 별명 — 5번 다 돌려보세요.
- Claude가 가끔 형식을 어길 수 있는데, 그럴 때는 "다시 만들기" 버튼으로 재시도하면 잘 나옵니다.

## ⚠️ 주의사항

- `.env` 파일은 절대 GitHub에 올리지 마세요 (API 키 노출 위험).
- 학습용 프로젝트입니다.

## 📝 라이선스

MIT
