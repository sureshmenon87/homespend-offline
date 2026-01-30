import { useEffect, useState } from "react";
import type { ShopEntity } from "@/db/schema";

interface Props {
  open: boolean;
  shop: ShopEntity | null;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function ShopDialog({ open, shop, onClose, onSave }: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(shop?.name ?? "");
  }, [shop]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-80">
        <h2 className="font-semibold mb-3">
          {shop ? "Edit Shop" : "Add Shop"}
        </h2>

        <input
          className="border w-full p-2 mb-4"
          placeholder="Shop name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            className="bg-black text-white px-3 py-1"
            disabled={!name.trim()}
            onClick={() => onSave(name)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
