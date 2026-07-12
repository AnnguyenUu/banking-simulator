
import { RequestBuilder } from "../http/requestBuilder";
import type { Account } from "@apptypes/accounts";
import type { AxiosResponseListType } from "@apptypes/responseType";
import { ACCOUNTS_URL } from "@context/request-url";

export async function fetchAccounts(): Promise<
  AxiosResponseListType<Account>
> {
  return new RequestBuilder<AxiosResponseListType<Account>>()
    .withMethod("get")
    .withUrl(ACCOUNTS_URL)
    .send();
}
