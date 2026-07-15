import { RequestBuilder } from "@api/http/requestBuilder";
import type { LoginRequest } from "@apptypes/auth";
import type { User } from "@apptypes/user";
import { LOGIN_URL, LOGOUT_URL } from "../configuration/constants";

export async function login(payload: LoginRequest): Promise<User> {
  return new RequestBuilder<User>()
    .withMethod("post")
    .withUrl(LOGIN_URL)
    .withData(payload)
    .send();
}

export async function logout(): Promise<void> {
  return new RequestBuilder<void>().withMethod("post").withUrl(LOGOUT_URL).send();
}
