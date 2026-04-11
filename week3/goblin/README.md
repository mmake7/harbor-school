# Week 3 · Goblin 프로젝트

3주차에 만든 소규모 자유 프로젝트 모음입니다.

## 📁 프로젝트 목록

### 🌤 [날씨앱](./날씨앱/)

OpenWeatherMap API를 사용한 도시별 날씨 검색 앱.

- **파일**: `날씨앱/index.html` (단일 파일)
- **기능**: 도시 이름 검색, 현재 온도 / 체감 온도 / 습도 / 한국어 날씨 설명 / 날씨 아이콘, 다크 테마 모바일 반응형
- **기술**: 순수 HTML / CSS / JavaScript (외부 라이브러리 없음)
- **API**: `https://api.openweathermap.org/data/2.5/weather` (`units=metric`, `lang=kr`)
- **실행**: 브라우저로 `index.html` 열기 → 도시 이름(영문 권장) 입력
- ⚠️ **학습용**: API 키가 파일 상단에 하드코딩되어 있습니다. 실제 서비스에서는 절대 이렇게 사용하지 마세요 (환경변수 또는 서버 사이드 프록시로 숨길 것).

### 🔭 [NASA뷰어](./NASA뷰어/)

NASA APOD(Astronomy Picture of the Day) API로 오늘의 천문 사진을 감상하는 뷰어.

- **파일**: `NASA뷰어/index.html` (단일 파일)
- **기능**: 오늘의 천문 사진 표시, 제목 / 설명 / 날짜, Noto Sans/Serif KR 폰트 타이포그래피
- **기술**: React 18 (CDN), 순수 HTML / CSS
- **API**: `https://api.nasa.gov/planetary/apod`
- **실행**: 브라우저로 `index.html` 열기
- ⚠️ **학습용**: NASA API 키가 파일 내에 하드코딩되어 있습니다.

### 🔴 [포켓몬검색](./포켓몬검색/)

React 프런트엔드 + Node.js 서버로 구성된 포켓몬 검색 앱.

- **파일**:
  - `포켓몬검색/index.html` — React + Tailwind CSS (CDN 기반) 검색 UI
  - `포켓몬검색/server.js` — Node.js 내장 `http` 모듈만 사용하는 무의존성 서버
- **기능**: 한글/영문 이름 부분일치 검색 (250ms 디바운스), 타입별 색상 뱃지, 반응형 그리드 카드 UI, 로딩 / 에러 / 빈 결과 상태 처리
- **데이터**: 5마리 하드코딩 (이상해씨, 꼬부기, 피카츄, 리자몽, 뮤츠)
- **API 엔드포인트**:
  - `GET /` — `index.html` 서빙
  - `GET /api/pokemons` — 전체 조회
  - `GET /api/pokemons/:id` — id로 단건 조회
  - `GET /api/pokemons/search?q=...` — 한글/영문 부분일치 검색
- **실행**:
  ```bash
  cd 포켓몬검색
  node server.js
  ```
  → http://localhost:3000 접속
