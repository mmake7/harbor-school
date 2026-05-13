import { DaoniBriefingCard } from "@/components/shared/DaoniBriefingCard";
import { StatTile } from "@/components/admin/StatTile";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">대시보드</h1>
        <p className="text-sm text-muted mt-1">저는 매일 아침 농장 상태와 시장을 정리해 둡니다.</p>
      </header>

      <DaoniBriefingCard />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="농장 상태"        value="—"   hint="작물 4종 평균 생육" icon="ti-plant-2" />
        <StatTile label="오늘 매출"        value="₩0"  hint="단계 6 이후 연결"   icon="ti-cash" />
        <StatTile label="진행 중 콘텐츠"   value="0"   hint="Tell 모듈 대기"     icon="ti-message" />
        <StatTile label="다온이 액션 로그" value="—"   hint="최근 액션 미연결"   icon="ti-history" />
      </div>
    </div>
  );
}
