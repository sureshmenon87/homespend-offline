import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryStore } from "@/db/category.store";

const KEY = ["categories"];

export function useCategories() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => CategoryStore.getAll(),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: { name: string; description?: string }) =>
      CategoryStore.create(input.name, input.description),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; name: string; description?: string }) =>
      CategoryStore.update(input.id, input.name, input.description),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CategoryStore.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}
