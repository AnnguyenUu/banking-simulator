# Banking Dashboard

A digital banking dashboard — account balances, transactions, transfers, and
spending insights — built with React 19 + Vite. See [docs/adr/](docs/adr/) for the reasoning behind the critical design
decisions (architecture, state management, API integration, security).

## Prerequisites

- Node.js 20+ (tested on 20.20.2)
- npm (ships with Node)

## Getting the code

```bash
git clone https://github.com/AnnguyenUu/banking-simulator.git
cd banking-simulator
npm install
```

## Environment setup

Copy the example env file:

```bash
cp .env.example .env.local
```

`VITE_API_BASE_URL` controls which backend the app talks to:

- **Left unset (default)** — the app runs entirely against a built-in
  in-browser mock backend, no real backend required. The mock's `/me`
  endpoint always succeeds, so you land straight on the Overview page
  already signed in as `Jordan Lee` — no login step needed. If you
  navigate to `/login` anyway, the mock accepts:
  - Email: `jordan.lee@example.com`
  - Password: `password123`
- **Set to a real backend's URL** (e.g. `http://localhost:3000`) — the app
  talks to that backend instead, and the real login flow applies. See
  [API.md](API.md) for the endpoints it needs to implement.

## Running locally

```bash
npm run dev
```

Opens the app at `http://localhost:5173` with hot reload.

## Testing

```bash
npm run test          # run once (unit tests + Storybook story smoke tests)
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

## Storybook

Component library and docs for the shared UI primitives in
[src/components/atomic](src/components/atomic):

```bash
npm run storybook       # dev server at http://localhost:6006
npm run build-storybook # static build
```

## Linting

```bash
npm run lint
```

## Building for production

```bash
npm run build    # typecheck + production build, output in dist/
npm run preview  # serve the production build locally
```

## Project structure

| Path | Purpose |
|---|---|
| `src/api/` | Axios client, request functions, and the in-browser mock backend |
| `src/queries/`, `src/mutations/` | React Query hooks for server state (reads/writes) |
| `src/pages/` | One folder per route (`OverviewPage`, `TransactionsPage`, `TransferPage`, `InsightsPage`, `LoginPage`) |
| `src/components/atomic/` | Thin wrappers around Ant Design primitives, documented in Storybook |
| `src/routes/` | Router + route protection |

## Architecture Decision Records

The *why* behind this project's critical design choices — not just what the
code does, but the alternatives considered and the trade-offs accepted — is
recorded in [docs/adr/](docs/adr/):

| ADR | Covers |
|---|---|
| [1](docs/adr/frontend-architecture.md) | Frontend architecture (Vite SPA, Ant Design + Tailwind, atomic component layering) |
| [2](docs/adr/state-management.md) | State management (React Query for server state) |
| [3](docs/adr/security-considerations.md) | Security considerations & assumptions (CSP, auth, route-guard limits) |
