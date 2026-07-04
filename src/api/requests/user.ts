import { ME_URL } from "@context/request-url";
import { RequestBuilder } from "../http/requestBuilder";
import type { User } from "@apptypes/user";

export async function fetchCurrentUser(): Promise<User> {
  return new RequestBuilder<User>().withMethod("get").withUrl(ME_URL).send();
}
