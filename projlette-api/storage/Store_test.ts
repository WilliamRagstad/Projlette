import { strict as assert } from "node:assert";
import { Store } from "./Store.ts";
import { importLegacy } from "./migrate.ts";
Deno.test("sample import is atomic, idempotent and durable across reopen", () => {
  const dir = Deno.makeTempDirSync();
  const path = dir + "/test.sqlite";
  let store = new Store(path);
  try {
    assert.equal(importLegacy(store, "."), true);
    assert.equal(store.problems().length, 20);
    assert.equal(importLegacy(store, "."), false);
    store.close(); store = new Store(path);
    assert.equal(store.problem("P42K").title, "Tic Tac Toe");
    assert.equal(store.db.prepare("SELECT count(*) AS n FROM solutions WHERE status='pending'").get()?.n, 1);
    assert.throws(() => store.transaction(() => {
      store.db.prepare("DELETE FROM solutions").run();
      throw new Error("rollback");
    }));
    assert.equal(store.db.prepare("SELECT count(*) AS n FROM solutions").get()?.n, 2);
  } finally { store.close(); Deno.removeSync(dir, { recursive: true }); }
});
Deno.test("bad legacy import rolls back everything", () => {
  const dir = Deno.makeTempDirSync(); const store = new Store(":memory:");
  try {
    for (const file of ["problems.json","preview-problems.json","solutions.json","awaiting-solutions.json"])
      Deno.copyFileSync(file, dir + "/" + file);
    Deno.writeTextFileSync(dir + "/awaiting-solutions.json", '{"missing":[{"githubUrl":"x"}]}');
    assert.throws(() => importLegacy(store, dir));
    assert.equal(store.problems().length, 0);
  } finally { store.close(); Deno.removeSync(dir, {recursive:true}); }
});
