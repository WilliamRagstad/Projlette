import { Store } from "../storage/Store.ts";
export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function required(value: unknown, name: string, min = 1, max = 200): string {
  if (typeof value !== "string" || value.trim().length < min || value.trim().length > max)
    throw new HttpError(400, name + " must contain " + min + "–" + max + " characters");
  return value.trim();
}
export class SolutionService {
  constructor(private store: Store, private fetcher: typeof fetch = fetch) {}
  list(problemId?: string) {
    return problemId
      ? this.store.db.prepare("SELECT * FROM solutions WHERE problem_id=? AND status='accepted' ORDER BY created_date,id").all(problemId)
      : this.store.db.prepare("SELECT * FROM solutions WHERE status='pending' ORDER BY created_date,id").all();
  }
  async submit(problemId: string, body: Record<string, unknown>) {
    if (!this.store.problem(problemId)) throw new HttpError(404, "Challenge not found");
    const author = required(body.author, "Author", 4, 100);
    const language = required(body.language, "Language", 1, 80);
    const url = required(body.githubUrl, "GitHub URL");
    const match = /^https:\/\/github\.com\/([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9_.-]{1,100})\/?$/.exec(url);
    if (!match || [".", ".."].includes(match[2])) throw new HttpError(400, "Use a GitHub repository URL: https://github.com/owner/repository");
    const githubUrl = "https://github.com/" + match[1] + "/" + match[2].replace(/\.git$/, "");
    if (this.store.db.prepare("SELECT id FROM solutions WHERE problem_id=? AND github_url=?").get(problemId, githubUrl))
      throw new HttpError(409, "This repository has already been submitted for this challenge");
    let response: Response;
    try {
      response = await this.fetcher("https://api.github.com/repos/" + match[1] + "/" + match[2].replace(/\.git$/, ""), {
        headers: { Accept: "application/vnd.github+json", "User-Agent": "Projlette" },
        redirect: "error", signal: AbortSignal.timeout(5000)
      });
    } catch { throw new HttpError(503, "GitHub could not be reached. Please try again."); }
    await response.body?.cancel();
    if (response.status === 404) throw new HttpError(400, "Repository not found. Use an existing public GitHub repository.");
    if (!response.ok) throw new HttpError(503, "GitHub verification is unavailable. Please try again.");
    const id = crypto.randomUUID();
    try {
      this.store.db.prepare(`INSERT INTO solutions(id,problem_id,github_url,language,author,created_date,status)
        VALUES (?,?,?,?,?,?,'pending')`).run(id, problemId, githubUrl, language, author, new Date().toISOString());
    } catch (error) {
      if (String(error).includes("UNIQUE")) throw new HttpError(409, "This repository has already been submitted for this challenge");
      throw error;
    }
    return { id, status: "pending" };
  }
  review(id: string, decision: unknown) {
    if (decision !== "accepted" && decision !== "rejected") throw new HttpError(400, "Decision must be accepted or rejected");
    return this.store.transaction(() => {
      const row = this.store.db.prepare("SELECT status FROM solutions WHERE id=?").get(id);
      if (!row) throw new HttpError(404, "Submission not found");
      if (row.status !== "pending") throw new HttpError(409, "Submission has already been reviewed");
      this.store.db.prepare("UPDATE solutions SET status=?,reviewed_by='reviewer',reviewed_at=? WHERE id=? AND status='pending'")
        .run(decision, new Date().toISOString(), id);
      return { id, status: decision };
    });
  }
}
