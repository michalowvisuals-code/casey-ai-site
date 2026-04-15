#!/usr/bin/env node
// Export HIGH-scored papers from knowledge.sqlite to src/data/papers.json.
// Runs locally before `astro build`. Cloudflare Pages receives pre-built dist/
// and never touches SQLite. If the DB is missing (e.g. CI without the repo's
// data dir) this script warns and leaves any existing JSON intact so the build
// still succeeds.

import Database from "better-sqlite3";
import { existsSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DB_PATH = resolve(HERE, "../../data/knowledge.sqlite");
const OUT_PATH = resolve(HERE, "../src/data/papers.json");

const QUERY =
  "SELECT arxiv_id, title, score, topics, reason FROM papers " +
  "WHERE status = 'HIGH' ORDER BY score DESC, arxiv_id DESC";

function main() {
  if (!existsSync(DB_PATH)) {
    console.warn(`[export_papers] knowledge.sqlite not found at ${DB_PATH} — skipping (existing papers.json preserved).`);
    return;
  }
  const db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  const rows = db.prepare(QUERY).all();
  db.close();
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify({ generated_at: new Date().toISOString(), papers: rows }, null, 2));
  console.log(`[export_papers] wrote ${rows.length} papers to ${OUT_PATH}`);
}

main();
