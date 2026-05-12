# Week 7 · Quest

7주차 디자인 퀘스트 3종. **톤 시스템을 실전 산출물에 적용**.

각 퀘스트는 자체 디자인 시스템(컬러·폰트·일러스트)을 가짐. 단 디자인 원칙은 공유:
- 컬러 3색 이내
- 폰트 2~4종 이내, 역할 분리
- 시그니처 요소 1개에만 강조 집중

---

## 프로젝트

### 🪪 [business-card/](./business-card/) — Q1
**DAONi (다온이) · 박인수 명함** — Tech Minimal + 한지 톤.

- 90×54mm + 3mm 블리드, HTML+CSS → Puppeteer → PNG·PDF 300dpi
- 컬러 3색: 한지 `#F5F1E8` · 먹 `#1A1A1A` · 골드 `#B8946B`
- 폰트: Inter + Pretendard (명조 0)
- 로고 SVG: DAONi의 **A·i만 Bold**로 "AI" 시각화
- vCard 3.0 QR (이름·직함·전화·이메일·카톡 통합)
- 디자인 사이클 **7차** 거쳐 확정 (잉크 잎 → ... → 미니멀 워터마크)

### ☕ [cafe-menu-typa/](./cafe-menu-typa/) — Q2
**TYPA 카페 메뉴판** — 엔젤코어 + 다크 고딕 톤.

- 1080×1350 인스타 4:5
- 컬러 3색: Black `#0A0A0A` · Off-white `#F8F6F1` · Baby Pink `#F4C2D7`
- 폰트: UnifrakturMaguntia (블랙레터) + Pretendard/Inter Light
- 4 카테고리: COFFEE / SIGNATURE SODA / CAKE & DESSERT / BAR (18:00~)
- 시그니처 강조: ✦ 베이비 핑크 크림 소다 ✦ — 핑크 컬러 + 110% + 천사 날개 일러스트

### 🪽 [cafe-poster-typa-lavender/](./cafe-poster-typa-lavender/) — Q3
**TYPA 신메뉴 포스터** — 베이비 라벤더 크림 소다 "Lavender Angel".

- 1080×1350 인스타 4:5
- 컬러 3색: Black + Off-white + **Baby Lavender `#D4C5E3`**
- 메인 비주얼 50%+ (마법소녀 애니메 + 크레용 낙서 + 천사 날개)
- 빅 타이포 "세 번째 천사." (Pretendard Bold 120px)
- 영문 서브 𝕷𝖆𝖛𝖊𝖓𝖉𝖊𝖗 𝕬𝖓𝖌𝖊𝖑 (UnifrakturMaguntia 라벤더)

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
