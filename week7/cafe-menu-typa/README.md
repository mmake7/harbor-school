# 카페 메뉴판 — TYPA (Q2)

TYPA (왕십리 마조로 24, 지하1층) 카페 메뉴판. **HTML+CSS → Puppeteer → PNG·PDF 출력**.

> Cafe & bar dessert atelier · 엔젤코어 + 쇠맛, Y2K 러블리힙, 다크 고딕

---

## 출력

- [output/menu.png](./output/menu.png) — 2160×2700 (인스타 1080×1350 × 2x, 300dpi 인쇄 품질)
- [output/menu.pdf](./output/menu.pdf) — 96×120mm 인쇄용

---

## 사양

| 항목 | 값 |
|---|---|
| 사이즈 | 인스타 포스트 4:5 (1080×1350 CSS px) |
| 출력 PNG | deviceScaleFactor 2 → 2160×2700px |
| 출력 PDF | 96mm × 120mm |
| 컬러 3색 | Black `#0A0A0A` / Off-white `#F8F6F1` / Baby Pink `#F4C2D7` (시그니처) |
| 폰트 | UnifrakturMaguntia (display) + Pretendard Light (한글) + Inter Light (영문·숫자) |

## 디자인 결정

### 헤더
- `† 𝕿𝖄𝕻𝕬 †` 블랙레터 124px, 양옆 핑크 십자가
- 서브 "cafe & bar dessert atelier"
- 가는 구분선

### 4 카테고리
| 카테고리 | 메뉴 |
|---|---|
| COFFEE | 에스프레소 / 아메리카노 / 카페라떼 |
| **SIGNATURE SODA** | **✦ 베이비 핑크 크림 소다 ✦ ₩7,500** (강조) / 베이비 블루 / 러브 젤리 |
| CAKE & DESSERT | 시즌 케이크 / 브라우니 / 레터링 케이크 |
| BAR (18:00~) | 시그니처 칵테일 / 와인 글래스 / TYPA 스페셜 |

### 시그니처 강조 (베이비 핑크 크림 소다)
- 컬러 Baby Pink `#F4C2D7`
- ✦ 양옆 별
- 폰트 110% (24px → 22px → 16px text-shadow 글로우)
- 좌측 일러스트 (천사 날개 달린 핑크 크림 소다 글래스)

### 배경
- `assets/bg-dark-pink.png` (GPT Image 2 생성)
- 다크 그라데이션 + 좌상·우하 핑크 글로우 + 작은 십자가 워터마크 패턴
- CSS 위에 `linear-gradient` 다크 오버레이로 텍스트 가독성 보장

## 자산 (GPT Image 2 생성)

| 파일 | 프롬프트 요약 | 비용 |
|---|---|---|
| `assets/bg-dark-pink.png` | Ultra dark Y2K gothic, 핑크 글로우 + 십자가/날개 워터마크 (1024×1536) | ~$0.06 |
| `assets/soda-illustration.png` | 천사 날개 핑크 크림 소다 라인 일러스트 (1024×1024) | ~$0.04 |

**총 ~$0.10**

## 기술 구현

```
cafe-menu-typa/
├── server.js              Express + Puppeteer + pdf-lib + OpenAI
├── index.html             메뉴판 HTML (poster div 1080×1350)
├── style.css              레이아웃·폰트·컬러·시그니처 강조
├── package.json           express · dotenv · openai · puppeteer · pdf-lib
├── .env.example           키 형식 가이드
├── assets/
│   ├── bg-dark-pink.png       다크 + 핑크 글로우 배경
│   └── soda-illustration.png  시그니처 일러스트
├── output/
│   ├── menu.png               2160×2700 PNG
│   └── menu.pdf               96×120mm PDF
└── README.md
```

## API

```
POST /api/assets/generate  → assets/*.png 자동 생성 (idempotent)
POST /api/render           → output/{menu.png, menu.pdf}
GET  /                     → 미리보기 (브라우저)
```

## 실행

```powershell
cd week7\cafe-menu-typa
npm install
# .env (.env.example 참조 — OPENAI_API_KEY)
node server.js
# → http://localhost:3000 (미리보기)
curl -X POST http://localhost:3000/api/render
```

## 의도적으로 안 한 것

- 메뉴 추가·변경 폼 UI — 형 명세 정보만
- 인쇄용 별도 A4 레이아웃 — 4:5 비율 단일
- 인스타 캡션 자동 생성 — 디자인만
