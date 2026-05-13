import Link from "next/link";
import { AdminBriefingCard } from "@/components/admin/AdminBriefingCard";
import { StatTile } from "@/components/admin/StatTile";

const CURRENT_DAY = 30;

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">대시보드</h1>
        <p className="text-sm text-muted mt-1">
          저는 매일 아침 농장 상태와 시장을 정리해 둡니다.
        </p>
      </header>

      <AdminBriefingCard day={CURRENT_DAY} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="농장 상태"   value="정상"      hint="작물 4종 평균 65% 생육" icon="ti-plant-2" />
        <StatTile label="오늘 매출"   value="₩432,000" hint="시드 데이터"            icon="ti-cash" />
        <StatTile label="진행 콘텐츠" value="3"        hint="발행 대기"              icon="ti-message" />
        <StatTile label="다온이 액션" value="18"       hint="오늘 수행"              icon="ti-history" />
      </div>

      <div>
        <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">
          빠른 진입
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickLink href="/admin/decide"  label="결정"      icon="ti-bulb" />
          <QuickLink href="/admin/farm"    label="농장"      icon="ti-plant-2" />
          <QuickLink href="/admin/harvest" label="수확"      icon="ti-basket" />
          <QuickLink href="/admin/daoni"   label="다온이 챗" icon="ti-robot" />
        </div>
      </div>
    </div>
  );
}

function QuickLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="bg-base border-[0.5px] border-border rounded-lg p-4 text-center hover:border-border-strong"
    >
      <i className={`ti ${icon} text-2xl text-primary`} />
      <div className="text-sm text-ink mt-2">{label}</div>
    </Link>
  );
}
