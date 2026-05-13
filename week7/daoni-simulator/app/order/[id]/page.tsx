import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { FARM } from "@/data/farm";

export default function OrderDonePage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header variant="customer" />
      <main className="container mx-auto px-4 py-8 max-w-xl text-center">
        <div className="inline-block bg-primary-light text-primary-dark rounded-full px-4 py-1 text-xs font-medium">
          주문 완료
        </div>
        <h1 className="text-3xl font-bold text-ink mt-4">감사합니다, 염창동 단골님</h1>
        <p className="text-muted mt-2 font-mono text-xs">주문 번호 {params.id}</p>

        <div className="bg-ink text-white rounded-lg p-5 mt-8 text-left flex gap-3">
          <span className="block w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
          <div className="text-sm leading-relaxed">
            <div className="text-white/70 text-xs mb-1">다온이 정산 인사</div>
            <div className="text-white/90">
              오늘 저희 {FARM.name}에 들러주셔서 감사해요. 정산·발송 자세한 흐름은 단계 6 이후에 채워드릴게요.
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
