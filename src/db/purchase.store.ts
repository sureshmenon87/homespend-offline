import type { PurchaseFilters } from "@/features/purchases/types";
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
  cursor?: string;
  filters: PurchaseFilters;
}): Promise<{
  rows: PurchaseEntity[];
  nextCursor?: string;
}> {
  let collection = db.purchases.orderBy("date").reverse();

  // basic filter example (expand later)
  if (filters.search) {
    collection = collection.filter(
      (p) =>
        p.itemName.toLowerCase().includes(filters.search!.toLowerCase()) ||
        p.shopName.toLowerCase().includes(filters.search!.toLowerCase()),
    );
  }

  if (cursor) {
    collection = collection.offset(Number(cursor));
  }

  const rows = await collection.limit(PAGE_SIZE).toArray();
  const nextCursor =
    rows.length === PAGE_SIZE
      ? String((cursor ? Number(cursor) : 0) + PAGE_SIZE)
      : undefined;

  return { rows, nextCursor };
}
