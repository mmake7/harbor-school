# TYPA Menu v2 — 측정 가능한 톤 강화 + 음료 카탈로그

v1이 모호한 톤 단어로 평균값 결과를 내서, v2는 **측정 가능한 강화 지시 + 12개 음료/디저트 일러스트 카탈로그** 로 재작업. (v1 폴더는 폐기)

## 결과 미리보기

### 배경 + 시그니처

| 배경 (지브리 결 라인아트, 라이트 톤) | 시그니처 — 베이비 핑크 크림 소다 |
|---|---|
| <img src="./assets/bg.png" width="400" alt="bg" /> | <img src="./assets/m-pink-soda.png" width="400" alt="signature" /> |

### 12 음료/디저트 카탈로그

| Coffee | | |
|---|---|---|
| <img src="./assets/m-espresso.png" width="220" alt="espresso" /> | <img src="./assets/m-americano.png" width="220" alt="americano" /> | <img src="./assets/m-latte.png" width="220" alt="latte" /> |
| 에스프레소 ₩4,500 | 아메리카노 ₩5,500 | 카페라떼 ₩6,000 |

| Signature Soda | | |
|---|---|---|
| <img src="./assets/m-pink-soda.png" width="220" alt="pink soda" /> | <img src="./assets/m-blue-soda.png" width="220" alt="blue soda" /> | <img src="./assets/m-jelly-soda.png" width="220" alt="jelly soda" /> |
| ✦ 베이비 핑크 크림 소다 ✦ ₩7,500 | 베이비 블루 크림 소다 ₩7,500 | 러브 젤리 소다 ₩7,500 |

| Cake & Dessert | | |
|---|---|---|
| <img src="./assets/m-cake.png" width="220" alt="cake" /> | <img src="./assets/m-brownie.png" width="220" alt="brownie" /> | <img src="./assets/m-lettering-cake.png" width="220" alt="lettering" /> |
| 시즌 케이크 ₩8,500 | 브라우니 ₩6,000 | 레터링 케이크 ₩45,000~ |

| Bar (18:00~) | | |
|---|---|---|
| <img src="./assets/m-cocktail.png" width="220" alt="cocktail" /> | <img src="./assets/m-wine.png" width="220" alt="wine" /> | <img src="./assets/m-typa-special.png" width="220" alt="typa special" /> |
| 시그니처 칵테일 ₩13,000 | 와인 글래스 ₩9,000 | TYPA 스페셜 ₩15,000 |

> 위는 raw 자산 일러스트. 최종 결과(카드 그리드 + 카피·가격 합본)는 `index.html` 로컬 미리보기 또는 Puppeteer 렌더 후 `output/menu.png` 참조.

---

## 결정 사항

- **캔버스**: 1080×1620 (4:6 — 인스타 4:5보다 길게, 카드 그리드 여유 확보)
- **레이아웃 C**: 카테고리별 가로 3 카드 그리드 (카드 = 음료 일러스트 + 메뉴명 + 가격)
- **톤**: 라이트 (인쇄 친화) — Off-white #F8F6F1 base / Soft Black 텍스트 / Baby Pink #F4C2D7 (시그니처 강조는 한 톤 진한 #D4527A)
- **배경**: 지브리 결 + 라인아트 + 몽환 (다마스크 패턴 폐기 — 형 피드백 "딱딱하다")
- **음료 일러스트**: 12개 메뉴마다 별도 (gpt-image-2 1024×1024 medium) — y2k angelcore + Ghibli soft watercolor 톤 통일

---

## 측정 지시 (v1 실패 원인 보완)

| 항목 | 측정 |
|---|---|
| TYPA 로고 | UnifrakturMaguntia, 200px (폭 약 50% 근사) |
| 서브 "Cafe & bar dessert atelier" | 로고의 12% = 24px |
| 카테고리명 | 30px (카드 이름 17px의 약 1.8배) Bold |
| 메뉴명 (카드 내) | 17px |
| 시그니처 메뉴 | 21px (130% 강조) + ✦ 별 + Baby Pink + 카드 자체 핑크 그라데이션 |
| 카드 이미지 | 140×140 (drop-shadow 적용) |
| 카테고리 사이 여백 | 14px (1080×1620 안에서 4 카테고리 + 헤더/푸터 빡빡해서 시각 조정) |
| 푸터 모티브 | † · 🪽 · 🤍 (letter-spacing 0.5em) |

---

## 자산 (13장, gpt-image-2 medium)

| ID | 설명 | 사이즈 |
|---|---|---|
| `bg.png` | 라이트 cream + 라인아트 + 라벤더/핑크 글로우 halo | 1024×1536 |
| `m-espresso.png` | 에스프레소 잔 + 천사 날개 | 1024×1024 |
| `m-americano.png` | 아메리카노 머그 + 김 | 1024×1024 |
| `m-latte.png` | 라떼 + 하트 라떼아트 | 1024×1024 |
| `m-pink-soda.png` | **시그니처** 베이비 핑크 크림 소다 + 양쪽 천사 날개 | 1024×1024 |
| `m-blue-soda.png` | 베이비 블루 크림 소다 | 1024×1024 |
| `m-jelly-soda.png` | 러브 젤리 소다 (하트 젤리) | 1024×1024 |
| `m-cake.png` | 시즌 케이크 (딸기) | 1024×1024 |
| `m-brownie.png` | 브라우니 + 슈가 | 1024×1024 |
| `m-lettering-cake.png` | TYPA 레터링 케이크 | 1024×1024 |
| `m-cocktail.png` | 시그니처 칵테일 (핑크-퍼플) | 1024×1024 |
| `m-wine.png` | 와인 글래스 | 1024×1024 |
| `m-typa-special.png` | TYPA 스페셜 (라벤더 글로우) | 1024×1024 |

---

## 폰트

- **UnifrakturMaguntia** (Google Fonts) — 로고 + 서브
- **Inter** (Google Fonts) — 카테고리·가격·푸터
- **Pretendard Variable** (CDN) — 메뉴명 한글

---

## 디자인 사이클

| 차수 | 핵심 변화 |
|---|---|
| v1 → v2 1차 | 측정 지시 + 톤 데이터 정밀 + 시그니처 일러스트 단일 |
| v2 2차 | 형 피드백 "딱딱하다" → 배경 지브리 + 라인아트 재생성 |
| v2 3차 | 형 피드백 "음료 사진 없다" → 12개 메뉴 카탈로그 + C 레이아웃 (1080×1620) |
| v2 4차 | 형 피드백 "어두우면 인쇄 어렵다" → 라이트 톤 전환 + bg 재생성 |
| v2 5차 | 형 피드백 "마지막 메뉴 잘림" → 컴팩트 조정 + overlay 진하게 |

---

## 비용

| 자산 | 비용 |
|---|---|
| bg (재생성 1회 포함, 2회) | $0.12 |
| 12 메뉴 일러스트 | $0.48 |
| 폐기된 첫 signature-illust | $0.04 |
| **합** | **~$0.64** |

---

## v1 대비

| 항목 | v1 | v2 |
|---|---|---|
| 캔버스 | 1080×1350 | 1080×1620 |
| 톤 | 다크 (Black) | 라이트 (Off-white) |
| 음료 이미지 | 시그니처 1장만 | 12장 카탈로그 |
| 레이아웃 | 한 줄 메뉴 + 가격 | 가로 3 카드 그리드 |
| 측정 지시 | 모호 ("Y2K") | 정밀 (폰트 px, 비율 %) |
| 인쇄 친화도 | 낮음 (잉크 多) | 높음 |

v1 폴더 `cafe-menu-typa/` 그대로 보존.

---

## 의도적으로 안 한 것

- v1 코드 복사 — 처음부터 새로 작성
- 다크 톤 유지 — 인쇄 친화도 우선
- 메뉴 12개 줄임 — 카탈로그 풍성함이 컨셉
- TYPA 매장의 지하1층 다크 무드 그대로 반영 — 인쇄용은 매장 무드와 별개
