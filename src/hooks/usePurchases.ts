import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllPurchases, getPurchasesChunk } from "@/db/purchase.store";
import type { PurchaseFilters } from "@/features/purchases/types";

/*export function usePurchases(filters: PurchaseFilters) {
  return useInfiniteQuery({
    queryKey: ["purchases", filters],
    queryFn: ({ pageParam }) =>
      getPurchasesChunk({
        cursor: pageParam,
        filters,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
*/

export function usePurchases() {
  return useQuery({
    queryKey: ["purchases"],
    queryFn: getAllPurchases,
  });
}
