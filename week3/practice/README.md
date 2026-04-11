# OpenWeatherMap 날씨 앱

OpenWeatherMap API를 사용한 간단한 날씨 검색 앱입니다.

## ⚠️ 학습용 프로젝트

- 이 프로젝트는 **수업 학습용**으로 제작되었습니다.
- `weather-app.html` 상단에 **API 키가 그대로 노출되어 있습니다.**
- 실제 서비스나 공개 저장소에서는 **절대 이렇게 사용하지 마세요.**
- 실무에서는 API 키를 환경변수 또는 서버 사이드 프록시로 숨겨야 합니다.

## 사용 방법

1. [OpenWeatherMap](https://openweathermap.org/api)에서 무료 API 키를 발급받습니다.
2. `weather-app.html` 파일을 열고 상단의 `const API_KEY = "여기에_키"` 부분에 본인의 키를 붙여넣습니다.
3. 브라우저로 `weather-app.html` 파일을 엽니다.
4. 도시 이름(영문 권장, 예: `Seoul`, `Tokyo`, `New York`)을 입력하고 검색합니다.

## 기능

- 도시 이름 검색 (Enter 또는 검색 버튼)
- 현재 온도 / 체감 온도 / 습도 표시
- 한국어 날씨 설명 (`lang=kr`)
- 날씨 아이콘 이미지
- 도시 없음 / 네트워크 에러 처리
- 다크 테마 + 모바일 반응형 카드 UI

## API 정보

- Endpoint: `https://api.openweathermap.org/data/2.5/weather`
- Params: `q={도시명}`, `appid={API_KEY}`, `units=metric`, `lang=kr`
- Icon: `https://openweathermap.org/img/wn/{icon}@2x.png`

## 기술 스택

- 순수 HTML / CSS / JavaScript (단일 파일)
- 외부 라이브러리 없음
