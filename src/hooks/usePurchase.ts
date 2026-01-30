import { useMutation, useQuery } from "@tanstack/react-query";
import { ExpenseStore } from "@/db/expense.store";

export function useAddPurchase() {
  return useMutation({
    mutationFn: ExpenseStore.create,
  });
}

export function useLastPurchase() {
  return useQuery({
    queryKey: ["last-purchase"],
    queryFn: ExpenseStore.getLast,
  });
}
