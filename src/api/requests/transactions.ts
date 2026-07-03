import type { AxiosResponseListType } from "@apptypes/AxiosResponseType";
import { RequestBuilder } from "../http/requestBuilder";
import type { GetTransactionPayload, Transaction } from "@apptypes/transactions";
import { TRANSACTIONS_URL } from "@context/request-url";

export async function fetchTransactions(
  payload?: GetTransactionPayload,
): Promise<AxiosResponseListType<Transaction>> {
  return new RequestBuilder<AxiosResponseListType<Transaction>>()
    .withMethod("get")
    .withUrl(TRANSACTIONS_URL)
    .withParams(payload ?? {})
    .send();
}
