export class CustomError<T> extends Error {
  constructor(public readonly code: T, public readonly message: string) {
    super();
    this.code = code;
    this.message = message;
  }
}

export const isCustomError = <T>(error: unknown) => error instanceof CustomError<T>;
