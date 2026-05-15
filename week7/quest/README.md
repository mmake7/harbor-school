# Week 7 · Quest

7주차 디자인 퀘스트 3종. **톤 시스템을 실전 산출물에 적용**.

각 퀘스트는 자체 디자인 시스템(컬러·폰트·일러스트)을 가짐. 단 디자인 원칙은 공유:
- 컬러 3색 이내
- 폰트 2~4종 이내, 역할 분리
- 시그니처 요소 1개에만 강조 집중

---

## 프로젝트

### 🪪 [business-card/](./business-card/) + [business-card-digital/](./business-card-digital/) — Q1
**DAONi (다온이) · 박인수 명함** — Tech Minimal + 한지 톤. **아날로그(인쇄) + 디지털(웹)** 두 형식.

- 아날로그: 90×54mm + 3mm 블리드, HTML+CSS → Puppeteer → PNG·PDF 300dpi
- 디지털: 정적 사이트 라이브 `https://business-card-digital.vercel.app`
- 컬러 3색: 한지 `#F5F1E8` · 먹 `#1A1A1A` · 골드 `#B8946B`
- 폰트: Inter + Pretendard (명조 0)
- 로고 SVG: DAONi의 **A·i만 Bold**로 "AI" 시각화
- vCard 3.0 QR (이름·직함·전화·이메일·카톡 통합)
- 디자인 사이클 **7차** 거쳐 확정 (잉크 잎 → ... → 미니멀 워터마크)

### ☕ [cafe-menu-typa/](./cafe-menu-typa/) + [cafe-menu-typa-v2/](./cafe-menu-typa-v2/) — Q2
**TYPA 카페 메뉴판** — v1(다크) + **v2(라이트, 카드 그리드 카탈로그)** 두 버전.

- v1: 1080×1350 다크 + 시그니처 1 일러스트
- **v2**: 1080×1620 라이트(인쇄 친화) + **12개 음료/디저트 카탈로그** + 지브리 결 라인아트 bg + 측정 지시 정밀화
- 컬러 3색: Off-white `#F8F6F1` · Soft Black `#0A0A0A` · Baby Pink `#F4C2D7`
- 폰트: UnifrakturMaguntia (블랙레터) + Pretendard/Inter Light
- 4 카테고리: COFFEE / SIGNATURE SODA / CAKE & DESSERT / BAR (18:00~)
- 시그니처 강조: ✦ 베이비 핑크 크림 소다 ✦ — 카드 핑크 그라데이션 + 130% + 양쪽 천사 날개

### 🪽 [cafe-poster-typa-lavender/](./cafe-poster-typa-lavender/) + [cafe-poster-typa-lavender-v2/](./cafe-poster-typa-lavender-v2/) — Q3
**TYPA 신메뉴 포스터** — v1(단일 천사) + **v2(천사 vs 악마 자매 시리즈)**.

- v1: 라벤더 천사 단일 포스터
- **v2**: 각 1080×1350 다크 + 라이트 두 panel 나란히
  - 🪽 𝕷𝖆𝖛𝖊𝖓𝖉𝖊𝖗 𝕬𝖓𝖌𝖊𝖑 / "세 번째 천사." (라이트, 인쇄)
  - ⛧ 𝕷𝖆𝖛𝖊𝖓𝖉𝖊𝖗 𝕯𝖊𝖛𝖎𝖑 / "세 번째 악마." (다크, SNS · 키치 데빌-걸)
- 컬러: Black + Off-white + **Baby Lavender `#D4C5E3`** + Crimson `#C0212C` (악마)
- 메인 비주얼 55% (90s magical girl anime + Sailor Moon/Cardcaptor Sakura 결)
- 빅 타이포 170px Pretendard Black Heavy (한 줄 nowrap)
- 영문 서브 𝕷𝖆𝖛𝖊𝖓𝖉𝖊𝖗 𝕬𝖓𝖌𝖊𝖑 / 𝕯𝖊𝖛𝖎𝖑 (UnifrakturMaguntia 라벤더)

---

## 공통 기술 패턴

세 퀘스트 모두 같은 구조:
- HTML + CSS (디자인 시스템 적용)
- Puppeteer headless로 300dpi PNG·PDF 출력
- GPT Image로 비주얼 자산 생성 (필요한 만큼)
- `assets/` 보관 → `output/` 출력

---

## 마감 누계

| 퀘스트 | 디자인 사이클 | 비용 | 출력 |
|---|---|---|---|
| Q1 명함 | 7차 | ~$0.36 | front.png · back.png · PDF |
| Q2 메뉴판 | 1차 | ~$0.10 | menu.png · PDF |
| Q3 포스터 | 1차 | ~$0.06 | poster.png · PDF |
| **합** | | **~$0.52** | |

---

## 출력물 미리보기

### Q1 — 명함 (앞·뒤)

| 앞면 | 뒷면 |
|---|---|
| ![Q1 front](business-card/output/front.png) | ![Q1 back](business-card/output/back.png) |

> PDF (인쇄용 합본): [`business-card/output/business-card.pdf`](./business-card/output/business-card.pdf)

### Q2 — TYPA 카페 메뉴판

![Q2 menu](cafe-menu-typa/output/menu.png)

> PDF: [`cafe-menu-typa/output/menu.pdf`](./cafe-menu-typa/output/menu.pdf)

### Q3 — TYPA 라벤더 크림 소다 신메뉴 포스터

![Q3 poster](cafe-poster-typa-lavender/output/poster.png)

> PDF: [`cafe-poster-typa-lavender/output/poster.pdf`](./cafe-poster-typa-lavender/output/poster.pdf)
