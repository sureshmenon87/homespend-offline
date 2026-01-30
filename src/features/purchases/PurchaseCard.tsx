import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import type { PurchaseEntity } from "@/db/schema";

interface Props {
  purchase: PurchaseEntity;
  expanded: boolean;
  onToggle: () => void;
}

export default function PurchaseCard({ purchase, expanded, onToggle }: Props) {
  const pressTimer = useRef<number | null>(null);

  function onPointerDown() {
    pressTimer.current = window.setTimeout(() => {
      onToggle(); // 🔥 long-press expands
    }, 500);
  }

  function clearPress() {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerUp={clearPress}
      onPointerLeave={clearPress}
      className="bg-white rounded-xl shadow-sm"
    >
      {/* HEADER */}
      <button onClick={onToggle} className="w-full text-left px-4 py-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-semibold uppercase">{purchase.itemName}</div>
            <div className="text-sm text-gray-500">{purchase.shopName}</div>
          </div>

          <div className="text-right">
            <div className="font-semibold">
              ₹{purchase.unitPrice * purchase.quantity}
            </div>
            <div className="text-xs text-gray-500">{purchase.date}</div>
          </div>
        </div>
      </button>

      {/* EXPANDED CONTENT */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t"
          >
            <div className="px-4 py-3 grid grid-cols-2 gap-3 text-sm">
              <Detail label="Category" value={purchase.categoryName} />
              <Detail label="Quantity" value={purchase.quantity} />
              <Detail label="Unit price" value={`₹${purchase.unitPrice}`} />
              <Detail label="MRP" value={`₹${purchase.mrp}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
