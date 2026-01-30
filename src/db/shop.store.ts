import { db } from "./schema";
import { v4 as uuid } from "uuid";

/* Get all shops */
export function getShops() {
  return db.shops.orderBy("name").toArray();
}

/* Create shop */
export async function createShop(name: string) {
  const now = Date.now();
  await db.shops.add({
    id: uuid(),
    name: name.toUpperCase(),
    createdAt: now,
    updatedAt: now,
  });
}

/* Update shop */
export async function updateShop(id: string, name: string) {
  await db.shops.update(id, {
    name: name.toUpperCase(),
    updatedAt: Date.now(),
  });
}

/* Delete shop (BLOCK if used) */
export async function deleteShop(id: string) {
  const used = await db.purchases.where("shopId").equals(id).count();

  if (used > 0) {
    throw new Error("SHOP_IN_USE");
  }

  await db.shops.delete(id);
}
