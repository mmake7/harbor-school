# 카페 신메뉴 포스터 — TYPA 베이비 라벤더 크림 소다 (Q3)

TYPA 신메뉴 **"베이비 라벤더 크림 소다 — Lavender Angel"** 출시 포스터. 5초 안에 시선을 잡는 메인 비주얼 + 빅 타이포 구조.

> 천사 시리즈 세 번째 컬러. 2026.06 – 08 여름 한정.

---

## 출력

- [output/poster.png](./output/poster.png) — 2160×2700 (1080×1350 × 2x, 인스타·단톡방·스토리)
- [output/poster.pdf](./output/poster.pdf) — 96×120mm 인쇄용

---

## 사양

| 항목 | 값 |
|---|---|
| 사이즈 | 인스타 포스트 4:5 (1080×1350 CSS px → 2160×2700 PNG) |
| PDF | 96×120mm |
| 컬러 3색 | Black `#0A0A0A` / Off-white `#F8F6F1` / **Baby Lavender `#D4C5E3`** |
| 폰트 2종 | UnifrakturMaguntia (display) + Pretendard/Inter Light (본문·메인 카피) |

## 레이아웃

```
● TYPA NEW · 신메뉴 ●                  ← 상단 라벨 (라벤더)

┌────────────────────┐
│                    │
│   [메인 비주얼]    │  ← 720px, 포스터 50%+
│   라벤더 글라스     │
│   천사 날개 + 낙서  │
│                    │
└────────────────────┘

   세 번째 천사.                       ← Pretendard Bold 120px
   𝕷𝖆𝖛𝖊𝖓𝖉𝖊𝖗 𝕬𝖓𝖌𝖊𝖑                     ← UnifrakturMaguntia 60px (라벤더)

₩7,500                          𝕿𝖄𝕻𝕬   ← 좌하 가격·시즌 / 우하 로고
2026.06 – 08 · SUMMER LIMITED
```

## 디자인 결정

### 1. 메인 비주얼 (GPT Image 2)
형 명세 그대로 — Japanese anime + 90s magical girl 결 (Sailor Moon / Cardcaptor Sakura 톤). 셀 셰이딩 + 두꺼운 외곽선 + 플랫 컬러. 베이비 라벤더 dominant, 양옆 천사 날개, 별·하트·구름 크레용 낙서.

### 2. 빅 타이포
- "세 번째 천사." 120px Pretendard 700, letter-spacing -0.03em
- 시선을 잡는 핵심 — 5초 안에 멈춤력
- 마침표 `.` 포함 — 단언적 톤

### 3. 영문 서브
- "Lavender Angel" UnifrakturMaguntia 60px 라벤더
- 블랙레터로 TYPA 브랜드 결 유지

### 4. SVG 크레용 낙서 (절제)
- 좌상 라벤더 별
- 우상 흰 구름
- 우하 흰 별
- 메인 비주얼 자체에 낙서 풍성 → 코드 추가는 절제

### 5. 배경 글로우
- `radial-gradient(ellipse at center 38%, rgba(212,197,227,0.18), #0A0A0A 60%)`
- 메인 비주얼 뒤 라벤더 halo 효과
- 비주얼에 `drop-shadow(0 0 60px rgba(212,197,227,0.35))` 추가 글로우

## 자산 (GPT Image 2)

| 파일 | 사이즈 | 비용 |
|---|---|---|
| `assets/main-visual.png` | 1024×1536 | ~$0.06 |

**총 ~$0.06** (Q2 메뉴판 ~$0.10보다 저렴 — 배경 별도 자산 없이 CSS gradient 사용)

## 기술 구현

```
cafe-poster-typa-lavender/
├── server.js              Express + Puppeteer + pdf-lib + OpenAI
├── index.html             포스터 HTML
├── style.css              레이아웃·빅 타이포·낙서 SVG
├── package.json           express · dotenv · openai · puppeteer · pdf-lib
├── .env.example
├── assets/
│   └── main-visual.png        메인 비주얼 (마법소녀 애니메)
├── output/
│   ├── poster.png             2160×2700 PNG
│   └── poster.pdf             96×120mm PDF
└── README.md
```

## API

```
POST /api/assets/generate  → assets/main-visual.png (idempotent)
POST /api/render           → output/{poster.png, poster.pdf}
GET  /                     → 미리보기
```

## 실행

```powershell
cd week7\cafe-poster-typa-lavender
npm install
# .env 작성 (OPENAI_API_KEY)
node server.js
# → http://localhost:3000
curl -X POST http://localhost:3000/api/render
```

## 5초 시선 잡기 체크

1. 큰 라벤더 글라스 → 즉시 시선
2. "세 번째 천사." 빅 타이포 → 호기심
3. ₩7,500 + SUMMER LIMITED → 시즌성 강조
4. 𝕷𝖆𝖛𝖊𝖓𝖉𝖊𝖗 𝕬𝖓𝖌𝖊𝖑 블랙레터 → 브랜드 일관성

## 의도적으로 안 한 것

- 추가 카피·태그라인 — 빅 타이포 1개에 집중
- 더 많은 SVG 낙서 — 비주얼이 이미 풍성, 절제 우선
- 별도 배경 이미지 — CSS gradient로 충분 (자산 비용 절감)
- 다중 사이즈 출력 (스토리·피드 별도) — 4:5 단일

---

## Q2(메뉴판)와의 관계

| 영역 | Q2 메뉴판 | Q3 포스터 |
|---|---|---|
| 목적 | 정보 위주 (4 카테고리) | 비주얼 위주 (메뉴 1개) |
| 주컬러 | Baby Pink `#F4C2D7` | Baby Lavender `#D4C5E3` |
| 빅 타이포 | 카테고리 헤더 (블랙레터 36px) | "세 번째 천사." (120px) |
| 자산 | 배경 + 일러스트 2장 (~$0.10) | 메인 비주얼 1장 (~$0.06) |
| 폰트 | UnifrakturMaguntia + Pretendard | 동일 |
| 사이즈 | 1080×1350 4:5 | 동일 |

**같은 TYPA 톤** (Y2K 러블리힙 + 다크 고딕). 메뉴판이 매장 안내라면 포스터는 신메뉴 소셜 광고 결.
