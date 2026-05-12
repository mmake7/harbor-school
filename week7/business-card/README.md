# 명함 디자인 — DAONi (Q3)

박인수 (DAONi / 다온이) 명함. **HTML+CSS → Puppeteer 렌더 → PNG·PDF 출력**. 6차 디자인 사이클 거쳐 최종 확정.

---

## 출력

- [output/front.png](./output/front.png) — 앞면 300dpi (단톡방 공유용)
- [output/back.png](./output/back.png) — 뒷면 300dpi (단톡방 공유용)
- [output/business-card.pdf](./output/business-card.pdf) — 인쇄용 합본 (90×54mm + 3mm 블리드)

---

## 명함 사양

| 항목 | 값 |
|---|---|
| 사이즈 | 90×54mm + 3mm 블리드 = 96×60mm |
| 면 | 앞면 + 뒷면 (2장) |
| 톤 | **Tech Minimal + 한지** (자연 × 첨단 융합) |
| 폰트 | Inter (영문 Light 300 / Bold 700), Pretendard Variable (한글 Light 300 / Medium 500) — 명조 없이 고딕만 |
| 컬러 | 한지 `#F5F1E8` / 먹 `#1A1A1A` / 골드 `#B8946B` (태그라인 강조만) |

### 앞면 — 4-블록

- **좌상 브랜드**: DAONi 로고(A·i Bold로 "AI" 시각화) + 다온이 서브 + 태그라인 진한 골드
- **우중 사람**: 박인수 PARK INSOO / Founder & CEO
- **좌하 연락처**: E makehill@naver.com · T 010-2649-4695 · K maketour
- **우하 QR**: 15mm vCard QR

### 뒷면

- 정중앙 DAONi 로고 + 다온이 서브만 (미니멀)

### 배경 (워터마크)

- `assets/hanji-bee-tech-bg-minimal.png` — 우상 작은 벌 1마리 + 우중 헥사곤 꽃 클러스터 4개
- 좌측 절반 완전 비움 (텍스트 영역 침범 방지)
- CSS `opacity: 0.85 + mix-blend-mode: multiply`

### 로고

- `assets/logo.svg` — Inter 폰트 + A·i만 Bold 700, 나머지 Light 300
- 모두 `#1A1A1A` 먹빛 (골드 X — 굵기만으로 강조)
- 시각적으로 "**A I**" 부각 → 다온이가 AI 회사임을 은연중 강조

---

## 디자인 사이클 (6차)

| 차수 | 핵심 변화 |
|---|---|
| 1차 | 첫 시안 (잉크 잎 + 명조) |
| 2차 | 잉크 잎 위치 조정 + 박인수 고딕 변경 |
| 3차 | 양봉 라인아트 배경 추가 (잉크 잎 대체) |
| 4차 | Canva EAGpLKk6Z4Y 레이아웃 참고 + DAONi 로고 SVG화 |
| 5차 | **Tech Minimal 전환** — 명조 완전 제거, Inter+Pretendard 통일, DAONi A·i Bold |
| 6차 | 4-블록 구조 + 헤어라인 배경 |
| 7차 | 직함 `Founder & CEO`, 전화번호 추가, 미니멀 워터마크 배경(우상 벌 1·우측 헥사곤 클러스터) |

---

## 기술 구현

```
business-card/
├── server.js             Express + Puppeteer + qrcode + pdf-lib + OpenAI(자산 생성)
├── index.html            앞면+뒷면 HTML (@page 96×60mm)
├── style.css             4-블록 레이아웃, 폰트 토큰, 워터마크
├── package.json          express · dotenv · openai · puppeteer · qrcode · pdf-lib
├── .env.example          OPENAI_API_KEY placeholder
├── assets/
│   ├── logo.svg                       DAONi 로고 (Inter + A·i Bold)
│   ├── hanji-bee-tech-bg-minimal.png  최종 사용 배경
│   ├── hanji-bg.png                   (이전 사이클 — 보존)
│   ├── ink-stroke.png                 (이전 사이클 — 보존)
│   ├── bee-honeycomb-lineart.png      (이전 사이클 — 보존)
│   ├── hanji-bee-tech-bg.png          (이전 사이클 — 보존)
│   ├── hanji-bee-tech-bg-thin.png     (이전 사이클 — 보존)
│   └── hanji-bee-tech-bg-ghibli.png   (이전 사이클 — 보존)
├── reference/
│   └── canva-EAGpLKk6Z4Y-viewport.png  Canva 레이아웃 참고 캡처
└── output/                            최종 PNG · PDF
```

### API

```
GET  /api/qr.svg          → vCard 3.0 QR SVG (이름·직함·전화·이메일·카톡 포함)
POST /api/assets/generate → assets/*.png 자동 생성 (gpt-image-1 호출, idempotent)
POST /api/render          → output/{front.png, back.png, business-card.pdf} 생성
```

### Puppeteer 사양

- viewport `363 × 227` CSS px (96mm × 60mm @ 96dpi)
- deviceScaleFactor `3.125` → 출력 `1134 × 709 px` (300dpi)
- PDF: `width: 96mm, height: 60mm, printBackground: true, margin: 0`

### vCard 3.0 데이터

```
BEGIN:VCARD
VERSION:3.0
N:박;인수;;;
FN:박인수
ORG:DAONi (다온이)
TITLE:Founder & CEO
TEL;TYPE=CELL:+82-10-2649-4695
EMAIL:makehill@naver.com
NOTE:KakaoTalk: maketour
END:VCARD
```

---

## 실행

```powershell
cd week7\business-card
npm install
# .env 작성 (.env.example 참조 — OPENAI_API_KEY)
node server.js
# → http://localhost:3000 (미리보기)

# 렌더 호출
curl -X POST http://localhost:3000/api/render
# → output/{front.png, back.png, business-card.pdf}
```

---

## 비용 (자산 생성, gpt-image-1 medium)

| 자산 | 비용 |
|---|---|
| hanji-bg.png (이전) | ~$0.04 |
| ink-stroke.png (이전) | ~$0.04 |
| bee-honeycomb-lineart.png (이전) | ~$0.04 |
| hanji-bee-tech-bg.png (이전) | ~$0.06 |
| hanji-bee-tech-bg-thin.png (이전) | ~$0.06 |
| hanji-bee-tech-bg-ghibli.png (이전) | ~$0.06 |
| **hanji-bee-tech-bg-minimal.png (최종)** | **~$0.06** |
| **누적** | **~$0.36** |

이전 사이클 자산은 학습 비교용으로 보존.

---

## 의도적으로 안 한 것

- 외부 호스팅 — 로컬 실행 미니앱
- 다중 디자인 시안 동시 출력 — 단일 확정안만
- 직접 일러스트 작성 — 모두 GPT Image 또는 SVG로
- vCard 다중 전화번호·주소 — 명세 정보만
