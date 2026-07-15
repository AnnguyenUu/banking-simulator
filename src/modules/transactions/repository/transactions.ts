import type { AxiosResponseListType } from "@apptypes/responseType";
import { RequestBuilder } from "@api/http/requestBuilder";
import type { GetTransactionPayload, Transaction } from "@apptypes/transactions";
import { TRANSACTIONS_URL } from "../configuration/constants";

export async function fetchTransactions(
  payload?: GetTransactionPayload,
): Promise<AxiosResponseListType<Transaction>> {
  return new RequestBuilder<AxiosResponseListType<Transaction>>()
    .withMethod("get")
    .withUrl(TRANSACTIONS_URL)
    .withParams(payload ?? {})
    .send();
}
