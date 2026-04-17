# 2주차 — 웹 앱의 구조와 앱 유형별 실습

## 학습 목표
웹 애플리케이션(Web Application)의 구조를 이해하고, 앱 유형별(계산기/변환기) 실습을 통해 HTML, CSS, JavaScript, React의 기초를 익힌다.

---

## 1. 핵심 개념

### 웹 앱의 구조

```
브라우저 (Client)
├── HTML  → 구조 (뼈대)
├── CSS   → 스타일 (디자인)
└── JS    → 동작 (기능)
```

- **HTML**: 태그로 구조를 정의 (`<h1>`, `<p>`, `<div>`, `<input>` 등)
- **CSS**: 색상, 레이아웃, 반응형 (Flexbox, Grid, 미디어 쿼리)
- **JavaScript**: 이벤트 처리, DOM 조작, 데이터 저장(localStorage)

### React (SPA: Single Page Application)
- 하나의 `index.html` 파일에서 동적으로 화면을 구성
- **컴포넌트** 기반: 재사용 가능한 UI 단위
- **상태(State)** 관리: `useState`, `useEffect` 등의 Hook
- **CDN 기반**으로 빌드 도구 없이도 사용 가능 (Babel Standalone 사용)

### 개발자 도구 (DevTools)
- **Elements**: HTML 구조 확인 및 실시간 수정
- **Console**: JavaScript 실행 및 에러 확인
- **Network**: API 호출, 리소스 로딩 확인

### 앱의 10가지 유형 (실습한 유형)

| 유형 | 설명 | 실습 프로젝트 |
|------|------|--------------|
| **Calculation** | 입력값을 계산하여 결과 출력 | 나이 계산기, D-day 카운터, 더치페이, 세금 계산기 |
| **Transform** | 같은 정보를 다른 형태로 변환 | 색상 팔레트, 짤 메이커, QR 생성기, PDF 생성기 |

**"같은 정보, 다른 형태"** — 하나의 색상을 HEX, RGB, 시각적 스와치, CSS 변수로 **동시에** 표현하는 것이 Transform의 본질.

---

## 2. 실습 프로젝트 (고블린 — 필수)

### 나이계산기 (Calculation)
- **기술**: React 18 + Tailwind CSS (CDN)
- **기능**: 생년월일 입력 → 만 나이, 다음 생일까지 일수, 프로그레스 링, 총 일수/주수/개월, 별자리, 띠, 생일 축하 애니메이션
- **배운 점**: React 컴포넌트 분리 (Card, Button, StatCard, ProgressRing), useState/useEffect Hook

### D-day 카운터 (Calculation)
- **기술**: 순수 HTML + CSS + JavaScript
- **기능**: 목표 날짜 → 남은 일/시/분/초 실시간 카운트다운, D-day 전환, localStorage 저장
- **배운 점**: `setInterval`로 실시간 업데이트, `Date` 객체, localStorage 영속성

### 색상 팔레트 생성기 (Transform)
- **기술**: 순수 HTML + CSS + JavaScript
- **기능**: HEX 입력 또는 Color Picker → Tint 5개 + Shade 5개 생성, 클릭 시 클립보드 복사, CSS 변수 코드 자동 생성
- **배운 점**: HEX↔RGB 변환, Tint/Shade 알고리즘, 명도 기반 텍스트 색상 자동 결정

---

## 3. 실습 프로젝트 (퀘스트 — 도전)

- **더치페이 계산기** (Calculation) — N명 총액 분할 + 할인 기능
- **세금 시뮬레이터** (Calculation) — 소득·구간별 세금 계산
- **짤 메이커 / 밈 생성기** (Transform) — 이미지 + 상단/하단 텍스트 합성
- **QR 코드 생성기** (Transform) — 텍스트/URL → QR 이미지
- **PDF 생성기** (Transform) — HTML → PDF 변환

---

## 4. 기술 요약

### HTML 주요 태그
```html
<h1>~<h6>              <!-- 제목 -->
<p>                    <!-- 문단 -->
<a href="">            <!-- 링크 -->
<img src="" alt="">    <!-- 이미지 -->
<ul><li>               <!-- 목록 -->
<div>                  <!-- 구역 나누기 -->
<input>                <!-- 입력 필드 -->
<button>               <!-- 버튼 -->
```

### CSS 핵심 개념
```css
:root { --primary: #4f46e5; }   /* CSS 변수 */
display: flex;                   /* Flexbox */
display: grid;                   /* Grid */
@media (max-width: 768px) {}     /* 반응형 */
transition: all 0.3s ease;       /* 애니메이션 전환 */
@keyframes fadeIn {}             /* 키프레임 */
```

### JavaScript 핵심 패턴
```javascript
document.getElementById('id')           // DOM 선택
element.addEventListener('click', fn)   // 이벤트 리스너
localStorage.setItem('key', 'value')    // 데이터 저장
setInterval(fn, 1000)                   // 반복 실행
new Date()                              // 날짜 객체
navigator.clipboard.writeText(text)     // 클립보드 복사
```

### React 핵심 패턴
```jsx
const [state, setState] = useState(초기값)        // 상태 관리
useEffect(() => { /* 부수효과 */ }, [deps])        // 생명주기
function Component({ props }) { return <JSX /> }   // 컴포넌트
```

---

## 5. 2주차 총평

- "브라우저 안에서 완결되는" 앱을 만들어보는 주차
- 아직 서버는 없음 — 모든 것이 클라이언트에서 일어남
- CDN 방식으로 React를 쓰면서 "빌드가 꼭 필요한가?"라는 감각 획득
- 3주차부터는 외부 API / 서버 도입으로 넘어감
