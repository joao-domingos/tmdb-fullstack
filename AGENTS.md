# AGENTS.md

## Stack
- Monorepo, npm workspaces. Two apps:
  - `frontend/` — React 19 + Vite 8 SPA, MaterialUI 9.
  - `backend/` — Node.js + Express, Mongoose (MongoDB), Redis (`ioredis`), JWT auth, bcrypt, pino logger, helmet, compression, express-validator.
- Infrastructure: `docker-compose.yml` runs Mongo + Redis locally.
- React Compiler enabled in `frontend/vite.config.js` via `@vitejs/plugin-react` + `babel-plugin-react-compiler`. Code must be compiler-safe: no mutation of refs/props, no side-effects in render.

## Required env
- `backend/.env` (copy from `backend/.env.example`). Required vars: `MONGO_URI`, `REDIS_URL`, `JWT_SECRET`, `TMDB_API_KEY`. Missing or default `JWT_SECRET` → backend refuses to start.
- `JWT_SECRET` = real random 32-byte value, generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- `TMDB_API_KEY` from https://www.themoviedb.org/settings/api (v3, not v4 bearer).
- `.env` is gitignored. Frontend no longer reads `VITE_TMDB_API_KEY` — TMDB calls moved to backend.

## Commands
- `docker compose up -d` — start Mongo + Redis (infra only; backend not yet containerized until phase 7).
- `npm install` at repo root — installs both workspaces.
- `npm run dev` — runs frontend + backend concurrently (uses `npm-run-all`).
- `npm run dev:frontend` / `npm run dev:backend` — run one.
- `npm run build` — frontend production build → `frontend/dist/`.
- `npm run seed` — seed the app user in Mongo (`backend/scripts/seed.js`).
- `npm run lint` — runs lint in both workspaces.
- No test runner, no typecheck. Don't add.

## Repo layout
```
.
├── AGENTS.md
├── README.md
├── docker-compose.yml
├── package.json                # workspaces root
├── doc_entrega1.pdf
├── doc_entrega2.pdf
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── .env                    # gitignored
│   ├── scripts/seed.js
│   └── src/
│       ├── routes/             # controllers inline in route files
│       ├── models/             # Mongoose schemas
│       └── config/             # env, db, redis, logger
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── eslint.config.js
    ├── index.html
    └── src/
        ├── components/
        └── contexts/           # doc mandates plural
```

## Backend conventions
- `backend/src/` has ONLY `routes/`, `models/`, `config/`. No `controllers/`, no `middleware/`, no `utils/` (put helpers inside the file that uses them).
- Controllers are inline in route files (`routes/auth.js` defines `login` and `logout` next to the route).
- ESM throughout (`"type": "module"` in `backend/package.json`).
- Routes are mounted under `/api/*` in `backend/src/server.js` (or equivalent entry — created in phase 2).
- Auth: JWT with `jti` claim. On logout, push `jti` to Redis blacklist with TTL = token's remaining lifetime. On every request, check blacklist.
- Rate limit on `POST /api/auth/login`: 5 attempts per minute per IP, backed by Redis.
- Logs (pino) for: login success/fail, search queries, inserts. Pino is the "log" criterion.
- Mongoose connection options must include explicit `maxPoolSize` and `minPoolSize` — this is the "pool config" criterion. Defaults are invisible to graders.
- Cache (Redis): TMDB `/search/movie` and `/movie/upcoming` results cached with TTL. `POST /api/movies` invalidates relevant cache keys.
- Validation: `express-validator` on every mutating endpoint. Server-side field validation is graded.
- Sanitization: `express-validator` `.escape()` / `.trim()` on string fields, Mongoose schema types enforced. No raw query string interpolation anywhere.

## Frontend conventions
- `frontend/src/` has only `components/` and `contexts/`. (Doc mandates these two folders only.)
- Components in `.jsx`, default exports (Vite Fast Refresh requires this).
- ESM, MUI `sx` props for styling.
- State: React Context + `useReducer` (see `contexts/MovieContext.jsx`).
- After phase 6, frontend stops calling TMDB directly. All movie data flows from `http://localhost:3000/api/*` (backend) in dev. Frontend never sees `VITE_TMDB_API_KEY` — backend holds the key.

## Architecture
- Entry chain: `index.html` → `frontend/src/main.jsx` → `frontend/src/App.jsx` → `MovieProvider` mounts `SearchBar`, `FilterSection`, `Pagination`, `MovieGrid`.
- After phase 6, an `AuthProvider` wraps `MovieProvider`. Unauthenticated users see `LoginScreen`. On success, token stored in `localStorage` and attached to every fetch as `Authorization: Bearer <token>`.
- `MovieContext` will be split: search/filters/pagination stay in one context, movie data fetch becomes a thin call to `/api/movies`. TMDB image base URL is now returned by backend (frontend doesn't need to know it).

## Watchlist (replaces generic "insert movie")
- The Insertion feature is a **personal watchlist**, not a free-form movie creation form.
- Models: `User` (auth), `Watchlist` (per-user entry with `tmdbId`, `title`, `posterPath`, `year`, `rating`, `note`, `watched`).
- Routes (auth-gated):
  - `GET /api/movies?query=&page=` — TMDB search (cached, write-through to local `movies` collection).
  - `GET /api/movies/upcoming` — TMDB upcoming (cached).
  - `GET /api/movies/:tmdbId` — TMDB detail with local cache fallback.
  - `POST /api/watchlist` — add to my list (`{ tmdbId }` or full payload).
  - `GET /api/watchlist?query=&page=&watched=` — search my list.
  - `PATCH /api/watchlist/:id` — edit note / mark watched.
  - `PATCH /api/watchlist/:id/toggle` — one-click toggle watched.
  - `DELETE /api/watchlist/:id` — remove.
- Unique compound index on `Watchlist(userId, tmdbId)` — no duplicates.
- Cache invalidation: `POST /api/watchlist` only invalidates `search:*` and `upcoming` keys (not the user's own list).

## Gotchas
- `frontend/src/components/MovieCard.jsx` has a hardcoded `mockMovie` default. `MovieGrid` always passes the real movie, so it never renders. Don't delete the fallback blindly.
- TMDB image base is `https://image.tmdb.org/t/p/w500${poster_path}`. Backend returns absolute URLs after phase 4 so frontend doesn't need to build them.
- `frontend/.env` with `VITE_TMDB_API_KEY` is no longer used after backend wiring. Safe to delete.
- Year/rating client validation lives in `FilterSection`. Backend re-validates with `express-validator` — never trust the client.
- Single Mongo user (`admin`/`admin123` by default). Change `SEED_PASSWORD` in `backend/.env` before any non-local use.
- `env.js` calls `required()` on `MONGO_URI`, `REDIS_URL`, `JWT_SECRET`, `TMDB_API_KEY`. Missing → process exits at startup. Don't bypass with default values for these four.
- No CI, no pre-commit hooks, no OpenCode config. Don't assume them.
- Academic project, UTFPR-CP, Prof. Willian Massami Watanabe. Keep tone neutral in code and configs.
- This is **Entrega 2** (not 3). doc2 header says "Projeto 3" but refers to "Projeto 2" in body — treat as Entrega 2 spec.
