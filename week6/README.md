# 6주차 — 미션 마감 + pivot 정리

5주차와 달리 **공식 미션 PDF가 발행되지 않은 주차**. 형이 직접 정의한 quest 5개를 처리·pivot·갈음한 결과를 묶은 폴더.

---

## 라이브

- 🌐 **https://harbor-community.vercel.app/** — quest #1·#4 통합 SPA, **풀 E2E 검증 완료 (5/8)**
  - `#/shop` 쇼핑 + 이미지 업로드(ImageKit) + TossPayments 결제
  - `#/premium` 유료잠금 콘텐츠
  - 프로덕션 env 3개 박힘 (`IMAGEKIT_PRIVATE_KEY` / `TOSS_CLIENT_KEY` / `TOSS_SECRET_KEY`)
- 🌐 **https://dongne-golmok.vercel.app/** — 동네골목 v1 MVP, **Phase 4 라이브 검증 완료 (5/8)** — quest #5 pivot

---

## Quest 충족 상태

| # | 정체 | 상태 | 폴더 | 핵심 커밋 |
|---|---|---|---|---|
| **#1** | 쇼핑몰 보완 (이미지 업로드 + 결제) | ✅ 마감 | [`quest1-shopping-completion/`](./quest1-shopping-completion/) | `mmake7/harbor-community@e483973` |
| **#2** | 경쟁 서비스 deep dive (Radar v2) | ✅ 마감 | [`quest2-research-agent/`](./quest2-research-agent/) | `mmake7/harbor-school@45baeaf` |
| **#3** | 기획서 3종 (MISSION/DEV/AUDIENCES) | ✅ **본진 충족** (DEV/AUDIENCES v0.1 신규 작성) | [`quest3-planning-docs/`](./quest3-planning-docs/) | dongne-golmok 루트에 DEV.md + AUDIENCES.md push (`5c823ca`), MISSION은 docs/에 (이전 작성) |
| **#4** | 유료잠금 미니 앱 | ✅ **본진 + 라이브 + 보안 3중 게이트** | [`quest4-paid-lock-mini-app/`](./quest4-paid-lock-mini-app/) | `mmake7/harbor-community@5cf11d6`, https://harbor-community.vercel.app/#/premium |
| **#5** | 당근마켓 클론 → 동네골목 pivot | ✅ **pivot + 라이브 + 정식 명세 매핑 + 갈음 정당화** | [`quest5-dongne-golmok/`](./quest5-dongne-golmok/) | 별도 repo `mmake7/dongne-golmok@9c31228`, https://dongne-golmok.vercel.app/ |

각 quest 상세는 폴더 안 README 참조.

---

## 6주차 회고 (한 단락)

**6주차는 *도구·도메인·정체성*을 한꺼번에 갈아엎은 주차였다.** quest #2에서 Radar 방법론은 그대로 두고 **MCP 도구를 Playwright→Chrome DevTools로 교체**, 리서치 도메인을 *학술·기술(vLLM 폐쇄망·엣지 sLLM)*에서 *경쟁 서비스(당근·네이버·인스타)*로 확장했다 — 결과는 *"4가지 발견 양식: 재미·검색·가까움·맥락"* 1p 인사이트. quest #1·#4는 결제/이미지 **두 라이브러리(ImageKit + TossPayments)를 한 모듈로 통합 작성**해 두 quest 동시 충족 + 동네골목 v2 자산을 부산물로 확보 (Vercel Blob 초안 → ImageKit 교체는 동네골목 자산 라인과 일치시키기 위함). quest #5는 *형식적 마감보다 본 프로젝트로의 pivot*을 선택 — *"수능시험도 아니고 결국 내 발전을 위한 거"* (`MD/MISSION.md` 인용) — 당근마켓 클론에서 출발한 게 *AI 컨시어지 동네 알림*으로 진화했다.

---

## 잔여 작업 (의도적으로 미룸)

| 영역 | 작업 | 시점 |
|---|---|---|
| ~~라이브 데모 셋업~~ | ~~Vercel 프로덕션 env 3개 + 재배포~~ | ✅ 5/8 마감 |
| ~~동네골목 Phase 4~~ | ~~Vercel 배포 + 동작 검증~~ | ✅ 5/8 마감 |
| 동네골목 8개 시나리오 풀 검증 | `docs/scenarios_mock.md` 풀 톤 일관성·가게 매칭 정확도 | 후속 패치 (선택) |
| **동네골목 v1.5** | PostgreSQL / JWT / fal 이미지 / PWA로 확장 | 사이드 영역, 데모 반응 보고 |
| **결제 후속** | 취소·환불 / Toss webhook / 카트 흐름 별도 E2E | 라이브 운영 진입 시점 |

### 라이브 셋업 메모 (참고용 — 이미 끝난 작업)

```powershell
cd D:\Dropbox\workspace\harbor-community
# echo가 trailing \n 박는 것 주의 — printf "%s" 권장
printf "%s" "private_..." | vercel env add IMAGEKIT_PRIVATE_KEY production
printf "%s" "test_gck_..." | vercel env add TOSS_CLIENT_KEY production
printf "%s" "test_gsk_..." | vercel env add TOSS_SECRET_KEY production
vercel --prod
```

---

## 폴더 구조

```
week6/
├── README.md                       (이 파일 — 6주차 마감 정리)
├── quest1-shopping-completion/     ✅ 이미지 업로드(ImageKit) + 결제(TossPayments)
├── quest2-research-agent/          ✅ Radar v2 (Chrome DevTools MCP)
├── quest4-paid-lock-mini-app/      ✅ 유료잠금 미니 앱 (결제 모듈 quest #1과 공유)
├── MD/                             ⏳ 동네골목 (quest #5 pivot) 기획 문서 5건
├── agents/                         (재사용 에이전트 정의 2건)
└── dongne_golmok_v4.pptx           (동네골목 PPT v4 — v5는 Phase 4 후 갱신)
```

---

## 공식 미션 PDF 부재에 대한 메모

5주차에는 `week5/plan/PRIME_Week5_Plan.pdf` 같은 공식 미션 문서가 있었으나, 6주차는 발행되지 않음 (5/8 확인). 따라서 6주차 quest 정체는 형이 직접 정의·기억한 5개 + #3은 끝까지 정체 미상. 추후 세션에서 PDF 다시 찾으려 시간 쓰지 않기로 한 결정.
