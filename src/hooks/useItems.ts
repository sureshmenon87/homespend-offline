import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ItemStore } from "@/db/item.store";
import { db } from "../db/schema";
import { CategoryStore } from "@/db/category.store";

const ITEMS_KEY = ["items-with-category"];
export interface ItemWithCategory {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
}

export function useItemsWithCategory() {
  return useQuery({
    queryKey: ["items-with-category"],
    queryFn: async (): Promise<ItemWithCategory[]> => {
      const items = await db.items.toArray();
      const categories = await db.categories.toArray();

      return items.map((item) => {
        const category = categories.find((c) => c.id === item.categoryId);

        return {
          id: item.id,
          name: item.name,
          categoryId: item.categoryId,
          categoryName: category?.name ?? "",
        };
      });
    },
  });
}

export function useCreateItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: { name: string; categoryId: string }) =>
      ItemStore.create(input.name, input.categoryId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ITEMS_KEY });
    },
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; name: string; categoryId: string }) =>
      ItemStore.update(input.id, input.name, input.categoryId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ITEMS_KEY });
    },
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ItemStore.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ITEMS_KEY });
    },
  });
}
