// 4 시즌 작물 + 부산물 꿀 (sprout은 모종이라 honey 없음)
// defaultPrice = 1팩(또는 1통) 기본 단가, 옥상농장 소량 마진 반영

export type Crop = {
  id: "strawberry" | "blueberry" | "melon" | "sprout";
  name: string;
  quarter: 1 | 2 | 3 | 4;
  monthRange: string;
  color: string;
  growthDays: number;
  defaultPrice: number;            // 작물 1팩 가격 (원)
  honey: { id: string; name: string; price: number } | null;
};

export const CROPS: Crop[] = [
  {
    id: "strawberry",
    name: "딸기",
    quarter: 1,
    monthRange: "1~3월",
    color: "#FF4757",
    growthDays: 90,
    defaultPrice: 18000,
    honey: { id: "strawberry-honey", name: "딸기 꽃 꿀", price: 22000 },
  },
  {
    id: "blueberry",
    name: "블루베리",
    quarter: 2,
    monthRange: "4~6월",
    color: "#4F46E5",
    growthDays: 90,
    defaultPrice: 15000,
    honey: { id: "blueberry-honey", name: "블루베리 꽃 꿀", price: 24000 },
  },
  {
    id: "melon",
    name: "멜론",
    quarter: 3,
    monthRange: "7~9월",
    color: "#F59E0B",
    growthDays: 90,
    defaultPrice: 22000,
    honey: { id: "melon-honey", name: "멜론 꽃 꿀", price: 26000 },
  },
  {
    id: "sprout",
    name: "다음 딸기 모종",
    quarter: 4,
    monthRange: "10~12월",
    color: "#84CC16",
    growthDays: 90,
    defaultPrice: 12000,
    honey: null,
  },
];
