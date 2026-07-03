import { RequestBuilder } from "../http/requestBuilder";
import type { User } from "@apptypes/user";

export async function fetchCurrentUser(): Promise<User> {
  return new RequestBuilder<User>().withMethod("get").withUrl("/me").send();
}
