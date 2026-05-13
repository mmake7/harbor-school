import { generateDayState } from "@/data/seed-daily";
import { CROPS } from "@/data/crops";
import { QUARTERS } from "@/data/seed-quarters";

export function DaoniActionLog({ day }: { day: number }) {
  const ds = generateDayState(day);
  const q = QUARTERS.find((x) => x.id === ds.quarter);
  const crop = q ? CROPS.find((c) => c.id === q.cropId) : undefined;
  const cropName = crop?.name ?? "작물";

  const actions: { time: string; text: string }[] = [
    { time: "06:30", text: `${cropName} 화방 상태 점검. 신규 꽃대 ${(day % 7) + 2}개 확인.` },
    { time: "07:15", text: `LED 일조 보조 ${ds.sensors.light_lux.toLocaleString()} lux 안정 가동.` },
    { time: "08:00", text: `토양 수분 ${ds.sensors.soil_moisture}% — 정상 범위, 관수 일정 그대로.` },
    {
      time: "09:42",
      text: `벌통 활동 ${ds.sensors.beehive_activity}/100 — ${
        ds.sensors.beehive_activity > 50 ? "활발, 수분 진행 중" : "낮음, 보온 점검"
      }.`,
    },
    { time: "10:30", text: `시장 가격 모니터링 — ${q?.id ?? ""} 시즌 주력 단가 안정.` },
    { time: "11:15", text: `오늘의 식탁 추천 1건 손님께 제안 완료.` },
    {
      time: "13:20",
      text: `환기 측창 30% 개방 — 외부 ${ds.weather.temp}°C, ${ds.weather.description}.`,
    },
    { time: "15:48", text: `이미지 콘텐츠 1건 생성 대기 — Tell 모듈 큐.` },
    { time: "17:00", text: `센서 로그 정리, 이상치 0건.` },
    { time: "19:30", text: `내일 일정 정리 — ${cropName} 화방 추가 점검.` },
  ];

  return (
    <div className="bg-base border-[0.5px] border-border rounded-lg p-4">
      <div className="text-xs text-muted mb-3">지금 다온이가 하고 있는 일</div>
      <ul className="space-y-1.5 text-sm">
        {actions.map((a, i) => (
          <li key={i} className="flex gap-3">
            <span className="font-mono text-xs text-muted-light w-12 shrink-0">{a.time}</span>
            <span className="text-ink">{a.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
