import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import PurchaseCard from "./PurchaseCard";
import type { PurchaseEntity } from "@/db/schema";
import { deletePurchase } from "@/db/purchase.store";

interface Props {
  purchases: PurchaseEntity[];
}

export default function PurchasesList({ purchases }: Props) {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    await deletePurchase(id);
  }

  return (
    <div className="px-4 space-y-3">
      {purchases.map((p) => (
        <div key={p.id} className="relative overflow-hidden">
          {/* Swipe actions (behind) */}
          <div className="absolute right-0 top-0 h-full flex">
            <button
              className="w-16 bg-blue-500 text-white"
              onClick={() => navigate(`/purchase/edit/${p.id}`)}
            >
              ✏️
            </button>
            <button
              className="w-16 bg-red-500 text-white"
              onClick={() => handleDelete(p.id)}
            >
              🗑
            </button>
          </div>

          {/* Swipeable card */}
          <motion.div
            drag="x"
            dragConstraints={{ left: -128, right: 0 }}
            dragElastic={0.15}
          >
            <PurchaseCard
              purchase={p}
              expanded={expandedId === p.id}
              onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
            />
          </motion.div>
        </div>
      ))}
    </div>
  );
}
