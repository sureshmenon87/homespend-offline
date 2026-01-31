import { useInfiniteQuery } from "@tanstack/react-query";
import { getPurchasesChunk } from "@/db/purchase.store";
import type { PurchaseFilters } from "@/features/purchases/types";

export function usePurchases(filters: PurchaseFilters) {
  return useInfiniteQuery({
    queryKey: ["purchases", filters],
    queryFn: ({ pageParam }) =>
      getPurchasesChunk({
        cursor: pageParam,
        filters,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
