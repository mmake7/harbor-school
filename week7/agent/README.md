# Week 7 · Agent

7주차 자동화 에이전트. 고블린 3종의 공통 패턴을 **config 기반으로 통합**.

---

## 프로젝트

### 🛠️ [static-visual-maker/](./static-visual-maker/) — A1

G1·G2·G3 세 고블린의 공통 코드를 `shared/` 4 모듈로 추상화한 통합 미니앱.

**3단계 UI**:
1. 비주얼 타입 선택 (YouTube 썸네일 / Instagram 카드 / 프로필 카드)
2. 톤 5개 노출, 톤별 "이 톤 생성" 버튼
3. 결과 그리드 (outputs 개수만큼) + 다운로드

**Shared 구조**:
- `tones.js` — 5톤 config (basePrompt + paletteHint)
- `visualTypes.js` — 3타입 config (additionalPrompt + outputs[])
- `imageGenerator.js` — OpenAI + sharp 통합
- `results.js` — 파일명 규칙 + generated/ 스캔

**확장성**:
- 새 톤 추가 = `tones.js` 객체 1개 push
- 새 비주얼 타입 추가 = `visualTypes.js` 객체 1개 push
- 코드 변경 0줄, 서버 재시작만으로 UI 자동 반영
- 추가 방법은 [USAGE.md](./static-visual-maker/USAGE.md)에 문서화

---

## 입력 → 추상화 → 출력

| 입력 (고블린) | 추상화 (A1) | 출력 |
|---|---|---|
| G1 톤·SUFFIX·사이즈 | `tones.js` + `visualTypes[0]` (YouTube) | 동일 결과 |
| G2 톤·SUFFIX·사이즈 | `tones.js` + `visualTypes[1]` (Instagram) | 동일 결과 |
| G3 톤·SUFFIX·사이즈 | `tones.js` + `visualTypes[2]` (Profile) | 동일 결과 |

G1·G2·G3 폴더는 **학습 비교용으로 그대로 보존** ([`../goblin/`](../goblin/)).
