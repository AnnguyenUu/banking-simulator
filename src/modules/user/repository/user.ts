import { ME_URL } from "../configuration/constants";
import { RequestBuilder } from "@api/http/requestBuilder";
import type { User } from "@apptypes/user";

export async function fetchCurrentUser(): Promise<User> {
  return new RequestBuilder<User>().withMethod("get").withUrl(ME_URL).send();
}
