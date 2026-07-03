export class ErrorRequest {
  protected handleError(error: unknown): never {
    // Auth is an HttpOnly cookie sent automatically via apiClient's
    // withCredentials — JS can't read or clear it, so the server owns
    // clearing it on logout; this is just the rethrow point for callers.
    throw error;
  }
}
