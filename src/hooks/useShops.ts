import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getShops, createShop, updateShop, deleteShop } from "@/db/shop.store";

export function useShops() {
  return useQuery({
    queryKey: ["shops"],
    queryFn: getShops,
  });
}

export function useCreateShop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createShop(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shops"] }),
  });
}

export function useUpdateShop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateShop(id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shops"] }),
  });
}

export function useDeleteShop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteShop(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shops"] }),
  });
}
