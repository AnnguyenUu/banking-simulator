import type { Permission } from "@apptypes/user";

export const PERMISSIONS = {
  OVERVIEW_VIEW: "overview:view",
  TRANSACTIONS_VIEW: "transactions:view",
  TRANSFER_VIEW: "transfers:view",
  TRANSFER_CREATE: "transfers:create",
  INSIGHTS_VIEW: "insights:view",
} satisfies Record<string, Permission>;
