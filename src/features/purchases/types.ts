export type DateRange = "thisMonth" | "lastMonth" | "custom";

export interface PurchaseFilters {
  dateRange: DateRange;
  from?: string;
  to?: string;
  shopId?: string;
  categoryId?: string;
  sortBy?: "name" | "priceHigh" | "priceLow" | "category";
}
export type Purchase = {
  id: number;
  shopId: number;
  itemId: number;
  purchaseDate: string;
  quantity: number;
  unitPrice: string;
  mrp?: string;
  total: string;
  saved: string;
  createdAt: string;

  items?: {
    name: string;
    category?: {
      name: string;
    };
  };

  shops: {
    name: string;
  };
};

export type PurchaseFormData = {
  shopId: number;
  itemId: number;
  purchaseDate: string;
  quantity: number;
  unitPrice: number;
  mrp?: number;
};
