# 다오니 시뮬레이터 (daoni-simulator) — F2

7주차 Final 2. **다온이**가 자율 운영하는 **염창동 옥상농장** 시뮬레이터.
손님 쇼핑몰 + 관리자 자율 운영 5 모듈 통합.

- 🌐 라이브: https://daoni-simulator.vercel.app
- 📺 발표: https://daoni-simulator.vercel.app/presentation.html

---

## 컨셉

도시 한가운데 옥상에서 1인이 자율 AI 운영자 다온이와 함께 4 시즌 작물(딸기·블루베리·멜론·다음 모종) + 부산물 꿀(딸기꿀·블루베리꿀·멜론꿀)을 키우고 판다.

> 시간 가속 미리보기 X → **운영 시스템 미니 버전**. today-room 풀세트(JWT·pg·ImageKit·Toss) 패턴을 차용한 라이브 서비스 결.

페르소나 톤: 1인칭 ("저는 ~"), 염창동 단골·옥상·LED 자주 언급, 따뜻하고 솔직한 도시농부.

---

## 스택

- Next 14.2.35 + React 18 + Tailwind 3 + TypeScript
- `@anthropic-ai/sdk@^0.95.2` (Claude Sonnet 4.6 + ephemeral prompt caching)
- `openai@^6.37.0` (gpt-image-2, medium 1024×1024)
- 데이터: 정적 JSON + 메모리 (DB·인증 안 씀, dongne-golmok 패턴)
- 디자인: 모던 도시농부 — 화이트 + 신선 그린(#10B981) + 시즌 액센트 4종(딸기 #FF4757 · 블루베리 #4F46E5 · 멜론 #F59E0B · 모종 #84CC16) · DESIGN.md 12 컬러 토큰 · Pretendard + Tabler webfont
- 배포: Vercel icn1(서울 리전)

---

## 5 모듈 + Grow

| 모듈 | 역할 | 라이브 호출 |
|---|---|---|
| **Decide** | 시장·날씨 보고 작물 결정 (시즌 의사결정) | Claude — `lib/decide.ts` · `/api/decide` |
| **Watch** | 농장 생육·환경 센서 관찰 | 시드 데이터 + 라이브 날씨 — `lib/recommend.ts:getWeather` |
| **Care** | 다온이 1인칭 챗·일일 브리핑·발화 | Claude 멀티턴 — `lib/chat.ts`, `lib/briefing.ts` · `/api/chat`, `/api/briefing/today` |
| **Tell** | 콘텐츠 자동 생성 (인스타 캡션 + 블로그) | Claude 텍스트 + gpt-image-2 — `lib/tell.ts` · `/api/tell/generate` |
| **Sell** | 쇼핑몰·결제·자동 등록·정산 | localStorage — `lib/cart.ts`, `lib/sell.ts`, `lib/harvest.ts` |
| **Grow** | 시간 누적 자산 | 별도 모듈 X (콘텐츠·매출·다온이 학습 누적) |

---

## 페이지 (14)

### 손님 6
| 경로 | 핵심 |
|---|---|
| `/` | 히어로 + 오늘의 식탁(라이브) + 시즌 상품 4 + 추천 레시피 6 + 농장 소개 |
| `/shop` | 시즌 작물·꿀 큰 카드 + 다른 시즌 dim |
| `/shop/[id]` | 상품 상세 + 부산물 꿀 + 함께 만들 레시피 + 다온이 발화 |
| `/cart` | 카트·수량 +/- · 합계 |
| `/checkout` | 배송 폼 + 결제(mock) + saveOrder |
| `/order/[id]` | 주문 완료 + 다온이 정산 인사 |

### 관리자 8
| 경로 | 핵심 |
|---|---|
| `/admin` | TimeEngineControl + 일일 브리핑(라이브) + 4 stat + 빠른 진입 |
| `/admin/farm` | 작물 진척 + 센서 4(CO₂·조도·토양·벌통) + 옥상 날씨 + 다온이 액션 로그 10 |
| `/admin/decide` | 작물 결정 추천(라이브) + 시장 시그널 시계열 |
| `/admin/harvest` | 수확 가능 작물 + 수확 처리 → **자동 흐름** (등록·콘텐츠) |
| `/admin/products` | 자동 등록 상품(2초 polling) |
| `/admin/orders` | 주문 내역 (placeholder) |
| `/admin/content` | 작물 셀렉터 + Tell 콘텐츠 생성 (시드/라이브 토글) |
| `/admin/daoni` | 다온이 멀티턴 챗 (localStorage history) |

### API 라이브 5
- `/api/recommend/today` — 오늘의 식탁 추천 (~9-14초, force-dynamic, maxDuration 30s)
- `/api/briefing/today` — 일일 브리핑
- `/api/decide` — 작물 결정
- `/api/tell/generate` — Tell 콘텐츠 (production 환경에서 라이브 이미지 자동 시드 폴백)
- `/api/chat` — 다온이 멀티턴 챗

---

## 시드·시간

- 4 분기 × 90일 = 365일 시뮬
- `data/seed-quarters.ts` — Q1~Q4 macro + decisionContext (각 newsHeadlines 5 + daoniReasoning)
- `data/seed-daily.ts` — `generateDayState(day)` deterministic (Math.sin oscillation + 시즌별 lerp 범위)
- `data/mock-market.ts` — 분기별 시장 시그널 21개 (cropPrices · newsItems · trendNote)
- `data/crops.ts` — 4 작물 + 3 꿀 (defaultPrice 포함)
- `data/recipes.ts` — 8 레시피 (작물별 2-3개)

**시간 점프** (시연용, URL 쿼리):
- `?day=30` Q1 재배 중
- `?day=88` Q1 수확 ★ 시연 결정타
- `?day=91` Q2 시작
- `?day=178` Q2 수확

---

## 시연 흐름 (자동 자율 운영)

`/admin/harvest?day=88` → "수확 처리" 클릭 →

```
✓ 수확 처리              (saveHarvest, sync)
✓ 쇼핑몰 자동 등록        (listProductFromHarvest, sync)
⌛ 콘텐츠 생성 중…        (Claude 호출, 1-3초)
✓ 완료 → [콘텐츠 보러 가기]
```

→ `/admin/content?cropId=strawberry&day=88` 이동 → 자동 생성된 인스타 캡션·블로그·시드 이미지

---

## 작업 로그

| Day | 단계 | 산출 |
|---|---|---|
| **Day 0** | INVENTORY 조사 | 1~7주차 + harbor-community + dongne-golmok 자산 매핑 (`INVENTORY.md`) |
| **Day 1** | 1~6 | Next 14 init · 16 페이지 골격 · DESIGN.md 12 토큰 · lib 헬퍼 6 (skeleton) |
| **Day 2** | 1~4 | gpt-image-2 검증 · 시드 데이터 풀 · TimeEngine class · 첫 라이브 API (`/api/recommend/today`) |
| **Day 3** | 1~6 | 메인 5섹션 · 손님 쇼핑몰 5 페이지 · 5 모듈 라이브(Decide·Watch·Care·Tell·Sell) · gpt-image-2 시드 4장 |
| **Day 4** | 1~2 | 시연 자동 흐름(수확→등록→콘텐츠) · TimeEngineControl jump 4 프리셋 · Vercel 배포 · 발표 HTML |

---

## 실행 (로컬)

```powershell
cd week7/daoni-simulator
npm install
# .env.local 작성:
#   ANTHROPIC_API_KEY=sk-ant-...
#   OPENAI_API_KEY=sk-...
npm run dev
# → http://localhost:3000
```

발표 자료: `public/presentation.html` (Vercel 자동 서빙 — `/presentation.html`)

---

## 알려진 제약

- **gpt-image-2 라이브 이미지**: 한 장 ~68-90초 생성. Vercel 60초 함수 한도 초과. **production 환경에서 자동 시드 폴백** (`/api/tell/generate` 안의 `process.env.VERCEL_ENV === "production"` env guard). 실 시연은 **localhost 권장**.
- 카트·주문·수확·등록·챗 history 모두 **localStorage 기반** (DB 안 씀). 브라우저 데이터 클리어 시 초기화.
- 결제는 mock — TossPayments 실 widget 미연동.

---

## 참조 패턴 (INVENTORY 기반)

| 패턴 | 출처 | 활용 |
|---|---|---|
| Claude ephemeral prompt caching | `dongne-golmok/api/ai.js:143-153` | `lib/claude.ts` `callClaudeMessages` |
| Promise.all 데이터 수집 + 1인칭 페르소나 | `harbor-community/api/moon.js:372,396` | `lib/recommend.ts`, `lib/briefing.ts` |
| 4축 분석 JSON 응답 | `harbor-school/week5/quest3-budget-app/api/analyze.js` | `lib/decide.ts` |
| 자체 JWT + pg + ImageKit | `today-room/lib/{auth,db,upload}.ts` | 미사용 (참조용, 다오니는 localStorage) |
| gpt-image-1 패턴 → gpt-image-2 | `week7/quest/business-card/server.js:78` 등 | `lib/openai.ts:generateImage` |

---

## 발표

5분 흐름 6 단계 + 12 재활용 패턴 카드: [`public/presentation.html`](./public/presentation.html)
