import type { PurchaseEntity } from "@/db/schema";
import { useNavigate, useParams } from "react-router-dom";
export default function PurchasesList({
  purchases,
}: {
  purchases: PurchaseEntity[];
}) {
  const navigate = useNavigate();
  if (purchases.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">No purchases yet</div>
    );
  }

  return (
    <div className="px-4 space-y-3">
      {purchases.map((p) => (
        <div
          key={p.id}
          className="bg-white/80 rounded-xl px-4 py-3 shadow"
          onClick={() => navigate(`/purchase/edit/${p.id}`)}
        >
          <div className="flex justify-between">
            <div>
              <div className="font-medium">{p.itemName}</div>
              <div className="text-sm text-gray-500">{p.shopName}</div>
            </div>

            <div className="text-right">
              <div className="font-semibold">₹{p.unitPrice * p.quantity}</div>
              <div className="text-xs text-gray-400">{p.date}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
