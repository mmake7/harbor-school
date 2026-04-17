# 3주차 학습 복습 노트

> 3주차에 만든 모든 프로젝트를 한 문서에 정리.
> 프로젝트는 **단순 → 복잡**, **클라이언트 → 서버** 순으로 배열했다.

---

## 한눈에 보기

| # | 프로젝트 | 스택 | 서버 | 외부 API | 핵심 개념 |
|---|----------|------|------|----------|-----------|
| 1 | qr-code-gen | React+Vite | ✗ | ✗ | 상태관리, 라이브러리 활용 |
| 2 | open-weather | 바닐라 HTML/JS | ✗ | OpenWeather | fetch, API 키 |
| 3 | NASA APOD | React CDN | ✗ | NASA APOD | CDN React, 날짜 다루기 |
| 4 | pokemon-docs | React+Vite | ✗ | PokeAPI | 캐싱, useMemo, 비동기 |
| 5 | server-test | Node http | ✓ | ✗ | HTTP 서버 기초 |
| 6 | hellow-server | Node http | ✓ | ✗ | CRUD, 3파일 구조 |
| 7 | my-pokemon-docs | Node http + React CDN | ✓ | ✗ (내장 DB) | 서버에서 데이터 제공 |
| 8 | mental-chat v1 | Express + OpenAI | ✓ | OpenAI | AI API 연동 |
| 9 | mental-chat v2 | Node http + OpenAI | ✓ | OpenAI | .env 분리, 시스템 프롬프트 |

---

## 1. qr-code-gen — QR 코드 생성기

**무엇을 만들었나**
텍스트나 URL을 입력하면 QR 코드를 실시간으로 렌더링하고, PNG로 다운로드할 수 있는 웹앱.

**스택**
- React 18 + Vite
- `qrcode.react` 라이브러리

**학습 포인트**
- `useState`로 입력 상태 관리 (텍스트, 크기, 색상, 오류 복원 레벨)
- `useRef`로 canvas DOM 참조 → `toDataURL()`로 PNG 다운로드
- npm 패키지 설치와 임포트

**복습 질문**
- Vite의 역할은? `npm run dev`, `npm run build` 차이는?
- `useState`와 `useRef`를 언제 나눠 쓰는가?

---

## 2. open-weather — 날씨 조회 앱

**무엇을 만들었나**
도시명을 입력하면 OpenWeatherMap API로 현재 날씨/온도/습도/아이콘을 보여주는 단일 HTML 앱.

**스택**
- 순수 HTML + CSS + JavaScript (단일 파일)

**외부 API**
- `https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=metric&lang=kr`

**학습 포인트**
- 바닐라 JS `fetch()` + `async/await`
- API 키를 HTML에 하드코딩했을 때의 문제점 ← **나중에 서버로 분리하는 동기**가 됨

**복습 질문**
- 왜 API 키를 프론트엔드에 두면 안 되는가?
- `fetch`의 `.ok`와 `.status`는 어떻게 다른가?

---

## 3. NASA APOD — 오늘의 천체 사진

**스택**
- React 18 **CDN** (빌드 도구 없음!)
- Babel Standalone (브라우저에서 JSX 컴파일)

**외부 API**
- `https://api.nasa.gov/planetary/apod?api_key=...&date=YYYY-MM-DD`

**학습 포인트**
- **Vite 없이 React 쓰는 법**: script 태그로 `react`, `react-dom`, `@babel/standalone` 불러오고 `<script type="text/babel">` 안에 JSX 작성
- 날짜 state로 이전/다음 날 네비게이션

---

## 4. pokemon-docs — 포켓몬 도감 (클라이언트)

1세대 포켓몬 151마리를 PokeAPI에서 가져와 검색/필터링.

**외부 API**
- `https://pokeapi.co/api/v2/pokemon-species/{id}` — 한글 이름
- `https://pokeapi.co/api/v2/pokemon/{id}` — 스프라이트, 타입, 능력치

**학습 포인트**
- **두 개의 API를 조합**해서 하나의 카드 데이터 구성
- **캐싱 패턴**: 이미 요청한 포켓몬 데이터 재요청 방지
- `useMemo`로 검색 필터링 결과 메모이제이션
- 스켈레톤 UI

---

## 5. server-test — 노드 서버 첫걸음

Node `http` 모듈로 만든 최소 API 서버.

**엔드포인트**
- `GET /api/hello` — 인사
- `POST /api/echo` — 받은 JSON을 그대로 돌려줌

**학습 포인트**
- `http.createServer((req, res) => { ... })` 기본 형태
- `req.on('data')` + `req.on('end')`로 바디 읽기
- `res.writeHead(status, { 'Content-Type': ... })` + `res.end(body)`
- CORS 헤더 직접 세팅

---

## 6. hellow-server — CRUD API 서버

사용자/TODO를 인메모리로 관리하는 본격 CRUD API.

**학습 포인트**
- **RESTful 라우팅**: `GET /users`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`
- 라우트 파싱 직접 구현 (`/users/123` 에서 id 뽑기)
- 입력 검증 (필수 필드 체크)
- `crypto.randomUUID()`로 ID 생성
- 3파일 구조 (server.js + index.html + client.js)

---

## 7. my-pokemon-docs — 포켓몬 도감 (서버 버전)

같은 포켓몬 도감이지만, **내가 만든 Node 서버가 데이터를 제공**. 프론트는 내 서버에만 요청.

**서버 라우트**
- `GET /api/pokemons` — 전체 목록
- `GET /api/pokemons/search?q=...` — 검색
- `GET /` → `index.html` 서빙

**학습 포인트**
- 클라이언트가 외부 API를 직접 호출하지 않고 **내 서버를 경유**하는 패턴
- 같은 도메인에서 정적 파일 + API 동시 제공 → CORS 문제 없음

---

## 8. mental-chat v1 — AI 심리상담 챗봇

**스택**
- **Express** (← 처음으로 http 모듈 대신 프레임워크 사용)
- OpenAI SDK
- `dotenv`로 환경변수 관리

**학습 포인트**
- **Express 편의성**: `app.get()`, `app.post()`, `app.use(express.json())`, 정적 서빙 한 줄
- OpenAI chat completions API: `{ model, messages: [{role, content}, ...] }`
- **시스템 프롬프트 설계**: 반영적 경청, 진단 금지, 위기 상황 안내(1393)
- 대화 히스토리 유지 (멀티턴)

---

## 9. mental-chat v2 (My ChatGPT) — 무의존성 리메이크

같은 심리상담 챗봇을 **Express 없이 Node `http` 모듈로 다시 구현**.

**스택**
- Node `http` (무의존성)
- OpenAI API를 **내장 `fetch`로 직접 호출** (SDK 없음, Node 18+)
- 직접 구현한 `.env` 로더 (dotenv 패키지 없이)

**학습 포인트**
- **Express 없이** 라우팅/바디 파싱/정적 서빙을 전부 손으로 구현
- **OpenAI SDK 없이** Node 내장 `fetch`로 API 호출
- **`.env` 분리**:
  - 처음엔 하드코딩 → 환경변수 우선 + fallback → **fallback 제거**, `.env`만 사용
  - 키 없으면 `process.exit(1)`로 즉시 종료
- `.env.example` 템플릿 파일
- **안전 가이드라인**: 자해/자살 암시 시 1393 등 전문 기관 연결

---

## 이번 주 퀘스트 3종 (week3/quest/)

### My Midjourney — 한지 위의 먹그림
- Pollinations.ai(무료, API 키 불필요)로 이미지 생성
- 고정된 화풍 프롬프트(김홍도·신윤복 스타일)를 사용자 입력 뒤에 붙여 전달
- 족자 형태 UI + 낙관 도장 CSS

### AI 별명 공방 (nickname-generator)
- Anthropic Claude API 연동 (claude-sonnet-4-20250514)
- 3단계 위저드: 정보 입력 → 스타일 선택 → 결과
- 5가지 스타일(귀여운/판타지/조선/동물/직장인)
- 파티클 애니메이션으로 선택 UX

### 달빛 서당 (study-agent, 이 프로젝트)
- 1~3주차 수업 자료 전체를 시스템 프롬프트로 주입
- 세션 메모리로 이전 대화 맥락 유지
- 달빛 선녀 페르소나 (무당 스타일 학문 스승)

---

## 전체 학습 흐름

```
[클라이언트 전용]
1. qr-code-gen        → React + Vite 기본기
2. open-weather       → 바닐라 JS + 외부 API
3. NASA APOD          → CDN React (빌드 없이)
4. pokemon-docs       → Vite + 복잡한 비동기/캐싱

       ↓ "API 키를 숨기려면?"
       ↓ "서버가 필요하다"

[서버 도입]
5. server-test        → Node http 첫걸음
6. hellow-server      → CRUD API 설계
7. my-pokemon-docs    → 클라-서버 통합 (3파일 구조)

       ↓ "AI를 붙여보자"

[AI API 연동]
8. mental-chat v1     → Express + OpenAI SDK
9. mental-chat v2     → http 모듈만으로 재구현, 보안까지 챙김

       ↓ "실전 응용"

[퀘스트 3종]
- My Midjourney (이미지 생성)
- AI 별명 공방 (구조화된 JSON 응답)
- 달빛 서당 (컨텍스트 주입 + 세션 메모리)
```

**"브라우저 안에서만 → 서버 도입 → 외부 AI 연동 → 보안/운영 고려"** 라는 자연스러운 난이도 상승 곡선.

---

## 핵심 개념 총정리

### React
- `useState`, `useEffect`, `useRef`, `useMemo` 각각의 용도
- Vite vs CDN React (빌드 도구 유무)
- JSX가 결국 `React.createElement`로 변환된다는 것

### HTTP & 서버
- HTTP 메서드: GET/POST/PUT/PATCH/DELETE
- 상태 코드: 200/201/400/401/403/404/500/502
- Content-Type 헤더의 역할
- CORS가 왜 생겼고, 어떻게 풀어주는가
- Node `http` 모듈 vs Express
- JSON 바디 파싱 (`req.on('data')` vs `express.json()`)

### API 연동
- `fetch` + `async/await`
- 에러 처리 (`res.ok`, try/catch)
- API 키는 **절대** 프론트엔드에 두지 않는다
- **프록시 서버 패턴**: 클라이언트 → 내 서버 → 외부 API

### 보안
- `.env` + `.gitignore`
- 하드코딩된 fallback의 위험성
- 키 노출 시 **즉시 폐기(rotate)**

### OpenAI / Claude LLM
- `messages` 배열 구조 (`system`/`user`/`assistant`)
- 시스템 프롬프트로 페르소나/금지사항/안전장치 설정
- 멀티턴 대화 = 히스토리를 매 요청마다 전부 보냄
- `temperature`, `model`, `max_tokens` 같은 파라미터
- Claude API는 `system`이 별도 필드, OpenAI는 `messages[0]`에 role=system

---

## 스스로 던져볼 만한 심화 질문

1. `pokemon-docs`에서 매번 151개를 순차 요청하는 대신 `Promise.all`로 병렬화하면 어떻게 될까? 서버에 부담은?
2. `hellow-server`의 인메모리 스토어를 파일로(`fs.writeFile`) 저장하면 어떤 문제가 생기나? (동시성, 성능)
3. `mental-chat`에서 대화가 길어질수록 LLM에 보내는 토큰이 계속 늘어난다. 어떻게 줄일 수 있나? (요약, 최근 N개만 유지)
4. 직접 만든 `.env` 로더 대신 `dotenv` 패키지를 쓸 때의 장단점은?
5. 위기 상황 감지는 시스템 프롬프트에만 맡겨도 충분한가? 별도 키워드 필터를 두면?
6. 이 챗봇을 누가 쓰든 같은 대화를 공유하지 않으려면 어떤 설계가 필요한가? (세션 ID, 사용자 인증)

---

## 다음 주차로 넘어갈 때 챙길 것

- 지금은 전부 인메모리 — **데이터베이스** (SQLite, PostgreSQL)를 붙이면?
- 지금은 인증이 없음 — 로그인/JWT를 어떻게 추가하나?
- 스트리밍 응답 (`stream: true`)으로 LLM 응답을 한 글자씩 표시하려면?
- 프론트에 라우팅 (React Router, 또는 해시 라우팅)
- 배포 (Vercel, Railway, Render 등)
