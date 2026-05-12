# USAGE — 새 톤·새 비주얼 타입 추가하기

Static Visual Maker는 톤·비주얼 타입을 **config 객체**로 분리해놓아서, 새 항목 추가가 **객체 한 개 push**로 끝난다.

코드 변경은 **0줄**. 서버 재시작만 하면 UI에 자동으로 나타남.

---

## 1. 새 톤 추가

`shared/tones.js`의 `TONES` 배열에 객체 push.

### 예: TONE_6 "Warm Forest" 추가

```js
// shared/tones.js
const TONES = [
  // ... 기존 5개
  {
    id: 'TONE_6_WARM_FOREST',                       // ⚠️ 정규식 매치 필요 — 아래 규칙 참조
    label: 'Warm Forest',                            // UI에 표시될 한글/영문 이름
    summary: '늦가을 숲, 따뜻한 황금빛, 낙엽',         // 한 줄 요약 (한글 OK)
    basePrompt: "Cinematic YouTube thumbnail background, late autumn forest scene, warm golden hour light filtering through tall pines, scattered fallen leaves, soft bokeh depth, mood: peaceful golden warmth, no text, no people, painterly atmosphere",
    paletteHint: { primary: '#8B6914', accent: '#D4A050' }
  }
];
```

### 톤 ID 명명 규칙 (반드시 지킬 것)

`shared/results.js`의 파일명 정규식이 다음 패턴을 매치한다:

```regex
^(TONE_\d+_[A-Z_]+)__([a-z0-9-]+)__([a-z0-9-]+)_(\d+)x(\d+)\.png$
```

따라서 톤 ID는:
- `TONE_` 접두사 + 숫자 + `_` + 대문자/언더스코어
- 예: `TONE_6_WARM_FOREST` ✅ / `tone_6_warm_forest` ❌ / `WARM_FOREST_6` ❌

### basePrompt 작성 팁

- 영문 (모델이 영문 프롬프트에 더 잘 반응)
- 끝에 SUFFIX 자동 append되니까 톤 자체 묘사만 작성
- `, no text` `, no people` `, no logos` 같은 안전장치 권장

### 서버 재시작
```powershell
# Ctrl+C 후
node server.js
```
브라우저 새로고침 → 톤 카드에 자동으로 6번째 항목 등장.

---

## 2. 새 비주얼 타입 추가

`shared/visualTypes.js`의 `VISUAL_TYPES` 배열에 객체 push.

### 예: "Twitter 카드 1200×675" 추가

```js
// shared/visualTypes.js
const VISUAL_TYPES = [
  // ... 기존 3개
  {
    id: 'twitter-card',                              // ⚠️ kebab-case (정규식 매치)
    label: 'Twitter 카드',
    summary: '가로 1200×675 (Twitter 표준)',
    compositionHint: '가로 카드, 16:9에 가까운 비율',
    additionalPrompt: ', social media share preview composition, balanced visual interest',
    outputs: [
      {
        name: 'landscape',                            // ⚠️ kebab-case 또는 단일 단어
        finalSize: '1200x675',                        // 최종 출력 사이즈
        modelSize: '1536x1024',                       // gpt-image-1 호출 사이즈 (지원: 1024x1024, 1024x1536, 1536x1024)
        crop: { left: 0, top: 91, width: 1536, height: 842 }   // sharp.extract — 1.78:1 비율 추출
      }
    ]
  }
];
```

### 타입 ID 명명 규칙

- 영문 소문자 + 숫자 + 하이픈만
- 예: `twitter-card` ✅ / `Twitter_Card` ❌ / `twitter card` ❌

### crop 계산 공식

`gpt-image-1`은 1024×1024 / 1024×1536 / 1536×1024 세 가지만 지원. 다른 비율은 sharp으로 잘라야 함.

```
목표 사이즈: W × H
선택할 modelSize: W/H 비율이 가까운 거 (가로비율 1.5 이상이면 1536×1024)

crop 계산 (가로용 1536×1024 → W×H 비율로 자르기):
  ratio = W / H
  new_h = 1536 / ratio          // 가로 1536에 맞춘 새 세로
  top = (1024 - new_h) / 2      // 상하 균등 crop
  crop = { left: 0, top, width: 1536, height: new_h }
```

세로용은 좌우 crop (left·width 조정), 정사각형은 crop 없이 `crop: null`.

### outputs 배열

- 1개 → 톤당 1장 (Instagram, 프로필 등)
- 2개 → 톤당 2장 동시 생성 (YouTube 가로+세로처럼)
- N개 → N장 병렬 생성

### additionalPrompt

비주얼 타입별 SUFFIX. 빈 문자열도 OK (YouTube 썸네일이 그 예).

콤마(`,`)로 시작하는 게 좋음 — 톤 basePrompt 끝에 자연스럽게 연결.

### 서버 재시작
브라우저 새로고침 → 1단계 타입 선택 카드에 새 타입 자동 등장.

---

## 3. 동작 확인 체크리스트

새 항목 추가 후 다음 순서로 검증:

1. `node server.js` 재시작
2. `curl http://localhost:3000/api/tones` 또는 `/api/visual-types` → 새 항목 포함되는지
3. 브라우저 새로고침 → UI에 등장하는지
4. 스모크 1장 생성 → 파일명 규칙 매치되는지 (`generated/` 폴더 확인)
5. 페이지 새로고침 → `/api/results` 자동 로드 동작하는지

---

## 4. 안 건드릴 것

- `server.js` — 라우트 변경 불필요. config만 추가하면 자동으로 흡수.
- `client.js` — UI도 자동. 다만 outputs가 3개 이상이면 grid 컬럼 수 조정 필요할 수 있음 (`ToneCard`의 `cols` 변수).
- `shared/imageGenerator.js` — 모델·sharp 호출 로직. config로 모든 분기 처리.
- `shared/results.js` — 파일명 정규식. 위 명명 규칙 지키면 안 건드려도 됨.

이 4개 파일을 손봐야 한다면 **추상화 한계**에 도달한 것 — 그 시점에 구조 재검토.

---

## 5. 자주 묻는 시나리오

### Q. 톤의 basePrompt만 일부 수정하고 싶다
`shared/tones.js`의 해당 객체 `basePrompt` 직접 수정 → 재시작.

### Q. SUFFIX만 살짝 바꾸고 싶다
`shared/visualTypes.js`의 해당 객체 `additionalPrompt` 수정 → 재시작.

### Q. 기존 결과물은 어떻게 되나?
`generated/` 폴더의 파일은 그대로 유지. 새 설정으로 재생성하면 같은 파일명에 덮어쓰기.

### Q. 새 톤 추가 후 기존 타입에서도 자동으로 보여지나?
응. 타입↔톤은 독립적. 새 톤은 모든 타입의 2단계 톤 그리드에 등장.

### Q. 톤을 삭제하면?
`TONES` 배열에서 객체 제거 → 재시작. `generated/`에 남은 파일은 `/api/results`에서 노출되지만 더는 재생성 불가.
