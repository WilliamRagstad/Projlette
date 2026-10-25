# Projlette
Generate a programming challenge, save it for later, submit a public GitHub
repository, and browse solutions accepted by a reviewer.

## Local setup
Use Node 22.12+ (or 24). Deno 2.5.6 is installed locally by npm; no global
Deno, Firebase project, database service, or credentials are needed to browse.

From the repository root:

    npm ci
    npm --prefix projlette-app ci
    npm run migrate
    export REVIEWER_TOKEN="$(openssl rand -hex 32)"
    npm run api

In another terminal, run "npm run dev", then open http://127.0.0.1:5173.
Enter your reviewer token on the Review page to review pending submissions.
Share this secret only with authorized reviewers. The token stays in React
memory and is cleared on refresh. An unset token disables all review access.
The API binds to loopback; production should serve the built frontend and proxy
/api to the API behind HTTPS. Never embed the token in frontend source code.

The UI uses one API, replacing the incomplete Firebase login/signup and data
paths. Public author names are attribution, not verified identities. Reviewer
access uses an operator-issued shared secret, not those public author names.
Rotate the secret by changing REVIEWER_TOKEN and restarting the API.

## Persistence and migration
SQLite is suitable for a single-host deployment: foreign keys, unique repository
submissions per challenge, WAL, a busy timeout, and atomic review transitions.
The database defaults to projlette-api/projlette.sqlite.
Set an absolute DATABASE_PATH for a different location and use the same value
for migration and server startup. Mount that location on persistent storage.

"npm run migrate" imports the four checked-in JSON files in one transaction.
To import an existing deployment's files instead:

    cd projlette-api
    ../node_modules/.bin/deno task migrate /absolute/path/to/legacy-files

Stop the old JSON-writing server first and back up its four files. The importer
does not modify them. It preserves IDs, authors, timestamps, and solution status:
solutions.json is accepted; awaiting-solutions.json is pending. As in the old
service, all entries in problems.json are treated as approved; preview entries
are not. Difficulties are normalized to lowercase.

The migration marker commits with the data. Rerunning is a no-op. Malformed,
orphaned, or duplicate records cause rollback; correct the source copy and retry.
Conflicting data in a nonempty database also fails rather than overwriting it.
Back up SQLite using SQLite's backup command, or stop the server before copying
the database and any WAL files. The JSON files are import fixtures only.

Saved challenges are bookmarks in this browser's local storage, not accounts
or cross-device saves; clearing browser storage removes those bookmarks.
Challenge definitions and all submission/review data live in SQLite and survive
API restarts.

## Workflow
- Spin, save a challenge, and reopen it from Saved challenges.
- Submit an existing public https://github.com/owner/repository URL, language,
  and author name. GitHub existence is verified with a five-second timeout.
- New submissions are pending; they never appear in public accepted results.
- Reviewers can accept or reject once. Repeat decisions and duplicate repository
  submissions return conflicts; rejected submissions cannot be resubmitted.
- GitHub outages/rate limits return a retryable error without creating a record.

## Verification

    npm run test:api
    npm run test:restart
    npm run build
    npx playwright install --with-deps chromium
    npm run test:e2e

Playwright starts isolated servers and a temporary SQLite database. Only external
GitHub verification is substituted in the test entrypoint; production has no
verification bypass or restart endpoint. Tests cover the complete browser flow,
invalid/missing repositories, GitHub outages, duplicates, unauthorized reviews,
rejection, imported accepted solutions, bookmarks after reload, and database
close/reopen. A separate test restarts the production API process and verifies persisted data. API tests verify migration rollback/idempotence and review states.

On a corporate proxy with a trusted system CA, Deno may require
DENO_TLS_CA_STORE=system. Do not disable certificate verification.

## Review sequence
1. feat/persistence-migration → main: SQLite schema and atomic importer.
2. feat/submission-review → feat/persistence-migration: Deno HTTP API,
   validation, repository verification, authorized review, and API tests.
3. feat/frontend-workflow → feat/submission-review: React/Vite integration,
   browser-local bookmarks, Playwright coverage, reproducible setup and CI.

These are stacked branches. Merge in order and retarget later PRs as needed.
