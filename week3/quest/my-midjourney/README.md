# 🖼️ 한지 위의 먹그림

김홍도·신윤복 스타일의 전통 한국화를 AI가 그려주는 웹앱. 한지·족자·낙관까지 동양화 분위기로 감상.

## ⚠️ 실행 전 필수 설정

**API 키가 필요 없습니다.** [Pollinations.ai](https://pollinations.ai/)의 무료 API를 사용합니다.

### 실행

```bash
node server.js
```

브라우저에서 http://localhost:3000 접속.

> 별도의 `npm install`이나 `.env` 설정이 필요 없습니다.

## 🎯 주요 기능

- 🎨 **고정 화풍** — 사용자 입력 뒤에 김홍도·신윤복 스타일 프롬프트가 자동으로 붙음
- 🏞️ **4개 카테고리 예시** — 풍경/인물/동물/사물 클릭 시 예시 프롬프트 랜덤 자동 채움
- 📜 **족자 UI** — 상·하단 족자봉 + 한지 배경 + 빨간 끈 + 그림자 효과
- 🔴 **낙관 도장** — 붓글씨 캡션 옆에 CSS로 구현한 "홍도" 도장
- 🖼️ **갤러리** — 생성한 그림이 족자 형태로 쌓이고, 클릭 시 확대 모달
- 💾 **다운로드 + 초기화**

## 🛠️ 기술 스택

- **Node.js** (내장 `http` 모듈, 무의존성)
- **Pollinations.ai** (무료, API 키 불필요)
- **React 18 CDN** + **Babel Standalone** + **Tailwind CDN**
- 구글폰트 — Nanum Brush Script, Noto Serif KR, Gaegu

## 📸 동작 화면

`./screenshots/demo.png` 참고 (스크린샷 추가 예정)

## 📂 프로젝트 구조

```
my-midjourney/
├── server.js          # http 서버 + Pollinations URL 조립
├── index.html         # React CDN 단일 파일 UI + 족자 CSS
├── .gitignore
├── README.md
└── screenshots/       # 동작 화면 캡처 보관
```

## 💡 사용 팁

- 카테고리 예시를 **그대로 써도 되고, 수정해도 됩니다**. "경회루와 달빛" → "경회루와 달빛, 잉어 세 마리"처럼 덧붙이면 재밌어집니다.
- Pollinations는 같은 프롬프트라도 **seed** 값이 다르면 다른 그림이 나옵니다. 서버에서 자동으로 랜덤 seed를 붙이고 있어 같은 입력도 매번 달라집니다.
- 인물보다 **풍경·동물**이 동양화 화풍에 더 잘 어울립니다.

## ⚠️ 주의사항

- Pollinations는 무료지만 응답이 느릴 수 있습니다 (1~15초).
- 생성 결과는 AI 해석이라 실제 김홍도·신윤복 작품과는 다릅니다. 학습/감상 목적.
- 학습용 프로젝트입니다.

## 📝 라이선스

MIT
