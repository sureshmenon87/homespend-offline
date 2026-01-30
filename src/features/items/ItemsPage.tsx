import { useMemo, useState } from "react";
import { toast } from "sonner";

import ItemDialog from "./ItemDialog";
import {
  useItemsWithCategory,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
} from "@/hooks/useItems";
import { useCategories } from "@/hooks/useCategories";

type SortKey = "name" | "category";
type SortOrder = "asc" | "desc";

export default function ItemsPage() {
  const { data: items = [] } = useItemsWithCategory();
  const { data: categories = [] } = useCategories();

  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  async function handleSave(data: { name: string; categoryId: string }) {
    if (selected) {
      updateItem.mutate({
        id: selected.id,
        name: data.name,
        categoryId: data.categoryId,
      });
    } else {
      createItem.mutate(data);
    }

    setOpen(false);
    setSelected(null);
  }

  function handleDelete(id: string) {
    deleteItem.mutate(id, {
      onError: () => {
        toast.error("Item is in use and cannot be deleted");
      },
    });
  }

  // 🔍 Search + Sort (unchanged logic)
  const filteredItems = useMemo(() => {
    let result = items.filter((i) => {
      console.log(i);
      return `${i.name} ${i.category.name}`
        .toLowerCase()
        .includes(search.toLowerCase());
    });

    result.sort((a, b) => {
      const aVal = sortKey === "name" ? a.name : a.category.name;
      const bVal = sortKey === "name" ? b.name : b.category.name;

      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

    return result;
  }, [items, search, sortKey, sortOrder]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Items</h1>
        <button
          className="bg-black text-white px-3 py-1"
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          + Add Item
        </button>
      </div>

      {/* Search + Sort */}
      <div className="flex gap-3 items-center">
        <input
          className="border border-app px-3 py-2 w-64"
          placeholder="Search item or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border border-app px-2 py-2"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          <option value="name">Sort by Item</option>
          <option value="category">Sort by Category</option>
        </select>

        <button
          className="border border-app px-3 py-2"
          onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
        >
          {sortOrder === "asc" ? "↑ A–Z" : "↓ Z–A"}
        </button>
      </div>

      {/* Table */}
      <table className="w-full border border-app">
        <thead>
          <tr className="bg-app">
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((i) => (
            <tr key={i.id} className="border-t border-app">
              <td className="p-2">{i.name}</td>
              <td className="p-2">{i.category.name}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => {
                    setSelected(i);
                    setOpen(true);
                  }}
                >
                  ✏️
                </button>
                <button onClick={() => handleDelete(i.id)}>🗑️</button>
              </td>
            </tr>
          ))}

          {filteredItems.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-app">
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ItemDialog
        open={open}
        item={selected}
        categories={categories}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
