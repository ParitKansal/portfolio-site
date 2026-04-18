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

export const db = drizzle(sqlite, { schema });
