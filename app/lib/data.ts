import Database from "better-sqlite3";
import seedData from "./seed-data";
import { Item } from "./definitions";

const db = new Database("data.sqlite", { verbose: console.log });
db.pragma("journal_mode = WAL");

export async function checkData() {
  await seedData(db);
}

export async function fetchData(): Promise<Item[]> {
  const rows = db.prepare("SELECT * FROM items").all() as Item[];
  return rows;
}
