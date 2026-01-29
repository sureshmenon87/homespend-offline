import Dexie, { type Table } from "dexie";

export interface MetaState {
  key: string;
  value: any;
}

export interface CategoryEntity {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ItemEntity {
  id: string;
  name: string; // UNIQUE
  categoryId: string;
  createdAt: number;
  updatedAt: number;
}

export class HomeSpendDB extends Dexie {
  meta!: Table<MetaState, string>;
  categories!: Table<CategoryEntity, string>;
  items!: Table<ItemEntity, string>;

  constructor() {
    super("homespend-db");

    this.version(1).stores({
      meta: "key",
      categories: "id, name",
      items: "id, &name, categoryId",
    });
  }
}

export const db = new HomeSpendDB();
