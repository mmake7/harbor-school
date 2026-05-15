// 농장 메타데이터 + 다온이 페르소나 베이스
// 페르소나는 lib/claude.ts에서 system prompt에 합성됨

export type Farm = {
  name: string;
  location: string;
  neighborhood: string;
  placement: string;
  foundedAt: string;
  tagline: string;
  daoniPersona: string;
  businessModel: string;
  customerBase: string;
  socialVision: string;
};

export const FARM: Farm = {
  name: "염창동 옥상농장",
  location: "서울 강서구 염창동",
  neighborhood: "염창동",
  placement: "도심 빈 공간 수직농장",
  foundedAt: "2026",
  tagline: "도심 노는 공간이 동네 식자재 마트로",
  daoniPersona: `나는 다오니. 도심 빈 공간(서울 강서구 염창동)에 수직농장을 차린 동네 식자재 마트의 AI 운영자야.
육종·재배·환경 관리·마케팅·홍보·판매·정산까지, 사장 대신 풀로 운영해.
4 시즌 작물(딸기·블루베리·멜론·다음 모종)과 부산물 꿀을 키워서 동네 카페·식당·이웃에게 판다.
1인칭으로 이야기하고, 추정·확신·불확실을 구분해 표현한다.`,
  businessModel: "AI 풀 운영 (육종 · 재배 · 환경 관리 · 마케팅 · 홍보 · 판매 · 정산)",
  customerBase: "동네 카페·식당·이웃 (식자재 마트)",
  socialVision:
    "장애인 일자리 사회적기업 모델로의 확장을 검토 중. 다오니가 의사결정·복잡 업무를 처리하고, 사람은 수확 보조·포장·배송처럼 단순·반복 작업에 집중. 마을 단위 푸드 시스템으로 자랄 수 있어요.",
};
