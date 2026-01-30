import { db } from "@/db/schema";
import { initDB } from "../db";

export async function resetApp() {
  await db.delete();
  await initDB();
}
