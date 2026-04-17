# 🖼️ 한지 위의 먹그림 — AI 동양화 생성기

김홍도·신윤복 스타일의 전통 한국화를 AI가 그려주는 웹앱

## 사용법

1. 카테고리 선택 (풍경/인물/동물/사물)
2. 예시 프롬프트가 자동 채워짐 (수정 가능)
3. "그리기" 버튼 클릭
4. 족자 위에 올려진 그림 감상

## 실행

```bash
node server.js
```

브라우저에서 http://localhost:3000 접속

## 기술 스택

- Node.js (http 모듈, 무의존성)
- Pollinations.ai (무료, API 키 불필요)
- React CDN + Babel Standalone
- Tailwind CDN

## 구조

```
my-midjourney/
├── server.js     # Node http 서버 + Pollinations URL 생성
├── index.html    # React CDN 단일 파일 UI
├── .gitignore
└── README.md
```

## 화풍 (고정)

모든 이미지는 사용자 프롬프트 뒤에 아래 스타일 프롬프트가 붙어 Pollinations에 전달된다:

> Korean traditional ink painting on hanji paper, Kim Hong-do and Shin Yun-bok style, 18th century Joseon dynasty, black ink brush strokes with subtle color washes, elegant and minimal composition, traditional East Asian aesthetic, soft beige hanji paper background, refined brushwork, clear ink lines
