# 0004: Security Considerations & Assumptions

**Status**: Accepted

## Context

This is a banking-domain dashboard, so it needed a defensible baseline
security posture from the start rather than "add security later" — while
being honest about what frontend-only controls can and cannot guarantee.

## Alternatives Considered

- **No CSP** vs. enforced — rejected, CSP is high-leverage/low-cost.
- **Meta tag only vs. headers only vs. both** — meta can't express `frame-ancestors`/HSTS; headers need Vercel (or a compatible host).
- **Hardcoded `connect-src` vs. derived from env** — derived avoids manual edits per environment.
- **Client-side route guards as the real access boundary vs. UX-only** — chose UX-only.

## Final Decision

- **CSP in two layers** — headers via [vercel.json](../../vercel.json), mirrored `<meta>` tag in [index.html](../../index.html) as a fallback.
- **`style-src 'unsafe-inline'`** — deliberate exception for Ant Design's CSS-in-JS and Recharts' inline styles.
- **Cookie-based session auth** (`withCredentials: true`) — no bearer token in `localStorage`.
- **`connect-src` derived from `VITE_API_BASE_URL`** at build time (see [0003](api-integration.md)).
- **`ProtectedRoute` is UX only** — real access control must live on the backend.

## Trade-offs (Consequences)

- **Two CSP layers, no shared source of truth** — can drift out of sync (same duplication risk fixed once for theme tokens, [0001](frontend-architecture.md)).
- **`unsafe-inline` on `style-src`** is a real, low-severity loosening; a full fix needs nonce infrastructure this static SPA doesn't have.
- **Cookie auth security depends entirely on backend config** (`SameSite`/`Secure`/CORS) — not verifiable from this repo.
- **No CSRF token on the frontend** — assumed to be the backend's responsibility.
