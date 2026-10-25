import { Store } from "./Store.ts";

// All four files are imported together, once. A failed import leaves no partial data.
export function importLegacy(store: Store, directory: string) {
  const name = "legacy-json-v1";
  return store.transaction(() => {
    if (store.db.prepare("SELECT name FROM migrations WHERE name = ?").get(name)) return false;
    for (const file of ["problems.json", "preview-problems.json"]) {
      const problems = JSON.parse(Deno.readTextFileSync(directory + "/" + file));
      if (!Array.isArray(problems)) throw new Error(file + " must contain an array");
      for (const p of problems) {
        if (!p.id || !p.title || !p.description || !Array.isArray(p.tags)) throw new Error("Invalid problem in " + file);
        p.difficulty = p.difficulty.toLowerCase();
        p.approved = file === "problems.json";
        store.db.prepare("INSERT INTO problems(id,data) VALUES (?,?)").run(p.id, JSON.stringify(p));
      }
    }
    for (const [file, status] of [["solutions.json", "accepted"], ["awaiting-solutions.json", "pending"]]) {
      const groups = JSON.parse(Deno.readTextFileSync(directory + "/" + file));
      if (!groups || Array.isArray(groups) || typeof groups !== "object") throw new Error("Invalid " + file);
      for (const [problemId, solutions] of Object.entries(groups)) {
        if (!Array.isArray(solutions)) throw new Error("Invalid solution group");
        for (const s of solutions) {
          store.db.prepare(`INSERT INTO solutions
            (id,problem_id,github_url,language,author,created_date,status)
            VALUES (?,?,?,?,?,?,?)`).run(crypto.randomUUID(), problemId, s.githubUrl, s.language, s.author, s.createdDate, status);
        }
      }
    }
    store.db.prepare("INSERT INTO migrations(name) VALUES (?)").run(name);
    return true;
  });
}
if (import.meta.main) {
  const store = new Store(Deno.env.get("DATABASE_PATH") ?? "./projlette.sqlite");
  try { console.log(importLegacy(store, Deno.args[0] ?? ".") ? "Imported legacy data" : "Already imported"); }
  finally { store.close(); }
}
