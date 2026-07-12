# Frontend Conventions cho project Next.js mới

Tài liệu này đúc kết các pattern đang dùng trong `banking-dashboard` (Vite +
React SPA) và chuyển đổi sang khuyến nghị tương đương cho Next.js App
Router. Mang file này sang repo mới, dán vào `CLAUDE.md` (hoặc để cạnh đó
làm ngữ cảnh) trước khi chạy `/init`.

Nguồn tham khảo trong project gốc: [docs/adr/frontend-architecture.md](../docs/adr/frontend-architecture.md),
[docs/adr/state-management.md](../docs/adr/state-management.md), [API.md](../API.md).

---

## 1. Tech stack đề xuất

| Layer | Project gốc (Vite SPA) | Khuyến nghị cho Next.js |
|---|---|---|
| Framework | Vite + React Router | **Next.js App Router** (Server Components mặc định) |
| Server state | React Query (`@tanstack/react-query`) | **Giữ nguyên React Query** — vẫn cần cho: refetch, cache invalidation sau mutation, optimistic update, polling. Next.js `fetch` cache chỉ giải quyết lần fetch đầu, không thay được React Query cho tương tác client-side. |
| Client UI state | `sessionStorage`-backed hook (thay Redux) | Giữ nguyên tinh thần: state client thuần túy → hook nhỏ, không kéo Redux vào chỉ vì 1-2 field |
| UI framework | Ant Design v6 | Ant Design vẫn dùng được, nhưng **mọi component antd phải là Client Component** (`"use client"`) — antd dùng context/hooks nội bộ, không render được trên Server Component |
| CSS | Tailwind v4 + antd, ép `important: true` | Tailwind giữ nguyên; nếu dùng antd thì giữ luôn fix `important: true` trong `tailwind.config.ts` (xem mục 4) |
| HTTP client | Axios + Builder pattern | Giữ nguyên cho phần gọi từ Client Component; phần fetch trong Server Component/Route Handler dùng `fetch` native của Next.js |

---

## 2. Cấu trúc thư mục

Cấu trúc gốc (flat theo *loại*, không theo route):

```
src/
  api/
    http/          # axios client, request builder, error handling
    requests/       # 1 file/domain: accounts.ts, transactions.ts...
    mock/           # mock backend (dev không cần BE thật)
  context/
    query-keys/     # hằng số query key dùng chung
    request-url/    # hằng số URL endpoint
    theme/          # theme config cho ConfigProvider
  queries/          # 1 hook/domain: useAccounts.ts, useInsights.ts
  mutations/        # 1 hook/action: useTransferFunds.ts, useLogin.ts
  components/atomic # wrapper mỏng quanh antd, có Storybook
  pages/<PageName>/ # 1 folder/route, con có components/hooks/utils riêng
  types/            # types dùng chung, khớp 1:1 với API contract
```

Chuyển sang Next.js App Router — **giữ nguyên các layer ngang** (`api/`,
`queries/`, `mutations/`, `components/`), chỉ thay `pages/` bằng `app/`:

```
src/
  app/
    (dashboard)/
      overview/page.tsx
      transactions/page.tsx
      transfer/page.tsx
    login/page.tsx
    layout.tsx              # đặt QueryClientProvider, ConfigProvider ở đây
  api/                       # giữ nguyên: http/, requests/, mock/
  context/
    query-keys/
    request-url/
    theme/
  queries/                   # giữ nguyên, dùng trong Client Component
  mutations/                 # giữ nguyên
  components/
    atomic/                  # wrapper antd
    <route-name>/            # component riêng cho 1 route, đặt cạnh route trong app/ hoặc ở đây tùy quy mô
  types/
```

**Quy tắc giữ nguyên từ project gốc** (đã chứng minh hiệu quả, xem ADR 0001):
- Mỗi domain có đúng 1 file request (`requests/accounts.ts`), 1 file query
  hook (`queries/useAccounts.ts`) — không gộp nhiều domain vào 1 file.
- Component con riêng của 1 route/page nằm trong thư mục con
  `components/`, `hooks/`, `utils/` ngay cạnh page đó — không đẩy lên
  `src/components` trừ khi được tái sử dụng ở ≥2 route.
- Path alias theo layer (`@api`, `@queries`, `@mutations`, `@components`,
  `@apptypes`, `@utils`...) khai báo trong `tsconfig.json`, không dùng
  relative path dài (`../../../`).

**Khác biệt cần lưu ý với Next.js**: ranh giới Server/Client Component là
một trục tổ chức mới không tồn tại ở SPA. Quy ước:
- `app/**/page.tsx` mặc định là Server Component — chỉ fetch dữ liệu
  *đọc lần đầu* (SSR) tại đây bằng `fetch` native hoặc gọi thẳng hàm trong
  `api/requests/`.
- Mọi phần có tương tác (form, table có filter, nút mutation) tách thành
  Client Component riêng (`"use client"` ở đầu file), nhận data ban đầu
  qua props từ Server Component cha nếu cần, rồi tự quản lý bằng React
  Query từ đó trở đi.

---

## 3. Design pattern đang dùng

### 3.1 Repository pattern cho gọi API (`src/api/`)

3 lớp tách biệt, mỗi lớp một trách nhiệm:

1. **`http/client.ts`** — 1 axios instance duy nhất, cấu hình chung
   (`baseURL`, `timeout`, `withCredentials`):
   ```ts
   export const apiClient = axios.create({
     baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
     timeout: 10_000,
     withCredentials: true,
   });
   ```
   Ở Next.js: đổi `import.meta.env` → `process.env.NEXT_PUBLIC_API_BASE_URL`.

2. **`http/requestBuilder.ts`** — Builder pattern bọc axios, để mọi request
   đi qua cùng 1 chỗ xử lý lỗi (`ErrorRequest`):
   ```ts
   class RequestBuilder<T> extends ErrorRequest {
     withMethod(method): this { ... }
     withUrl(url): this { ... }
     withData(data): this { ... }
     async send(): Promise<T> { ... }
   }
   ```

3. **`requests/<domain>.ts`** — hàm thuần, 1 hàm/endpoint, dùng builder ở
   trên. Đây chính là "repository" — nơi duy nhất biết URL và shape response:
   ```ts
   export async function fetchAccounts(): Promise<AxiosResponseListType<Account>> {
     return new RequestBuilder<AxiosResponseListType<Account>>()
       .withMethod('get')
       .withUrl(ACCOUNTS_URL)
       .send();
   }
   ```

Lớp này **không phụ thuộc React Query** — có thể gọi thẳng từ Server
Component (SSR) hoặc từ query hook (Client Component).

### 3.2 Atomic wrapper cho UI framework (`components/atomic/`)

Mọi component antd đi qua 1 file wrapper mỏng thay vì import thẳng từ
`antd` khắp nơi:

```tsx
const Button = (props: ButtonProps) => <ButtonPrimitive {...props} />;
const MemoButton = memo(Button);
MemoButton.displayName = 'Button';
export default Object.assign(MemoButton, { Group: ButtonPrimitive.Group });
```

Lý do (ADR 0001): đổi `displayName`/theme mặc định cho 1 component chỉ sửa
1 chỗ thay vì rải khắp codebase. Cái giá: tốn 1 file/component ngay từ đầu,
kể cả khi component chưa dùng đến — chấp nhận trade-off này nếu định dùng
antd xuyên suốt app.

### 3.3 Query keys tập trung (`context/query-keys/`)

Hằng số key thay vì string literal rải rác, tránh lệch tay khi
invalidate:

```ts
export const ACCOUNT_QUERY_KEY = 'accounts';
export const TRANSACTIONS_KEYS = 'transactions';
```

---

## 4. UI framework — Ant Design

- Cấu hình theme tập trung 1 chỗ (`context/theme`), truyền vào
  `<ConfigProvider theme={theme}>` ở root layout.
- Ở Next.js, `ConfigProvider` và mọi thứ bọc nó phải là Client Component —
  đặt trong `app/layout.tsx` nhưng tách phần antd ra 1 file
  `"use client"` riêng (ví dụ `providers.tsx`) rồi import vào layout, để
  layout gốc vẫn có thể là Server Component cho phần còn lại.
- antd v6 dùng CSS-in-JS runtime — cần `AntdRegistry` (từ
  `@ant-design/nextjs-registry`) trong `providers.tsx` để style không bị
  "nhấp nháy" (FOUC) khi SSR.

## 5. CSS framework — Tailwind + antd

Vấn đề đã gặp và cách fix (ADR 0001, có giải thích kỹ trong
`tailwind.config.ts`):

> antd xuất CSS-in-JS **không nằm trong CSS layer nào**. Theo spec cascade
> layers, rule không có layer luôn thắng rule có layer bất kể specificity —
> nên style của antd âm thầm đè lên utility class của Tailwind (margin,
> width, color...) dù Tailwind utility có specificity cao hơn.

Fix: ép toàn bộ Tailwind utilities thành `!important`:

```ts
// tailwind.config.ts
export default {
  important: true,
} satisfies Config;
```

Áp dụng y hệt nếu project Next.js mới cũng kết hợp Tailwind + antd. Nếu
đổi sang UI framework khác có layer CSS chuẩn (ví dụ shadcn/ui — chỉ là
Tailwind, không có CSS-in-JS riêng) thì **không cần** fix này.

---

## 6. Data fetching qua React Query — chi tiết

### 6.1 Setup

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});
```

`staleTime: 30_000` — coi data còn "tươi" 30s trước khi tự refetch khi
component mount lại/focus lại tab. Chỉnh theo độ nhạy dữ liệu (balance tài
khoản có thể cần thấp hơn; danh mục tĩnh có thể cao hơn).

Ở Next.js: khởi tạo `QueryClient` trong Client Component (`providers.tsx`),
dùng `useState(() => new QueryClient(...))` để không tạo lại mỗi render.

### 6.2 Query hook — đọc dữ liệu

Pattern: 1 hook/domain, wrap `useQuery`, expose field đã "unwrap" sẵn thay
vì để component tự đào vào `data`:

```ts
export function useAccounts() {
  const query = useQuery({
    queryKey: [ACCOUNT_QUERY_KEY],
    queryFn: fetchAccounts,
  });
  return {
    ...query,
    accounts: query?.data?.data ?? [],
  };
}
```

Component gọi `const { accounts, isLoading } = useAccounts()` — không bao
giờ import `fetchAccounts` hay gọi `useQuery` trực tiếp trong page/component
(quy tắc cứng trong ADR 0002: "pages never fetch directly").

### 6.3 Mutation hook — ghi dữ liệu + cập nhật cache

Pattern: mutation tự chịu trách nhiệm invalidate đúng những query bị ảnh
hưởng — component gọi mutation không cần biết phải refetch gì:

```ts
export function useTransferFunds() {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: transferFunds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNT_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEYS] });
    },
  });
  return { ...mutate, transfer: mutate.mutate };
}
```

3 cách cache được cập nhật sau mutation, tùy tình huống (đã dùng cả 3 trong
project gốc):
- **`invalidateQueries`** — khi cần data mới nhất từ server, chấp nhận 1
  round-trip thêm (`useTransferFunds`).
- **Seed trực tiếp `setQueryData`** — khi response mutation *chính là* data
  cần cache, khỏi refetch (`useLogin` seed thẳng `['me']`).
- **`queryClient.clear()`** — khi đổi identity hoàn toàn (logout), xóa sạch
  thay vì invalidate từng key.

### 6.4 Next.js — kết hợp Server Component fetch với React Query

Đây là điểm khác biệt lớn nhất so với SPA gốc. Khuyến nghị:

- **Lần đọc đầu tiên của 1 route** → fetch trong Server Component
  (`page.tsx`), gọi thẳng hàm trong `api/requests/` (không qua React
  Query) để có SSR/streaming.
- **Mọi tương tác sau đó** (refetch, filter, polling, mutation) → Client
  Component dùng React Query như cũ.
- Nếu muốn tránh double-fetch (Server Component fetch, rồi Client
  Component fetch lại lúc mount), dùng
  [`HydrationBoundary`](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)
  của React Query: `prefetchQuery` trong Server Component với **cùng
  query key** mà hook client dùng, dehydrate xuống, client hydrate lại —
  query hook nhận data có sẵn, không fetch lần 2.
- Route Handlers (`app/api/**/route.ts`) chỉ cần thiết nếu Next.js app này
  cũng đóng vai trò BE (BFF). Nếu BE là service riêng (như project gốc,
  xem `API.md`) thì bỏ qua, gọi thẳng BE từ `api/requests/`.

### 6.5 API contract

Giữ 1 file `API.md` (hoặc OpenAPI schema) mô tả từng endpoint: request
shape, response shape, error shape, business rule validate ở đâu (client
hay server). Project gốc có ví dụ đầy đủ ở [API.md](../API.md) — copy cấu
trúc đó, không cần dựng mock backend nếu Next.js app không cần chạy độc
lập với BE thật.

---

## 7. Checklist khi bootstrap project Next.js mới

- [ ] `app/layout.tsx` (Server) → tách `providers.tsx` (`"use client"`)
      chứa `QueryClientProvider` + `ConfigProvider` (antd) +
      `AntdRegistry`
- [ ] `tailwind.config.ts` → `important: true` nếu dùng antd
- [ ] `src/api/http/client.ts`, `requestBuilder.ts` (copy gần như nguyên
      từ project gốc, đổi env var)
- [ ] `src/context/query-keys/`, `src/context/request-url/`
- [ ] `src/queries/`, `src/mutations/` — 1 file/domain, theo pattern mục 6.2–6.3
- [ ] `src/types/` khớp 1:1 với `API.md`
- [ ] Path alias trong `tsconfig.json` (`@api`, `@queries`, `@mutations`,
      `@components`, `@apptypes`, `@utils`)
- [ ] Quyết định: dùng `HydrationBoundary` để prefetch SSR hay để mọi thứ
      fetch client-side (đơn giản hơn, chấp nhận 1 loading flash đầu trang)
