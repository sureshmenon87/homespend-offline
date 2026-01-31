import { isToday, isYesterday, isThisMonth } from "date-fns";
import type { PurchaseEntity } from "@/db/schema";
import type { PurchaseFilters } from "@/features/purchases/types";

export function filterPurchases(
  purchases: PurchaseEntity[],
  filters: PurchaseFilters,
) {
  return purchases.filter((p) => {
    const d = new Date(p.date);

    // 🗓 Date filter
    if (filters.dateRange === "today" && !isToday(d)) return false;
    if (filters.dateRange === "yesterday" && !isYesterday(d)) return false;
    if (filters.dateRange === "thisMonth" && !isThisMonth(d)) return false;

    if (filters.dateRange === "custom") {
      if (filters.from && p.date < filters.from) return false;
      if (filters.to && p.date > filters.to) return false;
    }

    // 🏪 Shop
    if (filters.shopId && p.shopId !== filters.shopId) return false;

    // 🏷 Category
    if (filters.categoryId && p.categoryId !== filters.categoryId) return false;

    return true;
  });
}
