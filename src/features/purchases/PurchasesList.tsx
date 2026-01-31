// src/features/purchases/PurchasesList.tsx
import PurchaseCard from "./PurchaseCard";
import type { PurchaseEntity } from "@/db/schema";

type Props = {
  purchases: PurchaseEntity[];
};

export default function PurchasesList({ purchases }: Props) {
  if (purchases.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 py-6">
        No purchases found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {purchases.map((p) => (
        <PurchaseCard key={p.id} purchase={p} />
      ))}
    </div>
  );
}
