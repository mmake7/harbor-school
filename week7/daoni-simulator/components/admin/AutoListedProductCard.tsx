import { CROPS } from "@/data/crops";
import type { Listing } from "@/lib/sell";

export function AutoListedProductCard({ listing }: { listing: Listing }) {
  const crop = CROPS.find((c) => c.id === listing.cropId);
  return (
    <div className="bg-base border-[0.5px] border-border rounded-lg p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span
            className="block w-1.5 h-1.5 rounded-full"
            style={{ background: crop?.color }}
          />
          <span className="text-xs text-muted">{crop?.name ?? listing.cropId}</span>
        </div>
        <span className="bg-primary-light text-primary-dark text-[10px] font-medium rounded-full px-2 py-0.5">
          다온이가 등록함
        </span>
      </div>
      <div className="text-ink font-medium">{listing.itemName}</div>
      <div className="font-mono text-xl text-ink mt-1">
        ₩{listing.price.toLocaleString()}
      </div>
      <div className="text-xs text-muted mt-1 font-mono">
        {listing.quantity}{listing.unit === "pack" ? "팩" : "kg"} · 등록{" "}
        {new Date(listing.listedAt).toLocaleString("ko-KR")}
      </div>
      <div className="text-xs text-muted mt-2 leading-relaxed">
        {listing.daoniNote}
      </div>
    </div>
  );
}
