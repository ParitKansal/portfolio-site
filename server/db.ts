import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '@shared/schema';

const sqlite = new Database('sqlite.db');

// Auto-create any missing tables so deployments don't break when schema evolves
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS section_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section TEXT NOT NULL UNIQUE,
    visible INTEGER NOT NULL DEFAULT 1
  );
`);

// Add missing columns to blog_posts if they don't exist yet
const blogPostMigrations = [
  `ALTER TABLE blog_posts ADD COLUMN visible INTEGER NOT NULL DEFAULT 1;`,
  `ALTER TABLE blog_posts ADD COLUMN series_name TEXT;`,
  `ALTER TABLE blog_posts ADD COLUMN series_order INTEGER;`,
];
for (const sql of blogPostMigrations) {
  try { sqlite.exec(sql); } catch { /* column already exists — ignore */ }
}

export const db = drizzle(sqlite, { schema });
