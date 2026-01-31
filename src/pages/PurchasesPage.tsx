import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePurchases } from "@/hooks/usePurchases";
import { PurchasesFilters } from "@/features/purchases/PurchasesFilters";
import PurchasesList from "@/features/purchases/PurchasesList";
import type { PurchaseFilters } from "@/features/purchases/types";

export default function PurchasesPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<PurchaseFilters>({
    dateRange: "thisMonth",
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePurchases(filters);

  const purchases = data?.pages.flatMap((p) => p.rows) ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EDE9FE] via-[#F5F3FF] to-white">
      <header className="px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Purchases</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/purchase/add")}
        >
          + Add
        </button>
      </header>

      <PurchasesFilters filters={filters} onChange={setFilters} />

      <PurchasesList purchases={purchases} />

      {hasNextPage && (
        <div className="text-center py-4">
          <button onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
