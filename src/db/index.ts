import { db } from "./schema";
import { seedMasterData } from "./seed/seed";

export async function initDB() {
  const initialized = await db.meta.get("initialized");

  if (!initialized) {
    await seedMasterData();
    await db.meta.put({ key: "initialized", value: true });
    await db.meta.put({ key: "seedVersion", value: "1.0" });
  }
}

export async function resetAllData() {
  await db.transaction("rw", db.categories, db.items, db.meta, async () => {
    await db.categories.clear();
    await db.items.clear();
    // meta.initialized remains TRUE
  });
}
