// src/hooks/usePurchases.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPurchasesChunk } from "@/db/purchase.store";
import type { PurchaseFilters } from "@/features/purchases/types";

export function usePurchases(filters: PurchaseFilters) {
  return useInfiniteQuery({
    queryKey: ["purchases", filters],
    initialPageParam: undefined as string | undefined,

    queryFn: ({ pageParam }) =>
      getPurchasesChunk({
        cursor: pageParam,
        filters,
      }),

    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
