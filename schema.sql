-- Run this once in your Vercel Postgres dashboard (Storage → Query)
-- or via psql before first deploy.

CREATE TABLE IF NOT EXISTS books (
  id         SERIAL PRIMARY KEY,
  title      TEXT    NOT NULL,
  author     TEXT    NOT NULL,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
