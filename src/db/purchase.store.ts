import { db } from "./schema";
import type { PurchaseEntity } from "./schema";
import { nanoid } from "nanoid";

const PAGE_SIZE = 20;

export async function addPurchase(
  data: Omit<PurchaseEntity, "id" | "createdAt">,
) {
  const purchase: PurchaseEntity = {
    id: nanoid(),
    createdAt: Date.now(),
    ...data,
  };

  await db.purchases.add(purchase);
}

export async function updatePurchase(
  id: string,
  data: Partial<PurchaseEntity>,
) {
  await db.purchases.update(id, data);
}

export async function deletePurchase(id: string) {
  await db.purchases.delete(id);
}

export async function getPurchaseById(id: string) {
  return db.purchases.get(id);
}

export async function getPurchasesChunk({
  cursor,
  filters,
}: {
  cursor?: number;
  filters: { dateRange: "thisMonth" | "custom"; from?: string; to?: string };
}) {
  let query = db.purchases.orderBy("date").reverse();

  if (filters.dateRange === "thisMonth") {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10);

    query = query.filter((p) => p.date >= start);
  }

  const rows = await query
    .offset(cursor ?? 0)
    .limit(PAGE_SIZE)
    .toArray();

  return {
    rows,
    nextCursor:
      rows.length === PAGE_SIZE ? (cursor ?? 0) + PAGE_SIZE : undefined,
  };
}
