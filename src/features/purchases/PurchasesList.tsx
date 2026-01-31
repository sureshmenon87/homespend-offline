import { motion } from "framer-motion";
import PurchaseCard from "./PurchaseCard";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export default function PurchasesList({ purchases, onEdit, onDelete }: any) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="px-4">
      {purchases.map((p: any) => (
        <motion.div
          key={p.id}
          drag="x"
          dragConstraints={{ left: -96, right: 0 }}
          dragElastic={0.12}
          className="relative"
        >
          {/* Swipe actions */}
          <div className="absolute right-0 top-0 h-full flex">
            <button
              onClick={() => onEdit(p.id)}
              className="w-12 flex items-center justify-center bg-gray-100 text-gray-600"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => onDelete(p.id)}
              className="w-12 flex items-center justify-center bg-red-50 text-red-500"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <PurchaseCard
            purchase={p}
            expanded={expandedId === p.id}
            onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
            onEdit={() => onEdit(p.id)}
            onDelete={() => onDelete(p.id)}
          />
        </motion.div>
      ))}
    </div>
  );
}
