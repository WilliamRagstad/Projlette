// Only the external GitHub response is substituted. Browser tests use the real
// HTTP handler, authorization, migration and on-disk SQLite database.
import { Store } from "../projlette-api/storage/Store.ts";
import { importLegacy } from "../projlette-api/storage/migrate.ts";
import { createApp } from "../projlette-api/app.ts";
const directory = Deno.makeTempDirSync();
let store = new Store(directory + "/test.sqlite");
importLegacy(store, "./projlette-api");
const github: typeof fetch = (input) =>
  Promise.resolve(
    new Response("", {
      status: String(input).includes("/missing/")
        ? 404
        : String(input).includes("/outage/")
        ? 503
        : 200,
    }),
  );
let app = createApp(store, "browser-test-reviewer", github);
const server = Deno.serve({ hostname: "127.0.0.1", port: 8000 }, (request) => {
  if (
    new URL(request.url).pathname === "/__test/restart" &&
    request.method === "POST"
  ) {
    store.close();
    store = new Store(directory + "/test.sqlite");
    app = createApp(store, "browser-test-reviewer", github);
    return Response.json({ restarted: true });
  }
  return app(request);
});
Deno.addSignalListener("SIGTERM", async () => {
  await server.shutdown();
  store.close();
  Deno.removeSync(directory, { recursive: true });
});
