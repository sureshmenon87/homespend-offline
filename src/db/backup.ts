import { db } from "@/db/schema";

export async function exportBackup() {
  const [categories, items] = await Promise.all([
    db.categories.toArray(),
    db.items.toArray(),
  ]);

  const backup = {
    version: "1.0",
    exportedAt: Date.now(),
    data: {
      categories,
      items,
    },
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `homespend-backup-${Date.now()}.json`;
  a.click();

  URL.revokeObjectURL(url);
}
