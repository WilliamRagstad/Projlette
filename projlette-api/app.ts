import { timingSafeEqual } from "node:crypto";
import { Store } from "./storage/Store.ts";
import { HttpError, required, SolutionService } from "./service/SolutionService.ts";

export function createApp(store: Store, reviewerToken?: string, fetcher: typeof fetch = fetch) {
  const solutions = new SolutionService(store, fetcher);
  return async (request: Request): Promise<Response> => {
    const json = (data: unknown, status = 200) => Response.json(data, { status });
    try {
      const path = new URL(request.url).pathname.replace(/^\/api/, "");
      const method = request.method;
      const parts = path.split("/").filter(Boolean);
      const body = async () => {
        let value;
        try { value = await request.json(); } catch { throw new HttpError(400, "Send a valid JSON object"); }
        if (!value || typeof value !== "object" || Array.isArray(value)) throw new HttpError(400, "Send a valid JSON object");
        return value;
      };
      if (parts[0] === "review") {
        const token = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
        const a = new TextEncoder().encode(token), b = new TextEncoder().encode(reviewerToken ?? "");
        if (!reviewerToken || a.length !== b.length || !timingSafeEqual(a,b)) throw new HttpError(401, "A valid reviewer token is required");
        if (method === "GET" && parts.length === 1) return json(solutions.list());
        if (method === "POST" && parts.length === 2) return json(solutions.review(parts[1], (await body()).decision));
      }
      if (method === "GET" && path === "/health") return json({status:"ok"});
      if (parts[0] === "problem") {
        if (method === "GET") {
          if (parts[1] === "all") return json(store.problems().filter(p => parts[2] !== "false" || p.approved));
          if (parts[1] === "random") {
            const count = Number(parts[2]);
            if (!Number.isInteger(count) || count < 1 || count > 100) throw new HttpError(400, "Count must be an integer from 1 to 100");
            const available = store.problems().filter(p => p.approved);
            return json(available.sort(() => Math.random() - 0.5).slice(0,count));
          }
          const problem = store.problem(parts[1]);
          if (!problem) throw new HttpError(404, "Challenge not found");
          return json(problem);
        }
        if (method === "POST" && parts.length === 1) {
          const input = await body();
          const difficulty = required(input.difficulty, "Difficulty").toLowerCase();
          if (!["easy","medium","hard","expert"].includes(difficulty)) throw new HttpError(400,"Choose easy, medium, hard or expert");
          if (!Array.isArray(input.tags) || !input.tags.length || input.tags.length > 20) throw new HttpError(400,"Provide 1–20 tags");
          const problem = {id:crypto.randomUUID(),title:required(input.title,"Title",4),description:required(input.description,"Description",10,5000),
            difficulty,tags:[...new Set(input.tags.map((t: unknown) => required(t,"Tag",1,50)))],
            author:required(input.author,"Author",4,100),approved:false,createdDate:new Date().toISOString()};
          store.db.prepare("INSERT INTO problems(id,data) VALUES (?,?)").run(problem.id,JSON.stringify(problem));
          return json(problem,201);
        }
      }
      if (parts[0] === "solutions" && parts.length === 2) {
        if (!store.problem(parts[1])) throw new HttpError(404,"Challenge not found");
        if (method === "GET") return json(solutions.list(parts[1]));
        if (method === "POST") return json(await solutions.submit(parts[1],await body()),201);
      }
      throw new HttpError(404,"Endpoint not found");
    } catch (error) {
      if (error instanceof HttpError) return json({error:error.message},error.status);
      console.error(error);
      return json({error:"An unexpected error occurred"},500);
    }
  };
}
