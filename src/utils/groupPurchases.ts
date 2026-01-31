import { isToday, isYesterday, format } from "date-fns";
import type { PurchaseEntity } from "@/db/schema";

export function groupPurchases(purchases: PurchaseEntity[]) {
  const groups: Record<string, PurchaseEntity[]> = {};

  for (const p of purchases) {
    const d = new Date(p.date);
    let key = "";

    if (isToday(d)) key = "Today";
    else if (isYesterday(d)) key = "Yesterday";
    else key = format(d, "MMM yyyy");

    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }

  return groups;
}
