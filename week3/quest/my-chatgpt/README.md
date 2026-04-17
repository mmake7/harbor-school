# 🌙 달빛 선녀 AI 상담사

따뜻한 무당 스타일 말투로 마음을 읽어주는 AI 영적 상담사. 달빛 아래에서 고민을 털어놓을 수 있는 1:1 대화형 챗봇.

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

- 🌙 **달빛 테마** — 남색/보라 그라데이션 배경, 반짝이는 별, 빛나는 달
- 💬 **따뜻한 상담** — 반영적 경청, 재확인, 대화 흐름 이어가기
- ⌨️ **단축키** — Enter 전송, Shift+Enter 줄바꿈
- 🔄 **대화 초기화** — 새로운 마음으로 다시 시작
- ⏳ **타이핑 인디케이터** — "달빛 선녀가 마음을 읽고 있어요..."
- 📱 **모바일 반응형**

## 🛠️ 기술 스택

- **Node.js** (내장 `http`, `https`, `fs` 모듈만 사용 / Express 미사용)
- **Anthropic Claude API** (`claude-sonnet-4-20250514`)
- **React 18 CDN** + **Babel Standalone**
- 자체 `.env` 파서 (dotenv 미사용)

## 📸 동작 화면

`./screenshots/demo.png` 참고 (스크린샷 추가 예정)

## 📂 프로젝트 구조

```
my-chatgpt/
├── server.js          # http 서버 + Claude API 프록시 + .env 로더
├── index.html         # React CDN 단일 파일 UI
├── .env.example       # API 키 템플릿
├── .gitignore
├── README.md
└── screenshots/       # 동작 화면 캡처 보관
```

## 💡 사용 팁

- 첫 메시지는 편하게 — "요즘 좀 지쳐요" 같은 한 마디로 시작해도 됩니다.
- 위기 상황(자해/자살 암시)에서는 달빛 선녀가 **자살예방상담전화 1393**을 안내합니다.
- 대화가 길어지면 토큰 비용이 올라가니, 주제가 바뀌면 🔄 버튼으로 새로 시작하세요.

## ⚠️ 주의사항

- `.env` 파일은 절대 GitHub에 올리지 마세요 (API 키 노출 위험).
- 본 서비스는 **교육·체험 목적**의 프로젝트이며, 실제 의료·심리 상담을 대체할 수 없습니다.
- 위기 상황에서는 반드시 **자살예방상담전화 1393** 또는 **정신건강위기상담 1577-0199**로 전문가의 도움을 받으세요.

## 📝 라이선스

MIT
