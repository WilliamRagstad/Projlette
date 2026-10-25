import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import "bulma/css/bulma.min.css";
import "./style.css";
interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  author: string;
}
interface Solution {
  id: string;
  problem_id: string;
  github_url: string;
  language: string;
  author: string;
}
async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch("/api" + path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Request failed");
  return data;
}
const message = (e: unknown) =>
  e instanceof Error ? e.message : "Request failed. Please try again.";
function ErrorBox({ error }: { error: string }) {
  return error
    ? <p role="alert" className="notification is-danger">{error}</p>
    : null;
}
function Card({ p }: { p: Problem }) {
  return (
    <article className="box">
      <h2 className="title is-4">
        <Link to={"/problem/" + p.id}>{p.title}</Link>
      </h2>
      <p>{p.description}</p>
      <p className="help">
        {p.difficulty} · {p.tags.join(", ")} · By {p.author}
      </p>
    </article>
  );
}
function savedIds(): string[] {
  try {
    const ids = JSON.parse(localStorage.getItem("savedChallenges") ?? "[]");
    return Array.isArray(ids) ? ids.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
function Generate() {
  const [p, setP] = useState<Problem>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  async function spin() {
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const list = await api<Problem[]>("/problem/random/1");
      if (!list.length) {
        throw new Error(
          "No challenges available. Import the sample data first.",
        );
      }
      setP(list[0]);
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  function save() {
    try {
      localStorage.setItem(
        "savedChallenges",
        JSON.stringify([...new Set([...savedIds(), p!.id])]),
      );
      setSaved(true);
    } catch {
      setError(
        "Your browser could not save the challenge. Allow local storage and try again.",
      );
    }
  }
  return (
    <>
      <h1 className="title">Generate Challenge</h1>
      <p className="subtitle">Spin for your next programming project.</p>
      <button className="button is-primary" onClick={spin} disabled={busy}>
        {busy ? "Spinning…" : "Spin!"}
      </button>
      <ErrorBox error={error} />
      {p && (
        <>
          <Card p={p} />
          <button className="button is-link" onClick={save} disabled={saved}>
            {saved ? "Saved" : "Save challenge"}
          </button>
          {saved && (
            <p role="status">
              Challenge saved in this browser.{" "}
              <Link to={"/problem/" + p.id}>Open challenge</Link>
            </p>
          )}
        </>
      )}
    </>
  );
}
function Browse({ saved = false }: { saved?: boolean }) {
  const [rows, setRows] = useState<Problem[]>();
  const [error, setError] = useState("");
  useEffect(() => {
    api<Problem[]>("/problem/all").then((ps) =>
      setRows(saved ? ps.filter((p) => savedIds().includes(p.id)) : ps)
    ).catch((e) => setError(message(e)));
  }, [saved]);
  return (
    <>
      <h1 className="title">{saved ? "Saved challenges" : "All challenges"}</h1>
      <ErrorBox error={error} />
      {!rows && !error && <p>Loading…</p>}
      {rows?.length === 0 && <p>No challenges yet.</p>}
      {rows?.map((p) => <Card key={p.id} p={p} />)}
    </>
  );
}
function Field({ name, label }: { name: string; label: string }) {
  return (
    <div className="field">
      <label className="label" htmlFor={name}>{label}</label>
      <input className="input" id={name} name={name} required />
    </div>
  );
}
function Detail() {
  const { id } = useParams();
  const [p, setP] = useState<Problem>();
  const [rows, setRows] = useState<Solution[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setP(undefined);
    setSuccess("");
    setError("");
    Promise.all([
      api<Problem>("/problem/" + id),
      api<Solution[]>("/solutions/" + id),
    ]).then(([p, s]) => {
      setP(p);
      setRows(s);
    }).catch((e) => setError(message(e)));
  }, [id]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/solutions/" + id, {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      setSuccess(
        "Submitted for review. Your solution will appear here only after acceptance.",
      );
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <ErrorBox error={error} />
      {p
        ? (
          <>
            <h1 className="title">{p.title}</h1>
            <Card p={p} />
            <h2 className="title is-4">Accepted solutions</h2>
            <section aria-label="Accepted solutions">
              {rows.length === 0
                ? <p>No accepted solutions yet.</p>
                : rows.map((s) => (
                  <article className="box" key={s.id}>
                    <a
                      href={s.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s.github_url}
                    </a>
                    <p>{s.language} · {s.author}</p>
                  </article>
                ))}
            </section>
            <h2 className="title is-4">Submit a GitHub solution</h2>
            {success
              ? (
                <p role="status" className="notification is-success">
                  {success}
                </p>
              )
              : (
                <form onSubmit={submit}>
                  <Field name="githubUrl" label="GitHub repository" />
                  <Field name="language" label="Programming language" />
                  <Field name="author" label="Your name" />
                  <button className="button is-primary" disabled={busy}>
                    {busy ? "Submitting…" : "Submit solution"}
                  </button>
                </form>
              )}
          </>
        )
        : !error && <p>Loading…</p>}
    </>
  );
}
function Review() {
  const [token, setToken] = useState("");
  const [rows, setRows] = useState<Solution[]>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() {
    setRows(
      await api<Solution[]>("/review", {
        headers: { Authorization: "Bearer " + token },
      }),
    );
  }
  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setRows(undefined);
    setBusy(true);
    try {
      await load();
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  async function review(id: string, decision: string) {
    setBusy(true);
    setError("");
    try {
      await api("/review/" + id, {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: JSON.stringify({ decision }),
      });
      await load();
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <h1 className="title">Review submissions</h1>
      <p>Use the reviewer token supplied by the site operator.</p>
      <form onSubmit={login}>
        <label className="label" htmlFor="token">Reviewer token</label>
        <input
          className="input"
          id="token"
          type="password"
          required
          autoComplete="off"
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            setRows(undefined);
          }}
        />
        <button className="button" disabled={busy}>
          Load pending submissions
        </button>
      </form>
      <ErrorBox error={error} />
      {rows?.length === 0 && <p>No pending submissions.</p>}
      {rows?.map((s) => (
        <article className="box" key={s.id}>
          <Link to={"/problem/" + s.problem_id}>Challenge {s.problem_id}</Link>
          <p>
            <a href={s.github_url} target="_blank" rel="noopener noreferrer">
              {s.github_url}
            </a>
          </p>
          <p>{s.author} · {s.language}</p>
          <button
            className="button is-success"
            disabled={busy}
            onClick={() => review(s.id, "accepted")}
          >
            Accept
          </button>{" "}
          <button
            className="button is-danger"
            disabled={busy}
            onClick={() => review(s.id, "rejected")}
          >
            Reject
          </button>
        </article>
      ))}
    </>
  );
}
function SubmitChallenge() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const p = await api<Problem>("/problem", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          tags: String(data.tags).split(",").map((t) => t.trim()),
        }),
      });
      navigate("/problem/" + p.id);
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <h1 className="title">Submit Challenge</h1>
      <ErrorBox error={error} />
      <form onSubmit={submit}>
        <Field name="title" label="Title" />
        <Field name="description" label="Description" />
        <Field name="author" label="Author" />
        <label className="label" htmlFor="difficulty">Difficulty</label>
        <select name="difficulty" id="difficulty">
          {["easy", "medium", "hard", "expert"].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <Field name="tags" label="Tags (comma separated)" />
        <button className="button is-primary" disabled={busy}>
          Submit challenge
        </button>
      </form>
    </>
  );
}
function App() {
  return (
    <>
      <header className="hero is-info">
        <div className="hero-body">
          <Link to="/" className="title">Projlette</Link>
          <p>A roulette game for programming project challenges</p>
        </div>
        <nav aria-label="Main navigation">
          {[
            ["/", "Generate"],
            ["/all", "All challenges"],
            ["/saved", "Saved challenges"],
            ["/submit", "Submit challenge"],
            ["/review", "Review"],
          ].map(([url, label]) => <Link key={url} to={url}>{label}</Link>)}
        </nav>
      </header>
      <main className="container section">
        <Routes>
          <Route path="/" element={<Generate />} />
          <Route path="/all" element={<Browse />} />
          <Route path="/saved" element={<Browse saved />} />
          <Route path="/problem/:id" element={<Detail />} />
          <Route path="/review" element={<Review />} />
          <Route path="/submit" element={<SubmitChallenge />} />
          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </main>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
