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

### ☕ [cafe-menu-typa-v2/](./cafe-menu-typa-v2/) — Q2
**TYPA 카페 메뉴판** — 라이트 톤(인쇄 친화) + 카드 그리드 카탈로그. v1 폐기.

- 1080×1620, 카테고리별 가로 3 카드 그리드 + **12개 음료/디저트 카탈로그**
- 지브리 결 라인아트 bg + 측정 지시 정밀화 (TYPA 50%, 카테고리 1.8×, 시그니처 130%)
- 컬러 3색: Off-white `#F8F6F1` · Soft Black `#0A0A0A` · Baby Pink `#F4C2D7`
- 폰트: UnifrakturMaguntia (블랙레터) + Pretendard/Inter Light
- 4 카테고리: COFFEE / SIGNATURE SODA / CAKE & DESSERT / BAR (18:00~)
- 시그니처: ✦ 베이비 핑크 크림 소다 ✦ — 카드 핑크 그라데이션 + 130% + 양쪽 천사 날개

### 🪽 [cafe-poster-typa-lavender-v2/](./cafe-poster-typa-lavender-v2/) — Q3
**TYPA 신메뉴 포스터** — 천사 vs 악마 자매 시리즈, 다크 + 라이트 두 panel. v1 폐기.

- 각 1080×1350 다크 + 라이트 panel 나란히
  - 🪽 𝕷𝖆𝖛𝖊𝖓𝖉𝖊𝖗 𝕬𝖓𝖌𝖊𝖑 / "세 번째 천사." (라이트, 인쇄)
  - ⛧ 𝕷𝖆𝖛𝖊𝖓𝖉𝖊𝖗 𝕯𝖊𝖛𝖎𝖑 / "세 번째 악마." (다크, SNS · 키치 데빌-걸)
- 컬러: Black + Off-white + **Baby Lavender `#D4C5E3`** + Crimson `#C0212C` (악마)
- 메인 비주얼 55% (90s magical girl anime + Sailor Moon/Cardcaptor Sakura 결)
- 빅 타이포 170px Pretendard Black Heavy (한 줄 nowrap)
- 영문 서브 𝕷𝖆𝖛𝖊𝖓𝖉𝖊𝖗 𝕬𝖓𝖌𝖊𝖑 / 𝕯𝖊𝖛𝖎𝖑 (UnifrakturMaguntia 라벤더)

---

## 공통 기술 패턴

세 퀘스트 공유 구조:
- HTML + CSS (각자 디자인 시스템 적용)
- GPT Image 2로 비주얼 자산 생성
- `assets/` 보관 → 정적 미리보기 또는 Puppeteer 렌더로 `output/` PNG·PDF (Q1만 현재 적용)

---

## 마감 누계

| 퀘스트 | 디자인 사이클 | 비용 | 산출 |
|---|---|---|---|
| Q1 명함 (아날로그 + 디지털) | 7차 | ~$0.40 | front/back PNG · PDF · 라이브 디지털 명함 |
| Q2 메뉴판 v2 | 5차 | ~$0.64 | 13 자산 + index.html (Puppeteer 후속) |
| Q3 포스터 v2 | 3차 | ~$0.12 | 2 자산 + index.html (Puppeteer 후속) |
| **합** | | **~$1.16** | |

---

## 출력물 미리보기

### Q1 — 명함 (앞·뒤)

| 앞면 | 뒷면 |
|---|---|
| ![Q1 front](business-card/output/front.png) | ![Q1 back](business-card/output/back.png) |

> PDF (인쇄용 합본): [`business-card/output/business-card.pdf`](./business-card/output/business-card.pdf)

### Q2 — TYPA 카페 메뉴판 v2

| 배경 (지브리 라인아트) | 시그니처 — 베이비 핑크 크림 소다 |
|---|---|
| <img src="cafe-menu-typa-v2/assets/bg.png" width="380" alt="menu bg" /> | <img src="cafe-menu-typa-v2/assets/m-pink-soda.png" width="380" alt="signature" /> |

> 12 음료/디저트 카탈로그 + 카드 그리드 합본은 [`cafe-menu-typa-v2/README.md`](./cafe-menu-typa-v2/) 참고

### Q3 — TYPA 신메뉴 포스터 v2

| 🪽 Lavender Angel (라이트, 인쇄) | ⛧ Lavender Devil (다크, SNS) |
|---|---|
| <img src="cafe-poster-typa-lavender-v2/assets/angel-visual.png" width="380" alt="angel" /> | <img src="cafe-poster-typa-lavender-v2/assets/devil-visual.png" width="380" alt="devil" /> |

> 두 panel 합본 (카피·서브·doodles·메타)은 [`cafe-poster-typa-lavender-v2/README.md`](./cafe-poster-typa-lavender-v2/) 참고
