import { db } from "./schema";
import { v4 as uuid } from "uuid";

export const ItemStore = {
  getAll() {
    return db.items.toArray();
  },

  async create(name: string, categoryId: string) {
    const existing = await db.items.where("name").equals(name).first();
    if (existing) {
      throw new Error("Item already exists");
    }

    const now = Date.now();
    await db.items.add({
      id: uuid(),
      name,
      categoryId,
      createdAt: now,
      updatedAt: now,
    });
  },

  update(id: string, categoryId: string) {
    return db.items.update(id, {
      categoryId,
      updatedAt: Date.now(),
    });
  },

  delete(id: string) {
    return db.items.delete(id);
  },
};
