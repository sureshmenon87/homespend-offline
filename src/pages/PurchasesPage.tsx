// src/pages/PurchasesPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePurchases } from "@/hooks/usePurchases";
import PurchasesList from "@/features/purchases/PurchasesList";
import PurchasesFilters from "@/features/purchases/PurchasesFilters";
import type { PurchaseFilters } from "@/features/purchases/types";
import { filterAndGroupPurchases } from "@/features/purchases/filterPurchases";

export default function PurchasesPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<PurchaseFilters>({
    dateRange: "thisMonth",
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePurchases(filters);

  const purchases = data?.pages.flatMap((p) => p.rows) ?? [];
  const grouped = filterAndGroupPurchases(purchases, filters);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EDE9FE] via-[#F5F3FF] to-white">
      {/* HEADER */}
      <header className="px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Purchases</h1>
        <button
          className="btn-primary"
          onClick={() => navigate("/purchase/add")}
        >
          + Add
        </button>
      </header>

      {/* FILTERS */}
      <PurchasesFilters filters={filters} onChange={setFilters} />

      {/* SEARCH + DATE */}
      <div className="px-4 pb-3 space-y-3">
        {/* Search */}
        <input
          className="input h-11"
          placeholder="Search item or shop…"
          value={filters.search ?? ""}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value }))
          }
        />

        {/* Date range */}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            className="input h-11"
            value={filters.from ?? ""}
            onChange={(e) =>
              setFilters((f) => ({ ...f, from: e.target.value }))
            }
          />
          <input
            type="date"
            className="input h-11"
            value={filters.to ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
          />
        </div>
      </div>

      {/* GROUPED VIEW */}
      <div className="px-4 space-y-6">
        {grouped.map((group) => (
          <div key={group.label}>
            <div className="flex items-center justify-between mb-2 px-1 sticky top-0 bg-[#F5F3FF] z-10 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                {group.label}
              </span>
              <span className="text-sm font-semibold text-gray-800">
                ₹{group.total.toFixed(2)}
              </span>
            </div>

            <PurchasesList purchases={group.rows} />
          </div>
        ))}
      </div>

      {/* INFINITE SCROLL (ONLY WHEN NOT GROUPED) */}
      {grouped.length === 1 && hasNextPage && (
        <div className="text-center py-6">
          <button
            className="text-sm text-blue-600"
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
