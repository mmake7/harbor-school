import { FARM } from "@/data/farm";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-12">
      <div className="container mx-auto px-4 py-6 text-sm text-muted">
        <div className="font-medium text-ink">{FARM.name}</div>
        <div>{FARM.tagline} · {FARM.location}</div>
        <div className="mt-2 text-xs text-muted-light">© {FARM.foundedAt} 다온이</div>
      </div>
    </footer>
  );
}
