import { db } from "@/db/schema";

export async function importBackup(file: File) {
  const text = await file.text();
  const backup = JSON.parse(text);

  if (backup.version !== "1.0") {
    throw new Error("UNSUPPORTED_BACKUP_VERSION");
  }

  await db.transaction("rw", db.meta, db.categories, db.items, async () => {
    // 🔥 destructive by design
    await db.categories.clear();
    await db.items.clear();

    await db.categories.bulkAdd(backup.data.categories);
    await db.items.bulkAdd(backup.data.items);

    await db.meta.put({ key: "initialized", value: true });
  });
}
