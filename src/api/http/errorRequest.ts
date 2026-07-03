export class ErrorRequest {
  protected handleError(error: unknown): never {
    throw error;
  }
}
