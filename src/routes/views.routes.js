import { Router } from "express";
import ProductManagerDao from "../dao/managers/productManager.managers.js";
import CartManagerDao from "../dao/managers/cartManager.managers.js";

export default class ViewsRouter {
  path = "/views";
  router = Router();
  productManager = new ProductManagerDao();
  cartManager = new CartManagerDao();

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

    this.router.get(`${this.path}/realtimeproducts`, async (req, res) => {
      const products = await this.productManager.getAllProducts();
      res.render("realTimeProducts", { products, style: "home.css" });
    });
  }
}
