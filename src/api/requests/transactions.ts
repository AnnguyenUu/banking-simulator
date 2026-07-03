import type { AxiosResponseListType } from "@apptypes/AxiosResponseType";
import { RequestBuilder } from "../http/requestBuilder";
import type { GetTransactionPayload, Transaction } from "@apptypes/transactions";

export async function fetchTransactions(
  payload?: GetTransactionPayload,
): Promise<AxiosResponseListType<Transaction>> {
  return new RequestBuilder<AxiosResponseListType<Transaction>>()
    .withMethod("get")
    .withUrl("/transactions")
    .withParams(payload ?? {})
    .send();
}
