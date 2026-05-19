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

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS series_metadata (
    name TEXT PRIMARY KEY,
    display_order INTEGER NOT NULL DEFAULT 0
  );
`);

// Add missing columns to blog_posts if they don't exist yet
const blogPostMigrations = [
  `ALTER TABLE blog_posts ADD COLUMN visible INTEGER NOT NULL DEFAULT 1;`,
  `ALTER TABLE blog_posts ADD COLUMN series_name TEXT;`,
  `ALTER TABLE blog_posts ADD COLUMN series_order INTEGER;`,
  `ALTER TABLE blog_posts ADD COLUMN show_in_blog INTEGER NOT NULL DEFAULT 1;`,
];
for (const sql of blogPostMigrations) {
  try { sqlite.exec(sql); } catch { /* column already exists — ignore */ }
}

// Performance indexes — CREATE IF NOT EXISTS is idempotent
sqlite.exec(`
  CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_visible ON blog_posts(visible);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_series ON blog_posts(series_name);
  CREATE INDEX IF NOT EXISTS idx_knowledge_entries_date ON knowledge_entries(date DESC);
  CREATE INDEX IF NOT EXISTS idx_knowledge_entries_title ON knowledge_entries(title);
  CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  CREATE INDEX IF NOT EXISTS idx_section_settings_section ON section_settings(section);
`);

export const db = drizzle(sqlite, { schema });
