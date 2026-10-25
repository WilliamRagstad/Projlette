# API

See [the root README](../README.md) for installation, migration, authentication,
database backups and tests.

Public endpoints (also available with the /api prefix):

- GET /health
- GET /problem/random/:count (1–100, approved challenges)
- GET /problem/all or /problem/all/false (exclude previews)
- GET /problem/:id
- POST /problem with title, description, difficulty, tags, author
- GET /solutions/:problemId (accepted only)
- POST /solutions/:problemId with githubUrl, language, author

Reviewer endpoints require Authorization: Bearer <REVIEWER_TOKEN>:

- GET /review (pending submissions)
- POST /review/:submissionId with {"decision":"accepted"} or "rejected"

Errors are JSON {"error":"useful message"}. Invalid input returns 400,
unauthorized review 401, missing records 404, duplicates/repeated decisions 409,
and unavailable GitHub verification 503. Created records return 201.
Client-supplied IDs, statuses, approval and review metadata cannot authorize
acceptance; the server sets them. Reviews record their timestamp and the shared
reviewer role. For individual reviewer audit attribution, replace the shared
token with an identity provider before expanding reviewer access.
