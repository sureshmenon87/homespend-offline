// src/features/purchases/PurchaseCard.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import type { PurchaseEntity } from "@/db/schema";

type Props = {
  purchase: PurchaseEntity;
  onEdit: () => void;
  onDelete: () => void;
};

export default function PurchaseCard({ purchase, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);

  const total = purchase.unitPrice * purchase.quantity;

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Swipe actions (behind) */}
      <div className="absolute inset-y-0 right-0 flex">
        <button
          onClick={(e) => {
            e.stopPropagation(); // ✅ IMPORTANT
            onEdit();
          }}
          className="w-14 flex items-center justify-center bg-gray-100 text-gray-600"
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation(); // ✅ IMPORTANT
            onDelete();
          }}
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
        onClick={() => setExpanded((v) => !v)}
        className="
          relative bg-white rounded-xl px-4 py-3
          shadow-sm border border-gray-100
          active:cursor-grabbing select-none
        "
      >
        {/* Top row */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              {purchase.itemName}
            </span>
            <span className="text-xs text-gray-500">{purchase.shopName}</span>
          </div>

          <div className="text-right shrink-0">
            <div className="text-sm font-semibold text-gray-900">₹{total}</div>
            <div className="text-xs text-gray-400">
              {new Date(purchase.date).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-3 text-xs text-gray-600">
                <div>
                  <div className="text-gray-400">Qty</div>
                  <div className="font-medium text-gray-800">
                    {purchase.quantity}
                  </div>
                </div>

                <div>
                  <div className="text-gray-400">Unit</div>
                  <div className="font-medium text-gray-800">
                    ₹{purchase.unitPrice}
                  </div>
                </div>

                <div>
                  <div className="text-gray-400">MRP</div>
                  <div className="font-medium text-gray-800">
                    ₹{purchase.mrp}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
