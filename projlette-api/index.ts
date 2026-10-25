import { Store } from "./storage/Store.ts";
import { createApp } from "./app.ts";
const store = new Store(Deno.env.get("DATABASE_PATH") ?? "./projlette.sqlite");
const server = Deno.serve({ port: Number(Deno.env.get("PORT") ?? 8000), hostname: "127.0.0.1" },
  createApp(store, Deno.env.get("REVIEWER_TOKEN")));
Deno.addSignalListener("SIGTERM", async () => { await server.shutdown(); store.close(); });
