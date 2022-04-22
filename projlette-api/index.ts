import { Knight } from "https://deno.land/x/knight@2.3.0/mod.ts";

const app = await Knight.build();
const port = parseInt(Deno.env.get("PORT") || "8000");
console.log("Server ready on http://localhost:" + port);
await app.listen({ port });
