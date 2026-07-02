# Backend API Contract

This describes the HTTP API the frontend currently expects. It's derived directly from the mock backend at [src/api/mockBackend.ts](src/api/mockBackend.ts), the request functions in [src/api/banking.ts](src/api/banking.ts), and the shared Axios client at [src/api/client.ts](src/api/client.ts). When a real backend is built, implementing these endpoints with matching shapes should let the frontend switch over with no code changes beyond setting `VITE_API_BASE_URL`.

## Switching from mock to real backend

The frontend only talks to the mock when `VITE_API_BASE_URL` is unset (see [src/main.tsx](src/main.tsx)). Set it (e.g. in `.env.local`):

```
VITE_API_BASE_URL=https://api.example.com
```

All requests below are relative to that base URL.

## Auth

- The client attaches `Authorization: Bearer <token>` to every request, where `<token>` is read from `localStorage.auth_token` ([src/api/client.ts](src/api/client.ts)).
- On any `401` response, the client clears `localStorage.auth_token`.
- **Not yet implemented on the frontend**: there is no login/token-issuing flow yet — something needs to populate `localStorage.auth_token` (a login page, SSO redirect, etc.) before these endpoints are called. Add that flow alongside the real backend.

## Endpoints

### `GET /me`

Returns the signed-in user.

**Response `200`**
```json
{
  "id": "u1",
  "name": "Jordan Lee",
  "email": "jordan.lee@example.com"
}
```

### `GET /accounts`

Returns all accounts belonging to the signed-in user.

**Response `200`**
```json
[
  {
    "id": "acc-1",
    "name": "Everyday Checking",
    "type": "checking",
    "balance": 4231.55,
    "currency": "USD",
    "accountNumber": "**** 4821",
    "status": "active"
  }
]
```

`type` is one of `"checking" | "savings" | "credit"`. `balance` may be negative (e.g. credit card balances owed). `status` is one of `"active" | "frozen" | "closed"` — only `active` accounts may be used as a transfer source or destination.

### `GET /transactions`

Returns transactions, optionally filtered by account.

**Query params**
| param | required | description |
|---|---|---|
| `accountId` | no | when present, only return transactions for that account |

**Response `200`**
```json
[
  {
    "id": "tx-1",
    "accountId": "acc-1",
    "date": "2026-06-28",
    "description": "Whole Foods Market",
    "category": "Groceries",
    "amount": -86.42,
    "status": "completed"
  }
]
```

`date` is `YYYY-MM-DD`. `amount` is negative for debits, positive for credits. `status` is one of `"completed" | "pending"`. Transfers (see below) are surfaced here too, under `category: "Transfer"`.

### `POST /transfers`

Moves funds between two of the signed-in user's own accounts.

**Request**
```json
{
  "fromAccountId": "acc-1",
  "toAccountId": "acc-2",
  "amount": 100,
  "note": "Monthly savings"
}
```

`note` is optional. `amount` must be a positive number.

**Response `200`** — both updated accounts and the two transactions the transfer generated (a debit on `fromAccount`, a credit on `toAccount`, both dated today and categorized `"Transfer"`):
```json
{
  "fromAccount": { "id": "acc-1", "balance": 4131.55, "...": "rest of Account" },
  "toAccount": { "id": "acc-2", "balance": 18442.10, "...": "rest of Account" },
  "transactions": [
    { "id": "tx-transfer-1", "accountId": "acc-1", "amount": -100, "category": "Transfer", "...": "rest of Transaction" },
    { "id": "tx-transfer-2", "accountId": "acc-2", "amount": 100, "category": "Transfer", "...": "rest of Transaction" }
  ]
}
```

**Response `400`** — validation failure, body is `{ "message": string }`. The mock rejects: identical source/destination, non-positive amount, unknown account id, either account not `active`, or insufficient balance in `fromAccount`. A real backend should apply the same checks (plus authorization — confirm both accounts belong to the caller).

## Shared types

These map 1:1 to [src/types/banking.ts](src/types/banking.ts) — keep the backend response shapes in sync with that file (or generate one from the other) so a schema change only needs to happen in one place.

```ts
interface User {
  id: string;
  name: string;
  email: string;
}

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  currency: string;
  accountNumber: string;
  status: 'active' | 'frozen' | 'closed';
}

interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: 'completed' | 'pending';
}

interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  note?: string;
}

interface TransferResult {
  fromAccount: Account;
  toAccount: Account;
  transactions: [Transaction, Transaction];
}
```

## Client behavior to match

- Requests time out after 10s ([src/api/client.ts](src/api/client.ts)).
- React Query treats responses as fresh for 30s before refetching ([src/App.tsx](src/App.tsx)), and retries a failed request once. A successful `POST /transfers` invalidates both the `accounts` and `transactions` queries client-side ([src/mutations/useTransferFunds.ts](src/mutations/useTransferFunds.ts)), so the real backend doesn't need to push updates — the frontend just refetches.
- No pagination or sorting exists yet on `GET /transactions`. Add it before account histories grow large; the frontend's `Table` in [TransactionsPage/index.tsx](src/pages/TransactionsPage/index.tsx) already paginates client-side at 10 rows/page and computes running balances from the full unpaginated list ([src/utils/runningBalance.ts](src/utils/runningBalance.ts)), so switching to server-side pagination would require reworking both.
