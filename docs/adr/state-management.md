# 0002: State Management Approach

**Status**: Accepted

## Context

The app has three kinds of state — server data, pure client UI state, and
ephemeral page-local state — and managing them all the same way (one global
store) risks staleness bugs and unnecessary re-renders.

## Alternatives Considered

- **Redux/Redux Toolkit** — too much boilerplate for the small amount of actual client state.
- **React Context + `useReducer`** — doesn't solve server-state concerns (caching, refetch, loading/error).
- **SWR** instead of React Query — comparable; React Query's explicit mutation API won out.
- **One global store for everything** — rejected, causes server/client state to disagree after mutations.

## Final Decision

- **Server state → React Query**, always. One hook per concern in
  [@queries](../../src/queries/)/[@mutations](../../src/mutations/); pages
  never fetch directly.
- **Mutations patch the cache directly** — `useLogin` seeds `['me']`,
  `useLogout` calls `queryClient.clear()`, `useTransferFunds` invalidates
  `['accounts']`/`['transactions']`.
- **Pure client UI state → Zustand**
  ([useSessionStore](../../src/store/useSessionStore.ts)) — currently just
  `selectedAccountId`.
- **Page-local ephemeral state → local `useState`** — search debounce, date range, drawer selection.

## Trade-offs (Consequences)

- **Two mental models** to learn (React Query vs. Zustand) instead of one.
- **No enforced boundary** — nothing stops server data ending up in Zustand except convention/review.
- **Cache-patching requires React Query fluency** — easy to reach for a blunter `invalidateQueries()` instead.
- **Module-level Zustand state leaks across tests** unless reset in `beforeEach`.
