# Frontend
See [the root README](../README.md). React 18, TypeScript 5 and Vite replace
Create React App. Run npm ci, then npm start for development; npm run build
type-checks and builds dist. All styles are bundled locally.

The Vite development server proxies /api to loopback port 8000. Production
hosting must configure the same proxy and serve index.html for client routes.
Firebase configuration is no longer required.
