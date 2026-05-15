# 디지털 명함 — DAONi (박인수)

박인수 · DAONi (다온이) 디지털 명함. 아날로그(인쇄) 명함의 **웹 형식 동반판**. Tech Minimal + 한지 톤 그대로, 모바일 우선 카드 레이아웃.

🌐 **라이브**: https://business-card-digital.vercel.app

---

## 구성

| 섹션 | 내용 |
|---|---|
| 1. 헤더 | 박인수 일러스트(원형) + DAONi 로고 + 다온이 + 이름 한·영 + 직책 (Founder & CEO) |
| 2. 태그라인 | "도심 빈 공간을 동네 식자재 마트로. AI가 육종부터 판매까지, 사장 대신 풀로 운영합니다." |
| 3. 액션 그리드 | 📞 전화 · ✉ 이메일 · 💬 카톡 · 🔗 LinkedIn · 🌐 Portfolio (가상) |
| 4. vCard | 큰 다운로드 버튼 + 클라이언트 사이드 QR (qrcode.js CDN) |
| 5. About | DAONi 본질(도심 빈 공간 · 식자재 마트 · AI 풀 운영) + v2.0 비전(사회적기업 확장) |
| 6. 푸터 | 다오니 시뮬레이터 링크 |

---

## 파일

```
business-card-digital/
├── index.html                       단일 페이지
├── style.css                        Tech Minimal + 한지 토큰
├── assets/
│   ├── logo.svg                     DAONi 로고 (../business-card/assets/ 와 공유)
│   ├── portrait.png                 박인수 일러스트 (gpt-image-2 1024×1024, $0.04)
│   └── insoo-park.vcf               vCard 3.0 (다운로드용)
└── .vercel/                         프로젝트 link (gitignore)
```

---

## 디자인 톤 (아날로그와 동일)

| 토큰 | 값 |
|---|---|
| 한지 | `#F5F1E8` |
| 한지 테두리 | `#E5DDD0` |
| 먹 | `#1A1A1A` |
| 골드 (직책 강조) | `#B8946B` |
| 프라이머리 (v2.0 배지) | `#10B981` |
| 폰트 | Inter (영문) + Pretendard Variable (한글), 명조 0 |

---

## 가상 데이터 (과제용)

LinkedIn · Portfolio · 카카오 채널은 가상 값. 실제 연락처(전화·이메일·카톡 ID)는 아날로그 명함과 동일.

| 항목 | 값 |
|---|---|
| 이름·직책 | 박인수 / Founder & CEO |
| 전화 | 010-2649-4695 (실제) |
| 이메일 | makehill@naver.com (실제) |
| 카톡 ID | maketour (실제) |
| LinkedIn | linkedin.com/in/insoo-park-daoni (가상) |
| Portfolio | daoni.io (가상 — 다오니 브랜드 도메인) |
| 카톡 채널 | pf.kakao.com/_daoni (가상) |

---

## 배포

```powershell
cd week7\quest\business-card-digital
vercel --prod --yes --scope mmake7-3440s-projects
```

- 프로젝트: `business-card-digital` (mmake7-3440s-projects)
- 정적 사이트 (build 없음, Vercel 자동 인식 → 8초)
- 자동 alias: `business-card-digital.vercel.app`

---

## 비용

| 자산 | 비용 |
|---|---|
| portrait.png (gpt-image-2 medium 1024×1024) | ~$0.04 |
| **합** | **~$0.04** |

---

## 의도적으로 안 한 것

- 별도 빌드 시스템 — 정적 HTML/CSS 한 장
- 다국어 — 한국어 우선
- 라이트/다크 토글 — 한지 톤 단일
- 외부 폼/예약 — 명함이 본질이라
- 실제 LinkedIn/Portfolio 연결 — 과제니까 가상 데이터
