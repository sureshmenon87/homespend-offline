import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CategorySelect } from "@/components/CategorySelect";
import type { CategoryEntity, ItemEntity } from "@/db/schema";

interface Props {
  open: boolean;
  item?: ItemEntity | null;
  categories: CategoryEntity[];
  onClose: () => void;
  onSave: (data: { name: string; categoryId: string }) => Promise<void>;
}

export default function ItemDialog({
  open,
  item,
  categories,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // 🔁 Reset state when dialog opens or item changes
  useEffect(() => {
    if (!open) return;

    setName(item?.name ?? "");
    setCategoryId(item?.categoryId ?? categories[0]?.id ?? "");
  }, [open, item, categories]);

  if (!open) return null;

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Item name is required");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    try {
      setSaving(true);
      await onSave({
        name: name.trim().toUpperCase(),
        categoryId,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "Enter") handleSave();
      }}
      tabIndex={-1}
    >
      <div className="bg-card p-4 rounded w-96">
        <h2 className="font-semibold mb-3">
          {item ? "Edit Item" : "Add Item"}
        </h2>

        {/* Item name */}
        <input
          className="border w-full p-2 mb-3"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
        />

        {/* Category */}
        <CategorySelect
          value={categoryId}
          categories={categories}
          onChange={setCategoryId}
        />

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="border px-3 py-1 rounded"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            className="bg-black text-white px-3 py-1 rounded disabled:opacity-50"
            disabled={!name.trim() || !categoryId || saving}
            onClick={handleSave}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
