import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { useRef } from "react";
import type { PurchaseEntity } from "@/db/schema";

type Props = {
  purchase: PurchaseEntity;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function PurchaseCard({
  purchase,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  const timerRef = useRef<number | null>(null);

  // 👉 long press (mobile)
  const onPressStart = () => {
    timerRef.current = window.setTimeout(onToggle, 450);
  };
  const onPressEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <motion.div
      layout
      onMouseDown={onPressStart}
      onMouseUp={onPressEnd}
      onMouseLeave={onPressEnd}
      onTouchStart={onPressStart}
      onTouchEnd={onPressEnd}
      className="relative bg-white rounded-xl shadow-sm mb-3 overflow-hidden"
    >
      {/* MAIN ROW */}
      <div
        className="px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div>
          <div className="font-semibold text-sm uppercase">
            {purchase.itemName}
          </div>
          <div className="text-xs text-gray-500">{purchase.shopName}</div>
        </div>

        <div className="text-right">
          <div className="font-semibold text-sm">
            ₹{purchase.unitPrice * purchase.quantity}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(purchase.date).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* EXPANDED */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 text-sm text-gray-700"
          >
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>Qty: {purchase.quantity}</div>
              <div>Unit: ₹{purchase.unitPrice}</div>
              <div>MRP: ₹{purchase.mrp}</div>
              <div>Category: {purchase.categoryName}</div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onEdit}
                className="flex items-center gap-1 text-gray-600 hover:text-black"
              >
                <Pencil size={16} />
                Edit
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-1 text-red-500 hover:text-red-600"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
