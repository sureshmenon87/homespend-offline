import { db } from "./schema";
import { v4 as uuid } from "uuid";

export const ExpenseStore = {
  async create(input: {
    itemId: string;
    categoryId: string;
    shop: string;
    quantity: number;
    unitPrice: number;
    mrp?: number;
    date: number;
  }) {
    const total = input.quantity * input.unitPrice;

    await db.expenses.add({
      id: uuid(),
      ...input,
      total,
      createdAt: Date.now(),
    });
  },

  async getLast() {
    return db.expenses.orderBy("createdAt").last();
  },
};
