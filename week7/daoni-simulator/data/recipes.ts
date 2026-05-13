// "오늘의 식탁" 추천 풀 (정적, 8개)
// crop은 출처 작물. 꿀 레시피는 출처 작물의 honey id를 paired_with에 둠.
import type { Crop } from "./crops";

export type Recipe = {
  id: string;
  name: string;
  crop: Crop["id"];
  time_min: number;
  ingredients: string[];
  paired_with: string[]; // 다른 crop id 또는 honey id (cross-sell 트리거)
  method_short: string;
};

export const RECIPES: Recipe[] = [
  {
    id: "r-strawberry-fresh",
    name: "생딸기 한 접시",
    crop: "strawberry",
    time_min: 2,
    ingredients: ["딸기"],
    paired_with: [],
    method_short: "씻어서 꼭지 따고 그대로. 차게.",
  },
  {
    id: "r-strawberry-milk",
    name: "딸기 우유",
    crop: "strawberry",
    time_min: 5,
    ingredients: ["딸기", "우유 200ml", "꿀 1스푼"],
    paired_with: ["strawberry-honey"],
    method_short: "딸기 으깨 우유에 섞고 꿀 한 스푼.",
  },
  {
    id: "r-strawberry-yogurt",
    name: "딸기 요거트 볼",
    crop: "strawberry",
    time_min: 5,
    ingredients: ["딸기", "그릭요거트", "그래놀라"],
    paired_with: ["blueberry"],
    method_short: "요거트 위에 딸기·그래놀라 토핑.",
  },
  {
    id: "r-blueberry-granola",
    name: "블루베리 그래놀라 볼",
    crop: "blueberry",
    time_min: 5,
    ingredients: ["블루베리", "그래놀라", "우유 또는 요거트"],
    paired_with: ["strawberry"],
    method_short: "한 그릇에 다 넣어 차갑게.",
  },
  {
    id: "r-blueberry-muffin",
    name: "블루베리 머핀",
    crop: "blueberry",
    time_min: 35,
    ingredients: ["블루베리", "박력분", "설탕", "버터", "계란"],
    paired_with: [],
    method_short: "반죽에 블루베리 섞어 오븐 180도 25분.",
  },
  {
    id: "r-melon-prosciutto",
    name: "멜론 생햄",
    crop: "melon",
    time_min: 5,
    ingredients: ["멜론", "프로슈토"],
    paired_with: [],
    method_short: "멜론 슬라이스 위에 햄 한 장씩.",
  },
  {
    id: "r-melon-bingsu",
    name: "멜론 빙수",
    crop: "melon",
    time_min: 10,
    ingredients: ["멜론", "우유 얼음", "연유"],
    paired_with: ["melon-honey"],
    method_short: "우유 얼음 갈고 멜론 큐브 올려 연유 한 줄.",
  },
  {
    id: "r-strawberry-honey-toast",
    name: "딸기 꿀 토스트",
    crop: "strawberry",
    time_min: 5,
    ingredients: ["식빵", "버터", "딸기 꽃 꿀"],
    paired_with: ["strawberry-honey"],
    method_short: "토스트에 버터, 그 위에 딸기 꿀 한 줄.",
  },
];
