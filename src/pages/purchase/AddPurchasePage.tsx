import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useItemsWithCategory, type ItemWithCategory } from "@/hooks/useItems";
import { useShops } from "@/hooks/useShops";
import type { ShopEntity } from "@/db/schema";
import {
  addPurchase,
  getPurchaseById,
  updatePurchase,
} from "@/db/purchase.store";

export default function AddPurchasePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // 🔹 DATA
  const { data: items = [], isLoading: itemsLoading } = useItemsWithCategory();
  const { data: shops = [] } = useShops();

  // 🔹 ITEM
  const [itemQuery, setItemQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ItemWithCategory | null>(
    null,
  );

  // 🔹 SHOP
  const [shopQuery, setShopQuery] = useState("");
  const [selectedShop, setSelectedShop] = useState<ShopEntity | null>(null);

  // 🔹 OTHER FIELDS
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState("");
  const [mrp, setMrp] = useState("");

  // 🔍 ITEM FILTER
  const filteredItems = useMemo(() => {
    if (!itemQuery.trim()) return [];
    return items.filter((i) =>
      i.name.toLowerCase().includes(itemQuery.toLowerCase()),
    );
  }, [itemQuery, items]);

  // 🔍 SHOP FILTER
  const filteredShops = useMemo(() => {
    if (!shopQuery.trim()) return [];
    return shops.filter((s) =>
      s.name.toLowerCase().includes(shopQuery.toLowerCase()),
    );
  }, [shopQuery, shops]);

  // ✏️ EDIT MODE LOAD
  useEffect(() => {
    if (!id) return;

    (async () => {
      const p = await getPurchaseById(id);
      if (!p) return;

      const item = items.find((i) => i.id === p.itemId) ?? null;
      const shop = shops.find((s) => s.id === p.shopId) ?? null;

      setSelectedItem(item);
      setSelectedShop(shop);

      setItemQuery(p.itemName);
      setShopQuery(p.shopName);
      setDate(p.date);
      setQuantity(p.quantity);
      setUnitPrice(String(p.unitPrice));
      setMrp(String(p.mrp));
    })();
  }, [id, items, shops]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EDE9FE] via-[#F5F3FF] to-white flex justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-6">
          {isEdit ? "Edit Purchase" : "Add Purchase"}
        </h1>

        <div className="bg-white rounded-2xl shadow-xl px-5 py-6 space-y-6">
          {/* ITEM */}
          <div className="relative">
            <label className="form-label">Item</label>
            <input
              className="input"
              placeholder={itemsLoading ? "Loading..." : "Search item"}
              value={itemQuery}
              onChange={(e) => {
                setItemQuery(e.target.value);
                setSelectedItem(null);
              }}
            />

            {itemQuery && !selectedItem && (
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

          {/* CATEGORY */}
          <div>
            <label className="form-label">Category</label>
            <input
              className="input input-disabled"
              value={selectedItem?.categoryName ?? ""}
              disabled
            />
          </div>

          {/* SHOP */}
          <div className="relative">
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
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
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
            <div>
              <label className="form-label">Unit price</label>
              <input
                type="number"
                className="input"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
              />
            </div>
            <div>
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
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-xl border"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white"
              onClick={async () => {
                if (!selectedItem || !selectedShop) {
                  toast.error("Item and shop required");
                  return;
                }

                const payload = {
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
                };

                if (isEdit && id) {
                  await updatePurchase(id, payload);
                  toast.success("Purchase updated");
                } else {
                  await addPurchase(payload);
                  toast.success("Purchase added");
                }

                navigate("/purchases");
              }}
            >
              {isEdit ? "Update Purchase" : "Add Purchase"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
