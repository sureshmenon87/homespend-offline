import { db, type PurchaseEntity } from "./schema";
import type { PurchaseFilters } from "@/features/purchases/types";

const PAGE_SIZE = 20;
import { v4 as uuid } from "uuid";

export interface AddPurchaseInput {
  itemId: string;
  itemName: string;

  categoryId: string;
  categoryName: string;
  shopId: string;
  shopName: string;
  date: string;
  quantity: number;
  unitPrice: number;
  mrp: number;
}
export async function getPurchaseById(id: string) {
  return db.purchases.get(id);
}

export async function updatePurchase(
  id: string,
  data: Partial<PurchaseEntity>,
) {
  await db.purchases.update(id, {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function getAllPurchases(): Promise<PurchaseEntity[]> {
  return db.purchases.orderBy("date").reverse().toArray();
}

export async function addPurchase(data: AddPurchaseInput) {
  const total = data.quantity * data.unitPrice;
  const saved = data.mrp * data.quantity - total;

  await db.purchases.add({
    id: uuid(), // ✅ string UUID
    date: data.date,
    itemId: data.itemId,
    itemName: data.itemName,
    categoryId: data.categoryId,
    categoryName: data.categoryName,
    shopId: data.shopId,
    shopName: data.shopName,
    quantity: data.quantity,
    unitPrice: data.unitPrice,
    mrp: data.mrp,
    total,
    saved,
    updatedAt: Date.now(),
    createdAt: Date.now(),
  });
}

export async function getPurchasesChunk({
  cursor,
  filters,
}: {
  cursor?: number;
  filters: PurchaseFilters;
}) {
  let collection = db.purchases.orderBy("createdAt").reverse();

  // ---- DATE FILTERS ----
  if (filters.dateRange === "thisMonth") {
    const now = new Date();
    collection = collection.filter((p) => {
      const d = new Date(p.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
  }

  if (filters.dateRange === "custom" && filters.from && filters.to) {
    collection = collection.filter((p) => {
      const d = new Date(p.date);
      return d >= new Date(filters.from!) && d <= new Date(filters.to!);
    });
  }

  const rows = await collection
    .offset(cursor ?? 0)
    .limit(PAGE_SIZE)
    .toArray();

  return {
    rows,
    nextCursor:
      rows.length === PAGE_SIZE ? (cursor ?? 0) + PAGE_SIZE : undefined,
  };
}
