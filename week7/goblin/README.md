# Week 7 · Goblin

7주차 워밍업 고블린 3종. **5톤 비주얼 디자인 시스템**을 서로 다른 캔버스에 그려본 실험.

---

## 프로젝트 목록

### 🎬 [thumbnail-generator/](./thumbnail-generator/) — G1
GPT Image로 5톤 × (가로 1920×1080 + 세로 1080×1920) = **10장** YouTube 썸네일 생성.

- 모델 호출: 1536×1024 / 1024×1536 → sharp crop+resize
- 톤당 1버튼, 가로·세로 병렬 생성
- [결과 그리드 →](./thumbnail-generator/generated/)

### 📱 [instagram-card-generator/](./instagram-card-generator/) — G2
G1 동일 5톤 × 1080×1080 정사각 = **5장**. Instagram feed 광고 카드.

- 모델 호출: 1024×1024 → sharp resize (단순 업스케일)
- 프롬프트 SUFFIX: 사방 여백 + 중앙 포커스
- [결과 그리드 →](./instagram-card-generator/generated/)

### 🪪 [profile-card-generator/](./profile-card-generator/) — G3
G1 동일 5톤 × 1200×630 가로 = **5장**. OG / 블로그 / LinkedIn 카드.

- 모델 호출: 1536×1024 → crop 109px → 1200×630 다운스케일
- 프롬프트 SUFFIX: 좌측 가중치 + 우측 텍스트 공간 + 무드 우선
- [결과 그리드 →](./profile-card-generator/generated/)

---

## 공유 자산

**톤 5종** (G1·G2·G3 동일 정의):
| 톤 | 키워드 |
|---|---|
| TONE_1 | Deep Navy & Gold |
| TONE_2 | Ink Wash (수묵) |
| TONE_3 | Sepia Diary |
| TONE_4 | Cool Midnight |
| TONE_5 | Dawn Mist |

**기술 스택**:
- 모델: `gpt-image-1` (medium quality)
- 변환: `sharp` (gpt-image-1 사이즈 제약 흡수)
- UI: React CDN + Tailwind + Express 정적 서빙

**실측 비용** (medium quality):
| 고블린 | 비용 |
|---|---|
| G1 (10장) | ~$0.40 |
| G2 (5장) | ~$0.20 |
| G3 (5장) | ~$0.30 |
| **합** | **~$0.90** |

---

## G1 — YouTube 썸네일 풀세트 (10장)

| 톤 | 가로 1920×1080 | 세로 1080×1920 |
|---|---|---|
| **Deep Navy & Gold** | ![](thumbnail-generator/generated/TONE_1_DEEP_NAVY_GOLD_1920x1080.png) | ![](thumbnail-generator/generated/TONE_1_DEEP_NAVY_GOLD_1080x1920.png) |
| **Ink Wash (수묵)** | ![](thumbnail-generator/generated/TONE_2_INK_WASH_1920x1080.png) | ![](thumbnail-generator/generated/TONE_2_INK_WASH_1080x1920.png) |
| **Sepia Diary** | ![](thumbnail-generator/generated/TONE_3_SEPIA_DIARY_1920x1080.png) | ![](thumbnail-generator/generated/TONE_3_SEPIA_DIARY_1080x1920.png) |
| **Cool Midnight** | ![](thumbnail-generator/generated/TONE_4_COOL_MIDNIGHT_1920x1080.png) | ![](thumbnail-generator/generated/TONE_4_COOL_MIDNIGHT_1080x1920.png) |
| **Dawn Mist** | ![](thumbnail-generator/generated/TONE_5_DAWN_MIST_1920x1080.png) | ![](thumbnail-generator/generated/TONE_5_DAWN_MIST_1080x1920.png) |

## G2 — Instagram 광고 카드 풀세트 (5장)

| Deep Navy & Gold | Ink Wash | Sepia Diary | Cool Midnight | Dawn Mist |
|---|---|---|---|---|
| ![](instagram-card-generator/generated/TONE_1_DEEP_NAVY_GOLD_1080x1080.png) | ![](instagram-card-generator/generated/TONE_2_INK_WASH_1080x1080.png) | ![](instagram-card-generator/generated/TONE_3_SEPIA_DIARY_1080x1080.png) | ![](instagram-card-generator/generated/TONE_4_COOL_MIDNIGHT_1080x1080.png) | ![](instagram-card-generator/generated/TONE_5_DAWN_MIST_1080x1080.png) |

## G3 — 프로필 카드 풀세트 (5장)

| 톤 | 1200×630 |
|---|---|
| **Deep Navy & Gold** | ![](profile-card-generator/generated/TONE_1_DEEP_NAVY_GOLD_1200x630.png) |
| **Ink Wash (수묵)** | ![](profile-card-generator/generated/TONE_2_INK_WASH_1200x630.png) |
| **Sepia Diary** | ![](profile-card-generator/generated/TONE_3_SEPIA_DIARY_1200x630.png) |
| **Cool Midnight** | ![](profile-card-generator/generated/TONE_4_COOL_MIDNIGHT_1200x630.png) |
| **Dawn Mist** | ![](profile-card-generator/generated/TONE_5_DAWN_MIST_1200x630.png) |

---

## 다음

세 고블린의 공통 패턴은 [`../agent/static-visual-maker/`](../agent/static-visual-maker/)로 추상화됨 (A1 에이전트).
