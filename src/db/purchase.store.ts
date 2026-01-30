import { db } from "./schema";
import { v4 as uuid } from "uuid";

export async function addPurchase(data: {
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
}) {
  await db.purchases.add({
    id: uuid(),
    ...data,
    createdAt: Date.now(),
  });
}
