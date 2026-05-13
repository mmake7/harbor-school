import { generateDayState } from "@/data/seed-daily";
import { CROPS } from "@/data/crops";
import { QUARTERS } from "@/data/seed-quarters";

export function FarmStatusCard({ day }: { day: number }) {
  const ds = generateDayState(day);
  const q = QUARTERS.find((x) => x.id === ds.quarter);
  const crop = q ? CROPS.find((c) => c.id === q.cropId) : undefined;

  return (
    <div className="space-y-4">
      {/* 작물 진척 */}
      <div className="bg-base border-[0.5px] border-border rounded-lg p-5">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: crop?.color }}
          />
          <span className="text-xs text-muted">
            {q?.id} · {q?.monthRange}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <div className="text-xl font-bold text-ink">{crop?.name ?? "—"}</div>
          <div className="font-mono text-sm text-muted">
            Day {ds.day} · {ds.cropProgress}%
          </div>
        </div>
        <div className="h-2 bg-surface rounded overflow-hidden">
          <div
            className="h-2 rounded transition-all"
            style={{ background: crop?.color, width: `${ds.cropProgress}%` }}
          />
        </div>
      </div>

      {/* 환경 센서 */}
      <div>
        <div className="text-xs text-muted mb-2">환경 센서</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SensorCell label="CO₂"      value={`${ds.sensors.co2} ppm`}                                    icon="ti-cloud" />
          <SensorCell label="조도"     value={`${ds.sensors.light_lux.toLocaleString()} lux`}            icon="ti-bulb" />
          <SensorCell label="토양 수분" value={`${ds.sensors.soil_moisture}%`}                            icon="ti-droplet" />
          <SensorCell label="벌통"     value={`${ds.sensors.beehive_activity}/100`}                       icon="ti-flower" />
        </div>
      </div>

      {/* 옥상 날씨 */}
      <div className="bg-surface border-[0.5px] border-border rounded-lg p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted mb-1">옥상 날씨</div>
          <div className="text-ink font-medium">{ds.weather.description}</div>
        </div>
        <div className="font-mono text-sm text-muted text-right">
          {ds.weather.temp}°C · {ds.weather.humidity}%
        </div>
      </div>
    </div>
  );
}

function SensorCell({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-base border-[0.5px] border-border rounded-md p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted">
        <i className={`ti ${icon}`} />
        {label}
      </div>
      <div className="text-sm font-mono text-ink mt-1">{value}</div>
    </div>
  );
}
