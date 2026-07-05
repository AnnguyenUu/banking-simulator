import { AxiosError, AxiosHeaders } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorRequest } from "./errorRequest";

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));

vi.mock("@routes/router", () => ({
  router: { navigate },
}));

class TestRequest extends ErrorRequest {
  fail(error: unknown) {
    this.handleError(error);
  }
}

const makeAxiosError = (status: number) =>
  new AxiosError(
    "Request failed",
    String(status),
    undefined,
    undefined,
    {
      status,
      statusText: "",
      headers: new AxiosHeaders(),
      config: { headers: new AxiosHeaders() },
      data: undefined,
    },
  );

describe("ErrorRequest.handleError", () => {
  beforeEach(() => {
    navigate.mockClear();
    window.history.pushState({}, "", "/");
  });

  afterEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("redirects to /login on a 401 response", () => {
    const request = new TestRequest();

    expect(() => request.fail(makeAxiosError(401))).toThrow();
    expect(navigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  it("does not redirect for non-401 errors", () => {
    const request = new TestRequest();

    expect(() => request.fail(makeAxiosError(403))).toThrow();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("does not redirect again when already on /login", () => {
    window.history.pushState({}, "", "/login");
    const request = new TestRequest();

    expect(() => request.fail(makeAxiosError(401))).toThrow();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("still rethrows non-axios errors without redirecting", () => {
    const request = new TestRequest();

    expect(() => request.fail(new Error("boom"))).toThrow("boom");
    expect(navigate).not.toHaveBeenCalled();
  });
});
