import { RequestBuilder } from "../http/requestBuilder";
import type { Insights } from "@apptypes/insights";
import { INSIGHTS_URL } from "@context/request-url";

export async function fetchInsights(accountId?: string): Promise<Insights> {
  return new RequestBuilder<Insights>()
    .withMethod("get")
    .withUrl(INSIGHTS_URL)
    .withParams(accountId ? { accountId } : {})
    .send();
}
