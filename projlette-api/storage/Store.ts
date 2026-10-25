import { DatabaseSync } from "node:sqlite";

export class Store {
  db: DatabaseSync;
  constructor(path: string) {
    this.db = new DatabaseSync(path);
    this.db.exec(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = WAL;
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY);
      CREATE TABLE IF NOT EXISTS problems (
        id TEXT PRIMARY KEY, data TEXT NOT NULL CHECK(json_valid(data))
      );
      CREATE TABLE IF NOT EXISTS solutions (
        id TEXT PRIMARY KEY,
        problem_id TEXT NOT NULL REFERENCES problems(id),
        github_url TEXT NOT NULL COLLATE NOCASE,
        language TEXT NOT NULL, author TEXT NOT NULL, created_date TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('pending','accepted','rejected')),
        reviewed_by TEXT, reviewed_at TEXT,
        UNIQUE(problem_id, github_url)
      );
      CREATE INDEX IF NOT EXISTS solutions_status ON solutions(status, problem_id);
    `);
  }
  transaction<T>(action: () => T): T {
    this.db.exec("BEGIN IMMEDIATE");
    try { const result = action(); this.db.exec("COMMIT"); return result; }
    catch (error) { this.db.exec("ROLLBACK"); throw error; }
  }
  problems() {
    return this.db.prepare("SELECT data FROM problems ORDER BY id").all().map(row => JSON.parse(row.data as string));
  }
  problem(id: string) {
    const row = this.db.prepare("SELECT data FROM problems WHERE id = ?").get(id);
    return row ? JSON.parse(row.data as string) : undefined;
  }
  close() { this.db.close(); }
}
