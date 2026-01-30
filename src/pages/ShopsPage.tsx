import { useState } from "react";
import { toast } from "sonner";
import type { ShopEntity } from "@/db/schema";
import ShopDialog from "@/features/shops/ShopDialog";
import {
  useShops,
  useCreateShop,
  useUpdateShop,
  useDeleteShop,
} from "@/hooks/useShops";

export default function ShopsPage() {
  const { data: shops = [] } = useShops();
  const createShop = useCreateShop();
  const updateShop = useUpdateShop();
  const deleteShop = useDeleteShop();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ShopEntity | null>(null);

  async function handleSave(name: string) {
    if (selected) {
      updateShop.mutate({ id: selected.id, name });
    } else {
      createShop.mutate(name);
    }
    setOpen(false);
  }

  function handleDelete(id: string) {
    deleteShop.mutate(id, {
      onError: () =>
        toast.error("Shop is used in purchases and cannot be deleted"),
    });
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Shops</h1>
        <button
          className="bg-black text-white px-3 py-1"
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          + Add
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shops.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.name}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => {
                    setSelected(s);
                    setOpen(true);
                  }}
                >
                  ✏️
                </button>
                <button onClick={() => handleDelete(s.id)}>🗑️</button>
              </td>
            </tr>
          ))}

          {shops.length === 0 && (
            <tr>
              <td colSpan={2} className="p-4 text-center text-gray-500">
                No shops found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ShopDialog
        open={open}
        shop={selected}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
