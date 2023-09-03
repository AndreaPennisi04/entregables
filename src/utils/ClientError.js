export class ClientError extends Error {
  httpStatus;
  service;
  details;
  code;

  constructor(service, code, httpStatus, message, details) {
    super(message);
    this.httpStatus = httpStatus;
    this.service = service;
    this.details = details;
    this.code = code;
  }
}
