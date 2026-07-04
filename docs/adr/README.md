# Architecture Decision Records

This directory records the significant, hard-to-reverse design decisions
behind this project — the *why*, not just the *what* (the code already shows
the what). Each ADR follows the same structure: Context, Alternatives
Considered, Final Decision, and Trade-offs.

New ADRs should be added as `short-title.md` and listed below in order, and
never edited to reverse a past decision — if a decision changes, add a new
ADR that supersedes the old one and note the supersession in both files.

## Index

| # | Title | Covers |
|---|---|---|
| [0001](frontend-architecture.md) | Frontend Architecture | Vite SPA, Ant Design + Tailwind, atomic component layering |
| [0002](state-management.md) | State Management Approach | React Query (server state) vs. client state — *client-state mechanism superseded by 0005* |
| [0003](api-integration.md) | API Integration Approach | Axios + mock-adapter, contract-first switch to a real backend |
| [0004](security-considerations.md) | Security Considerations & Assumptions | CSP, cookie-based session auth, route-guard limitations |
| [0005](client-state-persistence.md) | Client State Persistence Mechanism | Zustand → `sessionStorage`-backed hook |
