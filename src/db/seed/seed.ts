import { db } from "../schema";
import { seedCategories } from "./categories.seed";
import { seedItems } from "./items.seed";

export async function seedMasterData() {
  const initialized = await db.meta.get("initialized");
  if (initialized) {
    return;
  }

  const now = Date.now();

  await db.transaction("rw", db.categories, db.items, db.meta, async () => {
    await db.categories.bulkAdd(
      seedCategories.map((c) => ({
        ...c,
        createdAt: now,
        updatedAt: now,
      })),
    );

    await db.items.bulkAdd(
      seedItems.map((i) => ({
        ...i,
        createdAt: now,
        updatedAt: now,
      })),
    );
    await db.meta.put({ key: "initialized", value: true });
  });
}
