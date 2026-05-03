import { Pool } from 'pg';

// Module-level singleton — prevents exhausting the connection pool during Next.js HMR in dev.
const globalForPool = globalThis as typeof globalThis & { _pgPool?: Pool };

function getPool(): Pool {
  if (!globalForPool._pgPool) {
    globalForPool._pgPool = new Pool({
      connectionString: process.env.POSTGRES_URL_NON_POOLING?.replace('?sslmode=require', ''),
      ssl: { rejectUnauthorized: false },
    });
  }
  return globalForPool._pgPool;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
  created_at: string;
}

async function ensureTable() {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS books (
      id         SERIAL PRIMARY KEY,
      title      TEXT    NOT NULL,
      author     TEXT    NOT NULL,
      rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

export async function getAllBooks(): Promise<Book[]> {
  await ensureTable();
  const { rows } = await getPool().query(
    'SELECT id, title, author, rating, created_at::text FROM books ORDER BY rating DESC, created_at DESC'
  );
  return rows as Book[];
}

export async function addBook(title: string, author: string, rating: number): Promise<void> {
  await getPool().query(
    'INSERT INTO books (title, author, rating) VALUES ($1, $2, $3)',
    [title, author, rating]
  );
}

export async function deleteBook(id: number): Promise<void> {
  await getPool().query('DELETE FROM books WHERE id = $1', [id]);
}
