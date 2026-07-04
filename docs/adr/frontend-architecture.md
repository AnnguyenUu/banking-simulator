# 0001: Frontend Architecture

**Status**: Accepted

## Context

No real backend existed yet, and the UI (tables, charts, forms, drawers) was
too dense to hand-roll every component from scratch.

## Alternatives Considered

- **Next.js (SSR/SSG)** vs. a plain Vite SPA — no SEO surface, everything is behind auth.
- **Custom component library** vs. adopting Ant Design.
- **Importing Ant Design directly** vs. wrapping components in a thin local layer (`src/components/atomic/`).

## Final Decision

- **React 19 + Vite**, client-only SPA. No SSR.
- **Ant Design v6** as the base component library, wrapped in `atomic/`.
- **Tailwind CSS** for layout/spacing, Ant Design for component visuals.

## Trade-offs (Consequences)

- **No SSR** — no server-rendered first paint, acceptable since the app is fully behind auth.
- **Tailwind + Ant Design conflict** — antd's unlayered CSS beat Tailwind's layered utilities until fixed globally via `important: true`.
- **Atomic wrapper layer** adds one indirection file per component, but has already paid for itself (a `displayName` fix applied once, everywhere).
- **Atomic design has an upfront cost** — a lot of boilerplate early on (one wrapper file per component before most are even used), and the `molecules`/`organisms` boundary is fuzzy in practice (e.g. `ProtectedRoute` is a routing guard, not a visual composition), so where a new file belongs isn't always obvious.
