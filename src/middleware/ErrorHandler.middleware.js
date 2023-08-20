import { ErrorCode } from "../utils/ErrorCode.js";

export const ErrorHandler = (error, req, res, next) => {
  switch (error.code) {
    case ErrorCode.BAD_PARAMETERS:
      res.status(error.httpStatus).send({
        error,
        status: "error",
      });
      break;
    case ErrorCode.UNAUTHORISED:
      res.status(error.httpStatus).send({
        error: error.message,
        status: "error",
      });
      break;
    case ErrorCode.CART_MISSING:
      res.status(404).send({
        error: "could not find the cart",
        status: "error",
      });
      break;
    case ErrorCode.BILL_MISSING:
      res.status(404).send({
        error: "could not find the bill",
        status: "error",
      });
      break;
    case ErrorCode.PRODUCT_MISSING:
      res.status(404).send({
        error: "could not find the product",
        status: "error",
      });
      break;
    case ErrorCode.DB_ISSUE:
      res.status(500).send({
        error: { ...error, message: "There is something wrong with the call to the DB" },
        status: "error",
      });
      break;
    default:
      res.send({
        error: "Unhandled error",
        status: "error",
      });
  }
};
