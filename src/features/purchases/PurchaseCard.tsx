// src/features/purchases/PurchaseCard.tsx
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import type { PurchaseEntity } from "@/db/schema";

type Props = {
  purchase: PurchaseEntity;
  onEdit: () => void;
  onDelete: () => void;
};

export default function PurchaseCard({ purchase, onEdit, onDelete }: Props) {
  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Swipe actions (behind) */}
      <div className="absolute inset-y-0 right-0 flex">
        <button
          onClick={onEdit}
          className="w-14 flex items-center justify-center bg-gray-100 text-gray-600"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={onDelete}
          className="w-14 flex items-center justify-center bg-gray-200 text-gray-700"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -112, right: 0 }}
        dragElastic={0.12}
        className="
          relative bg-white rounded-xl px-4 py-3
          shadow-sm border border-gray-100
          active:cursor-grabbing
        "
      >
        <div className="flex justify-between items-start gap-3">
          {/* Left */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              {purchase.itemName}
            </span>
            <span className="text-xs text-gray-500">{purchase.shopName}</span>
          </div>

          {/* Right */}
          <div className="text-right shrink-0">
            <div className="text-sm font-semibold text-gray-900">
              ₹{purchase.unitPrice * purchase.quantity}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(purchase.date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
