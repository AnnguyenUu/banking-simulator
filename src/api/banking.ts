import type { AxiosResponseListType } from "@apptypes/AxiosResponseType";
import { apiClient } from "./client";
import type {
  Account,
  GetTransactionPayload,
  Transaction,
  TransferRequest,
  TransferResult,
  User,
} from "@apptypes/banking";

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>("/me");
  return data;
}

export async function fetchAccounts(): Promise<AxiosResponseListType<Account>> {
  const { data } =
    await apiClient.get<AxiosResponseListType<Account>>("/accounts");
  return data;
}

export async function fetchTransactions(
  payload?: GetTransactionPayload,
): Promise<AxiosResponseListType<Transaction>> {
  const { data } = await apiClient.get<AxiosResponseListType<Transaction>>(
    "/transactions",
    {
      params: payload,
    },
  );
  return data;
}

export async function transferFunds(
  request: TransferRequest,
): Promise<TransferResult> {
  const { data } = await apiClient.post<TransferResult>("/transfers", request);
  return data;
}
