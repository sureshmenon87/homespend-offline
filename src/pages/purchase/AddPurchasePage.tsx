import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useItemsWithCategory, type ItemWithCategory } from "@/hooks/useItems";
import { useShops } from "@/hooks/useShops";
import type { ShopEntity } from "@/db/schema";
import { addPurchase } from "@/db/purchase.store";

export default function AddPurchasePage() {
  const navigate = useNavigate();

  // 🔹 DATA
  const { data: items = [], isLoading: itemsLoading } = useItemsWithCategory();
  const { data: shops = [] } = useShops();

  // 🔹 ITEM STATE
  const [itemQuery, setItemQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ItemWithCategory | null>(
    null,
  );

  // 🔹 SHOP STATE
  const [shopQuery, setShopQuery] = useState("");
  const [selectedShop, setSelectedShop] = useState<ShopEntity | null>(null);

  // 🔹 OTHER FIELDS
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState("");
  const [mrp, setMrp] = useState("");

  // ✅ ITEM FILTER (FIXED)
  const filteredItems = useMemo(() => {
    if (!itemQuery.trim()) return [];
    if (items.length === 0) return [];
    return items.filter((i) =>
      i.name.toLowerCase().includes(itemQuery.toLowerCase()),
    );
  }, [itemQuery, items]);

  // ✅ SHOP FILTER
  const filteredShops = useMemo(() => {
    if (!shopQuery.trim()) return [];
    return shops.filter((s) =>
      s.name.toLowerCase().includes(shopQuery.toLowerCase()),
    );
  }, [shopQuery, shops]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EDE9FE] via-[#F5F3FF] to-white flex justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-6">Add Purchase</h1>

        <div className="bg-white rounded-2xl shadow-xl px-5 py-6 space-y-6">
          {/* ITEM */}
          <div className="form-field relative">
            <label className="form-label">Item</label>

            <input
              className="input"
              placeholder={itemsLoading ? "Loading items..." : "Search item"}
              value={itemQuery}
              onChange={(e) => {
                setItemQuery(e.target.value);
                setSelectedItem(null);
              }}
            />

            {/* DROPDOWN */}
            {itemQuery && !selectedItem && !itemsLoading && (
              <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow max-h-48 overflow-auto">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      setSelectedItem(item);
                      setItemQuery(item.name);
                    }}
                  >
                    {item.name}
                  </button>
                ))}

                {filteredItems.length === 0 && (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    No items found
                  </div>
                )}
              </div>
            )}

            {!selectedItem && (
              <div className="form-error">Please select an item</div>
            )}
          </div>

          {/* CATEGORY (AUTO) */}
          <div className="form-field">
            <label className="form-label">Category</label>
            <input
              className="input input-disabled"
              value={selectedItem?.categoryName ?? ""}
              disabled
            />
          </div>

          {/* SHOP */}
          <div className="form-field relative">
            <label className="form-label">Shop</label>

            <input
              className="input uppercase"
              placeholder="Select shop"
              value={shopQuery}
              onChange={(e) => {
                setShopQuery(e.target.value);
                setSelectedShop(null);
              }}
            />

            {shopQuery && !selectedShop && (
              <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow">
                {filteredShops.map((shop) => (
                  <button
                    key={shop.id}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      setSelectedShop(shop);
                      setShopQuery(shop.name);
                    }}
                  >
                    {shop.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DATE + QTY */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-field">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                min={1}
                className="input"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
          </div>

          {/* PRICES */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-field">
              <label className="form-label">Unit price</label>
              <input
                type="number"
                className="input"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label">MRP</label>
              <input
                type="number"
                className="input"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              className="px-4 py-2 rounded-xl border text-gray-600"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white shadow-md"
              onClick={async () => {
                if (!selectedItem) {
                  toast.error("Please select an item");
                  return;
                }
                if (!selectedShop) {
                  toast.error("Please select a shop");
                  return;
                }

                await addPurchase({
                  itemId: selectedItem.id,
                  itemName: selectedItem.name,
                  categoryId: selectedItem.categoryId,
                  categoryName: selectedItem.categoryName,
                  shopId: selectedShop.id,
                  shopName: selectedShop.name,
                  date,
                  quantity,
                  unitPrice: Number(unitPrice),
                  mrp: Number(mrp),
                });

                toast.success("Purchase added successfully");
                navigate("/purchases");
              }}
            >
              Add Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
