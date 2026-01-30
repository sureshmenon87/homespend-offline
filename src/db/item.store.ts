import { db } from "./schema";
import { v4 as uuid } from "uuid";
import type { ItemEntity } from "./schema";

export const ItemStore = {
  async getAll() {
    return db.items.toArray();
  },

  async create(name: string, categoryId: string) {
    const trimmed = name.trim();
    if (!trimmed) return;

    const now = Date.now();

    await db.items.add({
      id: uuid(),
      name: trimmed,
      categoryId,
      createdAt: now,
      updatedAt: now,
    });
  },

  async update(id: string, name: string, categoryId: string) {
    await db.items.update(id, {
      name: name.trim(),
      categoryId,
      updatedAt: Date.now(),
    });
  },

  delete(id: string) {
    return db.items.delete(id);
  },
};
