export type AccountStatus = "active" | "frozen" | "closed";

export interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit";
  balance: number;
  currency: string;
  accountNumber: string;
  status: AccountStatus;
}
