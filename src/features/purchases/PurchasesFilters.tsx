import type { PurchaseFilters } from "./types";

type Props = {
  filters: PurchaseFilters;
  onChange: (v: PurchaseFilters) => void;
};

export function PurchasesFilters({ filters, onChange }: Props) {
  return (
    <div className="px-4 py-3 flex gap-3">
      <button
        className={`px-3 py-1 rounded ${
          filters.dateRange === "thisMonth"
            ? "bg-blue-600 text-white"
            : "border"
        }`}
        onClick={() => onChange({ dateRange: "thisMonth" })}
      >
        This month
      </button>
    </div>
  );
}
