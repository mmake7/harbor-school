// 분기 결정(decisionDay) 직전 30일 시장 시계열 (5-7 신호/분기)
// 가격은 mock이지만 한국 시장 분위기 반영 (정확 숫자 X)
import type { Quarter } from "./seed-quarters";

export type MarketNewsItem = {
  headline: string;
  summary: string;
  source: string;
};

export type MarketSignal = {
  date: string;
  cropPrices: { strawberry?: number; blueberry?: number; melon?: number };
  newsItems: MarketNewsItem[];
  trendNote: string;
};

export const MARKET_SIGNALS_BY_QUARTER: Record<Quarter["id"], MarketSignal[]> = {
  Q1: [
    {
      date: "2025-12-20",
      cropPrices: { strawberry: 16500 },
      newsItems: [
        { headline: "12월 딸기 도매가 평년 대비 +14%", summary: "수입 물량 감소가 직접 가격에 반영. 1월 추가 상승 전망.", source: "KAMIS" },
        { headline: "강서구 친환경 농산물 직거래 매출 ↑", summary: "동네 마켓·픽업 채널 확장 추세.", source: "서울신문" },
      ],
      trendNote: "딸기 진입 가격 안정·상방",
    },
    {
      date: "2025-12-30",
      cropPrices: { strawberry: 17200 },
      newsItems: [
        { headline: "설 디저트 시장 — 생딸기 키워드 검색 +38%", summary: "카페·디저트 가게의 사전 발주 활발.", source: "농민신문" },
        { headline: "수입 딸기 1월 물량 18% 감소 확정", summary: "국내 도매가 강세 지속 예상.", source: "한국농수산식품유통공사" },
      ],
      trendNote: "수입 감소 + 명절 수요 겹침",
    },
    {
      date: "2026-01-15",
      cropPrices: { strawberry: 18100 },
      newsItems: [
        { headline: "1월 한파로 일조량 부족, 출하량 감소", summary: "도매시장 단가 평년 +28%.", source: "KAMIS" },
        { headline: "동네 카페 — 생딸기 케이크 단가 인상 결정", summary: "원물 가격 반영, 단골 호응.", source: "식품저널" },
      ],
      trendNote: "한파 변수, 단가 추가 상방",
    },
    {
      date: "2026-01-28",
      cropPrices: { strawberry: 18400 },
      newsItems: [
        { headline: "설 일주일 전 — 디저트 가게 발주 정점", summary: "옥상농장·로컬 직거래 비중 ↑.", source: "농민신문" },
        { headline: "옥상농장 친환경 인증 — 단골 마케팅 효과 확인", summary: "구매전환율 평균 대비 +22%.", source: "서울신문" },
      ],
      trendNote: "명절 직전 정점 — 진입 적기",
    },
    {
      date: "2026-02-10",
      cropPrices: { strawberry: 17800 },
      newsItems: [
        { headline: "설 직후 단가 소폭 조정", summary: "다만 2~3월 일조 회복으로 출하 늘면 안정세.", source: "KAMIS" },
      ],
      trendNote: "정점 후 안정 — 출하 흐름 유지",
    },
    {
      date: "2026-03-01",
      cropPrices: { strawberry: 16900 },
      newsItems: [
        { headline: "3월 디저트 매출 — 생딸기 라테 트렌드 지속", summary: "분기 후반까지 수요 받침.", source: "농민신문" },
      ],
      trendNote: "수확 후반기 — 단가 안착",
    },
  ],

  Q2: [
    {
      date: "2026-03-15",
      cropPrices: { blueberry: 24000 },
      newsItems: [
        { headline: "수입 블루베리 1분기 물량 12% 감소", summary: "국산 베리 가격 강세 분기 전반 예상.", source: "KAMIS" },
        { headline: "여름 카페 신메뉴 키워드 — 베리 라테·요거트 볼", summary: "5월 시즌 메뉴 교체 발주 시작.", source: "농민신문" },
      ],
      trendNote: "수입 감소 + 카페 시즌 진입",
    },
    {
      date: "2026-04-05",
      cropPrices: { blueberry: 25500 },
      newsItems: [
        { headline: "4월 일교차 — 베리 농가 야간 보온 비용 ↑", summary: "옥상농장은 LED·온도 제어로 우위.", source: "식품저널" },
        { headline: "친환경 베리 직거래 — 강서구 시범 확대", summary: "도시농 참여 농가 증가.", source: "서울신문" },
      ],
      trendNote: "단가 상승, 옥상농장 유리",
    },
    {
      date: "2026-05-01",
      cropPrices: { blueberry: 27000 },
      newsItems: [
        { headline: "5월 베리 수요 정점 — 카페·베이커리 동시 발주", summary: "도매 단가 평년 +15%.", source: "한국농수산식품유통공사" },
        { headline: "키위 수입 감소 → 베리 대체 수요 확장", summary: "블루베리·오디 키워드 검색 ↑.", source: "식품저널" },
      ],
      trendNote: "정점 수요·진입 적기",
    },
    {
      date: "2026-05-25",
      cropPrices: { blueberry: 26200 },
      newsItems: [
        { headline: "장마 진입 — 옥상 빗물 차단·습도 관리 중요", summary: "농가별 시설 점검 권고.", source: "농민신문" },
      ],
      trendNote: "장마 변수 — 시설 점검 시점",
    },
    {
      date: "2026-06-20",
      cropPrices: { blueberry: 25800 },
      newsItems: [
        { headline: "6월 베리 도매 — 장마에도 단가 안정세", summary: "친환경 인증 농가 평균 단가 +9%.", source: "KAMIS" },
      ],
      trendNote: "분기 마무리 — 단가 안착",
    },
  ],

  Q3: [
    {
      date: "2026-06-25",
      cropPrices: { melon: 19000 },
      newsItems: [
        { headline: "올여름 폭염일수 전년 +9일 전망", summary: "수분 많은 과실 수요 강세 예측.", source: "KAMIS" },
        { headline: "추석 멜론 선물세트 — 작년 +21% 매출 기록", summary: "도시농 직거래 비중 확대.", source: "농민신문" },
      ],
      trendNote: "폭염·추석 두 신호 동시",
    },
    {
      date: "2026-07-10",
      cropPrices: { melon: 20500 },
      newsItems: [
        { headline: "7월 폭염 — 멜론 도매 단가 +8%", summary: "수요 상방, 출하 조절 핵심.", source: "한국농수산식품유통공사" },
        { headline: "옥상농장 직사광 — 멜론 당도 유리", summary: "동네 단골 픽업 호응.", source: "서울신문" },
      ],
      trendNote: "단가 상승 안착",
    },
    {
      date: "2026-08-05",
      cropPrices: { melon: 22000 },
      newsItems: [
        { headline: "8월 멜론 도매 단가 폭염 영향 11% 상승", summary: "출하량 대비 수요 우위.", source: "KAMIS" },
        { headline: "동네 단골 — '오늘 딴 멜론' 픽업 수요 ↑", summary: "마트 대비 신선도 차별화 작동.", source: "식품저널" },
      ],
      trendNote: "한여름 정점",
    },
    {
      date: "2026-08-25",
      cropPrices: { melon: 21500 },
      newsItems: [
        { headline: "추석 2주 전 — 선물세트 발주 시작", summary: "프리미엄 멜론 비중 ↑.", source: "농민신문" },
      ],
      trendNote: "명절 발주 진입",
    },
    {
      date: "2026-09-15",
      cropPrices: { melon: 20800 },
      newsItems: [
        { headline: "추석 직전 — 멜론 출하 정점", summary: "9월 후반 일교차로 후속 단가 조정.", source: "KAMIS" },
      ],
      trendNote: "분기 마무리 — 추석 정점",
    },
  ],

  Q4: [
    {
      date: "2026-09-25",
      cropPrices: {},
      newsItems: [
        { headline: "딸기 농가 — 10~12월 모종 단계가 수확량 7할 결정", summary: "내년 봄 출하 품질 사전 확보 핵심.", source: "KAMIS" },
      ],
      trendNote: "출하 X — 다음 시즌 준비 분기",
    },
    {
      date: "2026-10-20",
      cropPrices: {},
      newsItems: [
        { headline: "도시농 겨울 준비 — LED·CO₂·온도 통합 관리 사례", summary: "옥상농장 평균 효율 +18% 보고.", source: "농민신문" },
        { headline: "강서구 옥상농장 — 비수확기 단골 소통 전략", summary: "예약 콘텐츠·시즌 카드 활용.", source: "서울신문" },
      ],
      trendNote: "모종·시설 정비 시점",
    },
    {
      date: "2026-11-10",
      cropPrices: {},
      newsItems: [
        { headline: "11월 평년 기온 — 모종 안정 단계", summary: "예비 전력·단열 11월 마감 권고.", source: "한국농수산식품유통공사" },
      ],
      trendNote: "단열·예비 전력 사전 점검",
    },
    {
      date: "2026-11-30",
      cropPrices: {},
      newsItems: [
        { headline: "12월 한파 전망 — 사전 점검 마지막 시점", summary: "한파일수 평년 대비 +5일 전망.", source: "KAMIS" },
        { headline: "동네 카페 — 내년 봄 첫 딸기 예약 마케팅 시작", summary: "옥상농장 콘텐츠 협업 사례.", source: "식품저널" },
      ],
      trendNote: "한파 대비 + 예약 콘텐츠 진입",
    },
    {
      date: "2026-12-25",
      cropPrices: {},
      newsItems: [
        { headline: "2027 봄 딸기 가격 — 모종 단계 품질이 핵심 변수", summary: "내년 1월 출하부터 단가 차별화.", source: "한국농수산식품유통공사" },
      ],
      trendNote: "분기 마감 — 다음 Q1 진입 직전",
    },
  ],
};
