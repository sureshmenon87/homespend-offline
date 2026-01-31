import type { PurchaseFilters } from "./types";

type Props = {
  filters: PurchaseFilters;
  onChange: (v: PurchaseFilters) => void;
};

export default function PurchasesFilters({ filters, onChange }: Props) {
  return (
    <div className="px-4 py-2">
      <button
        className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm"
        onClick={() => onChange({ ...filters, dateRange: "thisMonth" })}
      >
        This month
      </button>
    </div>
  );
}
