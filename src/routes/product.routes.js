import { Router } from "express";
import ProductManagerDao from "../dao/managers/productManager.managers.js";
import { authorization } from "../middleware/authorization.middleware.js";
import { passportCall } from "../utils/jwt.js";

export default class ProductRouter {
  path = "/product";
  router = Router();
  productManager = new ProductManagerDao();

  constructor() {
    this.initProductRoutes();
  }

  initProductRoutes() {
    // Get products
    this.router.get(`${this.path}`, [passportCall("jwt"), authorization(["ADMIN", "USER"])], async (req, res) => {
      try {
        const { limit, page, sort, query } = req.query;
        const products = await this.productManager.getAllProducts(limit, page, sort, query, req.baseUrl);
        res.status(200);
        res.send({
          ...products,
          status: "success",
        });
        return;
      } catch ({ message }) {
        res.status(500).send({ status: "error", payload: message });
        return;
      }
    });

    //Get product by ID
    this.router.get(`${this.path}/:pid`, [passportCall("jwt"), authorization(["ADMIN", "USER"])], async (req, res) => {
      const productId = req.params.pid;
      const product = await this.productManager.getProductById(productId);
      if (!product) {
        res.status(404).json({ error: "Product doesn't exist" });
        return;
      } else {
        res.json(product);
      }
    });

    // Mocking products endpoint
    this.router.get(`/mockingproducts`, async (req, res) => {
      try {
        const { limit, page, sort, query } = req.query;
        const products = await this.productManager.getAllFakeProducts(limit, page, sort, query, req.baseUrl);
        res.status(200);
        res.send({
          ...products,
          status: "success",
        });
        return;
      } catch ({ message }) {
        res.status(500).send({ status: "error", payload: message });
        return;
      }
    });

    //Post
    this.router.post(`${this.path}`, [passportCall("jwt"), authorization(["ADMIN"])], async (req, res) => {
      const { body, io } = req;
      const newProduct = await this.productManager.addProduct(body);
      if (newProduct === false) {
        res.status(400);
        res.json({ error: "Something went wrong" });
        return;
      }

      const products = await this.productManager.getAllProducts();
      io.emit("newProductsList", products);
      io.emit("newProductMessage", "New product arrived!!");

      res.status(200).json(newProduct);
    });

    //Post
    this.router.post(
      `${this.path}/:pid/stock/:quantity`,
      [passportCall("jwt"), authorization(["ADMIN", "USER"])],
      async (req, res) => {
        const productId = req.params.pid;
        const quantity = req.params.quantity;

        await this.productManager.changeStockForProduct(productId, quantity);
        const products = await this.productManager.getAllProducts();
        res.status(200).json(products);
      }
    );

    //Put
    this.router.put(`${this.path}/:pid`, [passportCall("jwt"), authorization(["ADMIN"])], async (req, res) => {
      try {
        const productId = req.params.pid;
        const { title, description, price, thumbnail, code, stock } = req.body;
        const updatedProduct = await this.productManager.updateProduct(productId, {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        });
        if (!updatedProduct) {
          res.status(404).json({ error: "Product couldn't be updated" });
        } else {
          res.json({ product: updatedProduct });
        }
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        res.send(error);
      }
    });

    //Delete
    this.router.delete(`${this.path}/:pid`, [passportCall("jwt"), authorization(["ADMIN"])], async (req, res) => {
      try {
        const productId = req.params.pid;
        await this.productManager.removeProduct(productId);
        res.status(204);
        res.send();
      } catch (error) {
        res.status(500).json({ error: "Error when attempting to remove the product." });
        res.send(error);
      }
    });
  }
}
