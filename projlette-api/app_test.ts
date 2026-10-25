import { strict as assert } from "node:assert";
import { Store } from "./storage/Store.ts";
import { importLegacy } from "./storage/migrate.ts";
import { createApp } from "./app.ts";
Deno.test("submission validation, authorization, visibility and review transitions", async () => {
  const store = new Store(":memory:"); importLegacy(store, ".");
  const app = createApp(store, "secret", (() => Promise.resolve(new Response("{}"))) as typeof fetch);
  const call = (path: string, method = "GET", body?: unknown, token = "") =>
    app(new Request("http://localhost" + path, {method,headers:{"Authorization":"Bearer " + token,"Content-Type":"application/json"},body:body === undefined ? undefined : JSON.stringify(body)}));
  const valid = {githubUrl:"https://github.com/example/solution",author:"Tester",language:"TypeScript"};
  try {
    assert.equal((await call("/solutions/missing","POST",valid)).status,404);
    for (const bad of [{...valid,githubUrl:"https://github.com.evil.test/a/b"},{...valid,language:3},{...valid,author:""},null]) {
      const response = await call("/solutions/A12X","POST",bad);
      assert.equal(response.status,400); assert.ok((await response.json()).error);
    }
    assert.equal((await call("/review")).status,401);
    assert.equal((await call("/review","GET",undefined,"wrong")).status,401);
    const submitted = await call("/solutions/A12X","POST",valid);
    assert.equal(submitted.status,201);
    const {id} = await submitted.json();
    assert.equal((await (await call("/solutions/A12X")).json()).length,0);
    assert.equal((await call("/review/"+id,"POST",{decision:"accepted"})).status,401);
    assert.equal((await call("/review/"+id,"POST",{decision:"accepted"},"secret")).status,200);
    assert.equal((await (await call("/solutions/A12X")).json()).length,1);
    assert.equal((await call("/review/"+id,"POST",{decision:"rejected"},"secret")).status,409);
    assert.equal((await call("/solutions/A12X","POST",valid)).status,409);
    const pending = await (await call("/review","GET",undefined,"secret")).json();
    assert.equal((await call("/review/"+pending[0].id,"POST",{decision:"rejected"},"secret")).status,200);
    assert.equal((await (await call("/review","GET",undefined,"secret")).json()).length,0);
    const closed = createApp(store);
    assert.equal((await closed(new Request("http://localhost/review"))).status,401);
  } finally { store.close(); }
});
Deno.test("GitHub not found, outages and malformed JSON produce useful errors", async () => {
  const store = new Store(":memory:"); importLegacy(store,".");
  try {
    for (const status of [404,429,500]) {
      const app = createApp(store, undefined, (() => Promise.resolve(new Response("",{status}))) as typeof fetch);
      const response = await app(new Request("http://localhost/solutions/A12X",{method:"POST",body:JSON.stringify({githubUrl:"https://github.com/a/b",author:"Test",language:"Go"})}));
      assert.equal(response.status,status === 404 ? 400 : 503);
      assert.ok((await response.json()).error);
    }
    const app = createApp(store);
    assert.equal((await app(new Request("http://localhost/solutions/A12X",{method:"POST",body:"{"}))).status,400);
  } finally { store.close(); }
});
