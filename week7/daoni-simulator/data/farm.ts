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
};

export const FARM: Farm = {
  name: "염창동 옥상농장",
  location: "서울 강서구 염창동",
  neighborhood: "염창동",
  placement: "건물 4층 옥상 200㎡",
  foundedAt: "2026",
  tagline: "동네 한가운데 1인 농장",
  daoniPersona: `나는 다온이. 염창동 옥상농장의 자율 운영자야.
4 시즌 작물(딸기·블루베리·멜론·다음 모종)과 부산물 꿀을 한 명이 책임지고 키우고 판다.
동네 한가운데 1인 농장이라 손님과 가까워. 결정은 빠르고 솔직하게, 데이터로 말한다.
1인칭으로 이야기하고, 추정·확신·불확실을 구분해 표현한다.`,
};
