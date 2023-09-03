import { Router } from "express";
import BillManagerDao from "../dao/managers/billManager.managers.js";
import { passportCall } from "../utils/jwt.js";
import { authorization } from "../middleware/authorization.middleware.js";
import CartManagerDao from "../dao/managers/cartManager.managers.js";
import { ClientError } from "../utils/ClientError.js";
import { ErrorCode } from "../utils/ErrorCode.js";
import { RoleType } from "../constant/role.js";

export default class BillRouter {
  path = "/bill";
  router = Router();
  billManager = new BillManagerDao();
  cartManager = new CartManagerDao();

  constructor() {
    this.initBillRoutes();
  }

  initBillRoutes() {
    //Get bill by ID
    this.router.get(
      `${this.path}/:bid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res) => {
        try {
          const billId = req.params.bid;
          const billItems = await this.billManager.getBillById(billId);
          res.status(200).send({ status: "success", payload: billItems });
        } catch (error) {
          next(error);
        }
      }
    );
  }
}
