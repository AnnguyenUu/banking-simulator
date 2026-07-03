import { RequestBuilder } from "../http/requestBuilder";
import type { TransferRequest, TransferResult } from "@apptypes/transfers";

export async function transferFunds(
  request: TransferRequest,
): Promise<TransferResult> {
  return new RequestBuilder<TransferResult>()
    .withMethod("post")
    .withUrl("/transfers")
    .withData(request)
    .send();
}
