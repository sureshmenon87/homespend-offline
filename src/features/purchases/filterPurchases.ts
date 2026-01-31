import type { PurchaseEntity } from "@/db/schema";
import type { PurchaseFilters } from "./types";

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function filterAndGroupPurchases(
  purchases: PurchaseEntity[],
  filters: PurchaseFilters,
) {
  let list = [...purchases];

  /* 🔍 SEARCH */
  if (filters.search?.trim()) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.itemName.toLowerCase().includes(q) ||
        p.shopName.toLowerCase().includes(q),
    );
  }

  /* 📅 DATE RANGE */
  if (filters.from || filters.to) {
    const from = filters.from ? new Date(filters.from) : null;
    const to = filters.to ? new Date(filters.to) : null;

    list = list.filter((p) => {
      const d = new Date(p.date);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }

  /* 🗂 GROUP BY DATE */
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const groups: Record<
    string,
    { label: string; rows: PurchaseEntity[]; total: number }
  > = {};

  for (const p of list) {
    const d = new Date(p.date);
    let key = d.toISOString().split("T")[0];
    let label = d.toDateString();

    if (isSameDay(d, today)) label = "Today";
    else if (isSameDay(d, yesterday)) label = "Yesterday";

    if (!groups[key]) {
      groups[key] = { label, rows: [], total: 0 };
    }

    groups[key].rows.push(p);
    groups[key].total += p.unitPrice * p.quantity;
  }

  return Object.values(groups).sort((a, b) => (a.label === "Today" ? -1 : 0));
}
