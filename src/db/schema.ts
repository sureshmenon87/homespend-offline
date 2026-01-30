import Dexie, { type Table } from "dexie";

export interface MetaState {
  key: string;
  value: any;
}

export interface CategoryEntity {
  id: string;
  name: string;
  description?: string;
  icon?: string;
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
export interface PurchaseEntity {
  id: string;

  // Item
  itemId: string;
  itemName: string;

  // Category (denormalized snapshot)
  categoryId: string;
  categoryName: string;

  shopId: string;
  shopName: string; // snapshot for safety

  // Purchase data
  date: string; // yyyy-mm-dd
  quantity: number;
  unitPrice: number;
  mrp: number;

  createdAt: number;
}

export interface ShopEntity {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export class HomeSpendDB extends Dexie {
  meta!: Table<MetaState, string>;
  categories!: Table<CategoryEntity, string>;
  items!: Table<ItemEntity, string>;
  shops!: Table<ShopEntity, string>;
  purchases!: Table<PurchaseEntity, string>;

  constructor() {
    super("homespend-db");

    this.version(3).stores({
      categories: "id",
      items: "id, categoryId, name",
      shops: "id, name",
      purchases: "id, date, itemId, categoryId, shopId",
      meta: "key",
    });
  }
}

export const db = new HomeSpendDB();
