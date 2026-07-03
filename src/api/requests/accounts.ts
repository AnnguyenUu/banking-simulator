import type { AxiosResponseListType } from "@apptypes/AxiosResponseType";
import { RequestBuilder } from "../http/requestBuilder";
import type { Account } from "@apptypes/accounts";

export async function fetchAccounts(): Promise<
  AxiosResponseListType<Account>
> {
  return new RequestBuilder<AxiosResponseListType<Account>>()
    .withMethod("get")
    .withUrl("/accounts")
    .send();
}
