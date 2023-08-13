import { Router } from "express";
import BillManagerDao from "../dao/managers/billManager.managers.js";
import { passportCall } from "../utils/jwt.js";
import { authorization } from "../middleware/authorization.middleware.js";
import CartManagerDao from "../dao/managers/cartManager.managers.js";

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
    this.router.get(`${this.path}/:bid`, [passportCall("jwt"), authorization("USER")], async (req, res) => {
      try {
        const billId = req.params.bid;
        const billItems = await this.billManager.getBillById(billId);
        res.status(200).send({ status: "success", payload: billItems });
      } catch ({ message }) {
        res.status(500).send({ status: "error", payload: message });
      }
    });

    //Post to create a new bill
    this.router.post(`${this.path}`, [passportCall("jwt"), authorization("USER")], async (req, res) => {
      try {
        const [cart] = await this.cartManager.getCart(req.user.userId);
        const newBill = await this.billManager.createBill(cart);

        res.status(200).send({ status: "success", payload: newBill });
      } catch ({ message }) {
        res.status(500).send({ status: "error", payload: message });
      }
    });
  }
}
