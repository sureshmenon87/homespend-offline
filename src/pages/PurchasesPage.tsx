import { usePurchases } from "@/hooks/usePurchases";
import PurchasesList from "@/features/purchases/PurchasesList";

export default function PurchasesPage() {
  const { data: purchases = [], isLoading } = usePurchases();

  if (isLoading) {
    return <div className="p-4">Loading purchases…</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EDE9FE] via-[#F5F3FF] to-white">
      <header className="px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Purchases</h1>
        <button className="btn-primary">+ Add</button>
      </header>

      <PurchasesList purchases={purchases} />
    </div>
  );
}
