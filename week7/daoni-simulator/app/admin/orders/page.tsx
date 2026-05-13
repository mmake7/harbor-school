export default function OrdersAdminPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">주문</h1>
        <p className="text-sm text-muted mt-1">주문이 들어오면 여기로 정리해 둘게요.</p>
      </header>

      <div className="bg-base border-[0.5px] border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-xs text-muted">
            <tr>
              <th className="text-left p-3 font-medium">주문번호</th>
              <th className="text-left p-3 font-medium">상품</th>
              <th className="text-left p-3 font-medium font-mono">금액</th>
              <th className="text-left p-3 font-medium">상태</th>
              <th className="text-left p-3 font-medium">날짜</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="text-center p-10 text-muted">
                아직 주문 없어요. 단계 6 이후 손님 결제와 연결돼요.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
