import { ErrorCode } from "./ErrorCode";

export class UnauthorisedError extends Error {
  httpStatus;
  url;
  message;
  code;

  constructor(url) {
    super(`Unauthorised to access ${url}`);
    this.httpStatus = 401;
    this.url = url;
    this.code = ErrorCode.UNAUTHORISED;
  }
}
