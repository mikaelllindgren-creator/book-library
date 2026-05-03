import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// On Vercel, only /tmp is writable — but it's ephemeral (data lost between cold starts).
// For persistent storage deploy to Railway, Render, Fly.io, or any always-on host.
// Override at any time by setting the DATABASE_PATH environment variable.
function getDbPath(): string {
  if (process.env.DATABASE_PATH) return process.env.DATABASE_PATH;
  if (process.env.NODE_ENV === 'production') return '/tmp/books.db';
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  return path.join(dataDir, 'books.db');
}

export interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
  created_at: string;
}

// Module-level singleton — avoids re-opening the DB on every HMR reload in dev.
const globalForDb = globalThis as typeof globalThis & { _db?: Database.Database };

function getDb(): Database.Database {
  if (!globalForDb._db) {
    globalForDb._db = new Database(getDbPath());
    globalForDb._db.pragma('journal_mode = WAL');
    globalForDb._db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        title      TEXT    NOT NULL,
        author     TEXT    NOT NULL,
        rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  return globalForDb._db;
}

export function getAllBooks(): Book[] {
  return getDb()
    .prepare('SELECT * FROM books ORDER BY rating DESC, created_at DESC')
    .all() as Book[];
}

export function addBook(title: string, author: string, rating: number): Book {
  const stmt = getDb().prepare(
    'INSERT INTO books (title, author, rating) VALUES (?, ?, ?)'
  );
  const result = stmt.run(title.trim(), author.trim(), rating);
  return getDb()
    .prepare('SELECT * FROM books WHERE id = ?')
    .get(result.lastInsertRowid) as Book;
}

export function deleteBook(id: number): void {
  getDb().prepare('DELETE FROM books WHERE id = ?').run(id);
}
