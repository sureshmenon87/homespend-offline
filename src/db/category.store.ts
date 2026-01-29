import { db } from "./schema";
import { v4 as uuid } from "uuid";

export const CategoryStore = {
  getAll() {
    return db.categories.orderBy("name").toArray();
  },

  async create(name: string, description?: string) {
    const trimmed = name.trim();
    if (!trimmed) return;

    const now = Date.now();

    await db.categories.add({
      id: uuid(),
      name: trimmed,
      description,
      createdAt: now,
      updatedAt: now,
    });
  },

  async update(id: string, name: string, description?: string) {
    await db.categories.update(id, {
      name,
      description,
      updatedAt: Date.now(),
    });
  },

  delete(id: string) {
    return db.categories.delete(id);
  },
};
