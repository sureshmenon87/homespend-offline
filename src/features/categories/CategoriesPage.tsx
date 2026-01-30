import { useState } from "react";
import { toast } from "sonner";

import CategoryDialog from "./CategoryDialog";
import { CategoryIcon } from "@/components/CategoryIcon";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/useCategories";
import type { CategoryEntity } from "@/db/schema";

export default function CategoriesPage() {
  // ✅ hooks INSIDE component
  const { data: categories = [] } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<CategoryEntity | null>(null);

  async function handleSave(name: string, description: string) {
    if (selected) {
      updateCategory.mutate({
        id: selected.id,
        name,
        description,
      });
    } else {
      createCategory.mutate({
        name,
        description,
      });
    }

    setOpen(false);
    setSelected(null);
  }

  function handleDelete(categoryId: string) {
    deleteCategory.mutate(categoryId, {
      onError: (err) => {
        if ((err as Error).message === "CATEGORY_IN_USE") {
          toast.error("This category is used by items and cannot be deleted");
        } else {
          toast.error("Failed to delete category");
        }
      },
    });
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-3">
        <h1 className="text-xl font-semibold">Categories</h1>
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

      <table className="w-full border border-app">
        <thead>
          <tr className="bg-app">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 w-32">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-t border-app">
              <td className="p-2 flex items-center gap-2">
                <CategoryIcon icon={c.icon} />
                <span>{c.name}</span>
              </td>

              <td className="p-2 text-sm text-app">{c.description || "—"}</td>

              <td className="p-2 flex gap-2">
                <button
                  onClick={() => {
                    setSelected(c);
                    setOpen(true);
                  }}
                >
                  ✏️
                </button>

                <button
                  className="bg-accent text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(c.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}

          {categories.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-app">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <CategoryDialog
        open={open}
        category={selected}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
