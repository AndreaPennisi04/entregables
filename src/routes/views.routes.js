import { Router } from "express";
import ProductManagerDao from "../dao/managers/productManager.managers.js";
import CartManagerDao from "../dao/managers/cartManager.managers.js";
import { authorization } from "../middleware/authorization.middleware.js";
import { passportCall } from "../utils/jwt.js";
import BillManagerDao from "../dao/managers/billManager.managers.js";

export default class ViewsRouter {
  path = "/views";
  router = Router();
  productManager = new ProductManagerDao();
  cartManager = new CartManagerDao();
  billManager = new BillManagerDao();

  constructor() {
    this.initViewsRoutes();
  }

  initViewsRoutes() {
    this.router.get(`${this.path}`, (req, res) => {
      res.render("index", { style: "index.css" });
    });

    this.router.get(`${this.path}/home`, async (req, res) => {
      const products = await this.productManager.getAllProducts();
      res.render("home", { products, style: "home.css" });
    });

    this.router.get(`${this.path}/products/:pn`, [passportCall("jwt"), authorization("USER")], async (req, res) => {
      const pageNumber = req.params.pn;
      const data = await this.productManager.getAllProducts(undefined, pageNumber, undefined, undefined, req.baseUrl);
      res.render("products", { data, style: "products.css" });
    });

    this.router.get(`${this.path}/bill/:id`, [passportCall("jwt"), authorization("USER")], async (req, res) => {
      const billId = req.params.id;
      const data = await this.billManager.getBillById(billId);
      res.render("bill", { data, style: "bill.css" });
    });

    this.router.get(`${this.path}/cart`, [passportCall("jwt"), authorization("USER")], async (req, res) => {
      res.render("cart", { style: "products.css" });
    });

    this.router.get(`${this.path}/realtimeproducts`, async (req, res) => {
      const products = await this.productManager.getAllProducts();
      res.render("realTimeProducts", { products, style: "home.css" });
    });

    this.router.get("/login", async (req, res) => {
      res.render("login", { style: "login.css" });
    });

    this.router.get("/register", async (req, res) => {
      res.render("register");
    });

    this.router.get("/recover", async (req, res) => {
      res.render("recover", { style: "recover.css" });
    });

    this.router.get("/profile", [passportCall("jwt"), authorization("USER")], async (req, res) => {
      const user = req.session.user;
      res.render("profile", {
        user,
        cart: {
          cartId: "_id",
        },
      });
    });
  }
}
