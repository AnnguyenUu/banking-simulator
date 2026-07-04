# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A simple digital banking dashboard (accounts, balances, transactions) built with React 19 + Vite. There is no real backend yet — all data comes from an in-browser mock (see Architecture below).

## Commands

```bash
npm run dev            # start Vite dev server
npm run build           # tsc -b (typecheck) + vite build
npm run preview         # preview the production build
npm run lint            # eslint .
npm run test            # vitest run (single pass, CI mode)
npm run test:watch      # vitest (watch mode)
npm run test:coverage   # vitest run --coverage
```

Run a single test file: `npx vitest run src/pages/OverviewPage/index.test.tsx`
Run tests matching a name: `npx vitest run -t "renders account balances"`

## Architecture

**Stack**: React 19, Vite, TypeScript, Ant Design v6 (components) + Tailwind CSS v4 (layout/spacing/utility styling), Recharts (charts), TanStack React Query (server state), React Router v7, Axios.

**State split** — this is the main thing to get right when adding features:
- Server data (accounts, transactions, current user) always goes through **React Query** hooks — reads in [src/queries/](src/queries/), writes in [src/mutations/](src/mutations/) — backed by request functions in [src/api/banking.ts](src/api/banking.ts). Never fetch data with `useEffect` + `useState`.
- Pure UI/client state (e.g. which account is selected as a filter) lives in a **`sessionStorage`-backed hook** at [src/store/useSelectedAccount.ts](src/store/useSelectedAccount.ts) (built on the generic [useSessionStorage](src/hooks/useSessionStorage.ts) hook), not a global store — it's plain React state written through to `sessionStorage` so it survives a page refresh within the same tab. Don't put server data here or client-only UI state in React Query.

**API layer** ([src/api/](src/api/)):
- [client.ts](src/api/client.ts) — the shared Axios instance. Has request/response interceptors for the bearer token (`localStorage.auth_token`) and 401 handling. All requests should go through this instance, not a bare `axios.get`.
- [mockBackend.ts](src/api/mockBackend.ts) — uses `axios-mock-adapter` to intercept requests on the shared Axios instance and return fixture data (accounts, transactions, user), with a simulated network delay. This is installed in [main.tsx](src/main.tsx) **only when `VITE_API_BASE_URL` is not set**. Once a real backend exists, set `VITE_API_BASE_URL` (e.g. in `.env.local`) and the mock stops installing itself automatically — no code changes needed elsewhere.
- [banking.ts](src/api/banking.ts) — plain async functions wrapping `apiClient` calls; these are the `queryFn`s/`mutationFn`s used by the hooks in [src/queries/](src/queries/) and [src/mutations/](src/mutations/).

`queries/` and `mutations/` are top-level siblings of `api/`/`pages/` (not nested inside `api/`), each aliased directly (`@queries`, `@mutations`):
- [queries/](src/queries/) — one `useQuery` hook per file (`useCurrentUser.ts`, `useAccounts.ts`, `useTransactions.ts`), re-exported from [queries/index.ts](src/queries/index.ts) so `import { useAccounts } from '@queries'` keeps working. Add new reads the same way: one file, one hook, exported from the barrel.
- [mutations/](src/mutations/) — same pattern for `useMutation` hooks (currently just `useTransferFunds.ts`), re-exported from [mutations/index.ts](src/mutations/index.ts) as `@mutations`. Keep queries and mutations in their separate folders — don't put a `useMutation` hook in `queries/` or vice versa.

The mock is stateful within a session: `POST /transfers` mutates the in-memory `accounts`/`transactions` arrays in [mockBackend.ts](src/api/mockBackend.ts) (balances update, two new `"Transfer"`-category transactions are appended), so it behaves like a real backend until the page reloads. See [API.md](API.md) for the full request/response contract to replicate when building the real backend.

**App shell**:
- [App.tsx](src/App.tsx) sets up the `QueryClientProvider`, antd `ConfigProvider` (theme tokens), and `RouterProvider`.
- [routes/router.tsx](src/routes/router.tsx) defines routes, all nested under `AppLayout`.
- **Error handling** is two-layered, and both layers matter — they don't substitute for each other: [components/ErrorBoundary/index.tsx](src/components/ErrorBoundary/index.tsx) is a plain React class error boundary wrapping `<RouterProvider>` in `App.tsx`, but React Router's data router (`createBrowserRouter`) has its own internal error boundary around every route's rendered output that intercepts render errors *before* they can bubble out to a boundary wrapping `RouterProvider` from outside — so a component that throws will always hit React Router's default (ugly, dev-only) fallback instead, never the outer boundary, unless a route defines its own error handling. That's what [components/ErrorBoundary/RouteErrorFallback.tsx](src/components/ErrorBoundary/RouteErrorFallback.tsx) is for: it's wired in as `ErrorBoundary: RouteErrorFallback` on the root route in `router.tsx`, which catches render errors from any nested route (`OverviewPage`, `TransactionsPage`, etc.) via React Router's `useRouteError()` hook. If you add a new top-level route outside the current root route's `children`, give it the same `ErrorBoundary` (or nest it under the existing root) or it won't be covered.
- [components/layout/AppLayout.tsx](src/components/layout/AppLayout.tsx) is the sidebar + header shell (antd `Layout`/`Menu`) that all pages render inside via `<Outlet />`. Both `Sider` and `Header` are `position: sticky` so they stay put while `Content` scrolls — don't reintroduce a plain non-sticky `Header`/`Sider`, that regresses to the whole page scrolling together.
- Each route lives in its own folder under [src/pages/](src/pages/) as `PageName/index.tsx` (+ `PageName/index.test.tsx` where a test exists) — e.g. [OverviewPage/index.tsx](src/pages/OverviewPage/index.tsx). Importing `'@pages/PageName'` (see [router.tsx](src/routes/router.tsx)) resolves to that folder's `index.tsx` automatically; don't add a second file per page outside its folder. Pages: `OverviewPage` (total balance, full account list with number/type/balance/status, recent transactions — account cards link into `TransactionsPage` filtered to that account), `TransactionsPage` (search, per-account filter, running-balance column, detail drawer), `TransferPage` (funds transfer between own accounts), `InsightsPage` (spending-by-category, spending-trend, top-merchants, income-vs-expense charts; the three half-width charts use `lg={8}` — a 3-across grid — rather than `lg={12}`, since 3 items at half-width wrap unevenly and leave a dead-space gap, the same layout bug fixed once already on `OverviewPage`). There is no separate accounts-list page — it was merged into `OverviewPage` so the account overview and summary live on one screen.
- [utils/runningBalance.ts](src/utils/runningBalance.ts) reconstructs the balance after each transaction by walking backwards from an account's current balance — used by both `TransactionsPage`'s "Balance After" column and its detail drawer. Any UI showing a running balance should reuse this rather than re-deriving it.

**Testing**: Vitest + React Testing Library, jsdom environment (configured in [vite.config.ts](vite.config.ts), setup file at [src/test/setup.ts](src/test/setup.ts)). The setup file polyfills `window.matchMedia` (antd's responsive components, `Layout.Sider`/`Grid`) and `window.ResizeObserver` (antd's `Select`/dropdown positioning), neither of which jsdom implements. Component tests that touch data should call `installMockBackend()` in a `beforeEach` (see [OverviewPage/index.test.tsx](src/pages/OverviewPage/index.test.tsx)) rather than mocking `fetch`/`axios` by hand — it exercises the real request/response path through the shared Axios instance.

## Styling: Tailwind + Ant Design

Layout, spacing, sizing, and one-off color overrides are done with Tailwind utility classNames, not inline `style={{}}` — don't reintroduce raw `style` props for things Tailwind already covers.

- Tailwind is wired in via the `@tailwindcss/vite` plugin ([vite.config.ts](vite.config.ts)) and imported in [src/index.css](src/index.css) as `@import 'tailwindcss/theme' layer(theme);` + `@import 'tailwindcss/utilities' layer(utilities);` — **deliberately not** `@import 'tailwindcss'` (which also pulls in Preflight). Tailwind's Preflight base reset fights with antd's own CSS reset/component styles, so it's skipped; only Tailwind's utility classes are available, and antd's baseline styling is untouched.
- For antd components that expose semantic slots (`Statistic`, `Card`, etc.), prefer their `classNames={{ slot: '...' }}` prop over `styles={{ slot: {...} }}` so slot styling stays Tailwind classes instead of inline CSS objects — see [OverviewPage/index.tsx](src/pages/OverviewPage/index.tsx).
- **All Tailwind utilities are global `!important`**, via [tailwind.config.ts](tailwind.config.ts)'s `important: true`, loaded through `@config '../tailwind.config.ts';` in [src/index.css](src/index.css). This exists because Tailwind's utilities live in `layer(utilities)` while antd's CSS-in-JS is unlayered, and **unlayered CSS always wins over layered CSS, no matter the specificity** — without this, plain Tailwind classes on antd components (margins, position, colors, widths, backgrounds, ...) silently do nothing. This was found piecemeal (`Layout.Sider`'s `position`, `Header`'s background, `InputNumber`'s width, every `Card`/`Typography.Title`'s margin) before being fixed at the root instead of per-instance — don't reintroduce manual `!` suffixes (e.g. `sticky!`, `mb-6!`) now that the global flag covers it; if a Tailwind class on an antd component still visibly has no effect after this, something else is wrong (check for a typo or a wrapper element eating the class) rather than reaching for `!` again.
- If you touch `AppLayout.tsx`'s sticky `Sider`/`Header`, re-verify with a real scroll (short viewport + scroll, not just a static screenshot) — a regression here silently drops the `position` override and the sidebar scrolls away with the page instead of staying pinned.
- Arbitrary one-off values (e.g. a 480px card max-width) are fine as Tailwind arbitrary-value classes (`max-w-[480px]`) rather than inline `style`.
- **Vertical rhythm convention**: every page's top-level `Typography.Title level={3}` gets `className="mb-4"` (16px to the content below); a sub-section `Typography.Title level={4}` gets `className="mt-6 mb-4"` (24px from the section above, 16px to its own content); a major content block that needs space before the next sibling gets `mb-6` (24px). Don't leave a `Typography.Title` with no margin override — antd's own default title margins are inconsistent (10–12px) and don't match this scale, which is exactly the "weird inconsistent spacing" bug this convention replaced.

## Path aliases

Every folder directly under `src/` (except `src/*.tsx` root files) has an absolute-import alias — use these instead of relative `../../` imports:

| Alias | Resolves to |
|---|---|
| `@api/*` | `src/api/*` |
| `@components/*` | `src/components/*` |
| `@mutations/*` | `src/mutations/*` |
| `@pages/*` | `src/pages/*` |
| `@queries/*` | `src/queries/*` |
| `@routes/*` | `src/routes/*` |
| `@store/*` | `src/store/*` |
| `@test/*` | `src/test/*` |
| `@apptypes/*` | `src/types/*` |
| `@utils/*` | `src/utils/*` |

The `types` folder is aliased as `@apptypes`, not `@types` — `@types/*` is the real npm scope for DefinitelyTyped packages (`@types/react`, `@types/node`, ...), and TypeScript's `paths` resolution would take over that specifier once matched, so aliasing it as `@types` would risk breaking resolution of actual `@types/*` packages.

These are defined in **two places that must stay in sync**: [vite.config.ts](vite.config.ts)'s `resolve.alias` (what Vite/Vitest actually resolve at build/test time) and [tsconfig.app.json](tsconfig.app.json)'s `compilerOptions.paths` (what `tsc`/the editor's language service understand — `paths` here works without `baseUrl` since `moduleResolution: bundler` resolves them relative to the tsconfig file, but each path value still needs the leading `./`). Adding a new top-level `src/` folder means updating both files.

Each alias in `tsconfig.app.json` needs **two** `paths` entries — an exact one (`"@queries": ["./src/queries"]`) and a wildcard one (`"@queries/*": ["./src/queries/*"]`). Vite's `resolve.alias` prefix-matches automatically so a single entry covers both `@queries` (bare, resolves via directory `index.ts`) and `@queries/useAccounts`, but TS's wildcard `paths` pattern only matches specifiers with something after the slash — a bare `@queries` import silently fails to resolve under `tsc` without the exact entry too (this bit `@queries`/`@mutations` when they were introduced, since both are imported bare via their barrels).

## Ant Design v6 notes

This project pins the current major (v6), which has deprecated some APIs still common in older examples/training data. When adding UI, check for deprecation warnings in the console/test output before assuming an API is current — notable ones already hit in this codebase:
- `List` / `List.Item` is deprecated (removed in the next major); recent-transactions style rows are built with plain `Flex`/`Divider` instead (see [OverviewPage/index.tsx](src/pages/OverviewPage/index.tsx)).
- `Statistic`'s `valueStyle` prop is deprecated in favor of `styles={{ content: {...} }}` (or, per the Tailwind convention above, `classNames={{ content: '...' }}`).
