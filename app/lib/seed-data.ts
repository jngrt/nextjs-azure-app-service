//import Database from 'better-sqlite3';
import type { Database } from "better-sqlite3";

const dummyData = ["First item", "Second item", "Third item"];

const seedScriptVersion = 1;

function isDataUpToDate(db: Database): boolean {
  const versionData = db.pragma("user_version") as [{ user_version: number }];
  const version = versionData[0].user_version;
  console.log("version:", version, "seedScriptVersion:", seedScriptVersion);
  return version === seedScriptVersion;
}

export default async function seedData(db: Database) {
  if (isDataUpToDate(db)) {
    return;
  }
  console.log("Data not up to date, seeding...");
  await db.exec(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL
      );
    `);

  const stmt = db.prepare(`
    INSERT INTO items (title)
    VALUES (?)
    `);

  const inserted = await Promise.all(dummyData.map((title) => stmt.run(title)));

  db.pragma(`user_version = ${seedScriptVersion}`);

  console.log("Inserted:", inserted.length);
}
