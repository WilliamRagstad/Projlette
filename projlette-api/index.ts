import { Knight } from "@knight/knight";


const app = await Knight.build();
const port = parseInt(Deno.env.get("PORT") || "8000");
console.log("Server ready on http://localhost:" + port);
await app.listen({ port });
