// src/features/purchases/PurchasesList.tsx
import { deletePurchase } from "@/db/purchase.store";
import PurchaseCard from "./PurchaseCard";
import type { PurchaseEntity } from "@/db/schema";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
type Props = {
  purchases: PurchaseEntity[];
};

export default function PurchasesList({ purchases }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleDelete = async (id: string) => {
    await deletePurchase(id);
    toast.success("Purchase deleted");
    queryClient.invalidateQueries({
      queryKey: ["purchases"],
    });
  };

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
        <PurchaseCard
          purchase={p}
          onEdit={() => navigate(`/purchase/edit/${p.id}`)}
          onDelete={() => handleDelete(p.id)}
        />
      ))}
    </div>
  );
}
