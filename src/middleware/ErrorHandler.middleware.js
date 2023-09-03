import { ErrorCode } from "../utils/ErrorCode.js";

export const ErrorHandler = (error, req, res, next) => {
  req.logger.error(JSON.stringify(error));
  switch (error.code) {
    case ErrorCode.BAD_PARAMETERS:
      res.status(error.httpStatus).send({
        message: error.message || "Bad parameters",
        status: "error",
      });
      break;
    case ErrorCode.UNAUTHORISED:
      res.status(error.httpStatus).send({
        message: error.message || "Unauthorised",
        status: "error",
      });
      break;
    case ErrorCode.CART_MISSING:
      res.status(404).send({
        message: error.message || "could not find the cart",
        status: "error",
      });
      break;
    case ErrorCode.BILL_MISSING:
      res.status(404).send({
        message: error.message || "could not find the bill",
        status: "error",
      });
      break;
    case ErrorCode.PRODUCT_MISSING:
      res.status(404).send({
        message: error.message || "could not find the product",
        status: "error",
      });
      break;
    case ErrorCode.DB_ISSUE:
      res.status(500).send({
        message: error.message || "There is something wrong with the call to the DB",
        status: "error",
      });
      break;
    case ErrorCode.SAME_PASSWORD:
      res.status(400).send({
        message: error.message || "You can't use the same password",
        status: "error",
      });
      break;
    default:
      res.send({
        message: error.message || "Unhandled error",
        status: "error",
      });
  }
};
