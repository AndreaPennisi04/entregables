import { billModel } from "../models/billModel.models.js";
import crypto from "crypto";
import CartManagerDao from "./cartManager.managers.js";
import ProductManagerDao from "./productManager.managers.js";
import { ClientError } from "../../utils/ClientError.js";
import { ErrorCode } from "../../utils/ErrorCode.js";

export default class BillManagerDao {
  cartManager;
  productManager;

  constructor() {
    this.cartManager = new CartManagerDao();
    this.productManager = new ProductManagerDao();
  }

  async createBill(cart) {
    try {
      const productsToBill = [];
      let billTotal = 0;

      if (!cart) {
        throw new ClientError("billing", ErrorCode.CART_MISSING);
      }

      for (const product of cart.products) {
        if (product.product.stock < product.quantity) {
          continue;
        }

        await this.cartManager.deleteProduct(cart._id, product.product.id);
        await this.productManager.changeStockForProduct(product.product.id, product.quantity * -1);

        billTotal += product.product.price * product.quantity;

        productsToBill.push({
          product: product.product._id,
          price: product.product.price,
          quantity: product.quantity,
        });
      }

      const newBillItem = await billModel.create({
        user: cart.user,
        code: crypto.randomBytes(4).toString("hex"),
        date: new Date(),
        products: productsToBill,
        total: billTotal,
      });

      return newBillItem;
    } catch ({ message }) {
      throw new ClientError(`Creating bill failed, message: ${message}`);
    }
  }

  getBillById = async (id) => {
    try {
      const bill = await billModel.findOne({ _id: id }).populate(["products.product", RoleType.USER]);
      return bill;
    } catch ({ message }) {
      throw new ClientError("billing dao", ErrorCode.BILL_MISSING);
    }
  };
}
