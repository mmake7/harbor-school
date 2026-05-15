import Image from "next/image";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { DaoniNamecard } from "@/components/brand/DaoniNamecard";
import { DaoniMenuPreview } from "@/components/brand/DaoniMenuPreview";
import { DaoniPoster } from "@/components/brand/DaoniPoster";
import { FARM } from "@/data/farm";

export default function AboutPage() {
  const personaFirstLine = FARM.daoniPersona.split("\n")[0];

  return (
    <>
      <Header variant="customer" />
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* 히어로 */}
        <section className="text-center max-w-xl mx-auto">
          <div className="text-xs tracking-[0.18em] text-muted uppercase mb-3">
            About · 다온이
          </div>
          <h1 className="text-3xl font-bold text-ink tracking-tight">
            다온이의 정체성
          </h1>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            {FARM.name} · {FARM.placement} · est. {FARM.foundedAt}
          </p>
        </section>

        {/* 농장 전경 */}
        <section className="max-w-4xl mx-auto">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden border-[0.5px] border-border bg-surface">
            <Image
              src="/seed-images/farm-overview.png"
              alt={`${FARM.name} 전경`}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          </div>
          <div className="mt-3 text-center text-xs text-muted">
            {FARM.location} · {FARM.placement}
          </div>
        </section>

        {/* 1. 명함 */}
        <section>
          <SectionLabel index="01" title="Namecard" subtitle="이름을 만나는 자리" />
          <div className="mt-6">
            <DaoniNamecard />
          </div>
        </section>

        {/* 2. 메뉴 미리보기 */}
        <section>
          <SectionLabel index="02" title="Menu" subtitle="지금 식탁에 올라가는 것" />
          <div className="mt-6">
            <DaoniMenuPreview currentCropId="strawberry" />
          </div>
        </section>

        {/* 3. 포스터 */}
        <section>
          <SectionLabel index="03" title="Poster" subtitle="이번 시즌의 신호" />
          <div className="mt-6">
            <DaoniPoster cropId="strawberry" />
          </div>
        </section>

        {/* 푸터 — brand story */}
        <section className="max-w-xl mx-auto text-center pt-6 border-t border-border">
          <div className="text-xs tracking-[0.18em] text-muted uppercase mb-3">
            Brand Story
          </div>
          <div className="text-base text-ink leading-relaxed">{FARM.tagline}</div>
          <div className="mt-2 text-sm text-muted leading-relaxed">{personaFirstLine}</div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function SectionLabel({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-w-[480px] mx-auto flex items-baseline gap-3">
      <span className="font-mono text-xs text-muted-light">{index}</span>
      <div>
        <div className="text-sm font-bold text-ink tracking-tight">{title}</div>
        <div className="text-xs text-muted">{subtitle}</div>
      </div>
    </div>
  );
}
