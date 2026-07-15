import { TRANSFER_URL } from "../configuration/constants";
import { RequestBuilder } from "@api/http/requestBuilder";
import type { TransferRequest, TransferResult } from "@apptypes/transfers";

export async function transferFunds(
  request: TransferRequest,
): Promise<TransferResult> {
  return new RequestBuilder<TransferResult>()
    .withMethod("post")
    .withUrl(TRANSFER_URL)
    .withData(request)
    .send();
}
