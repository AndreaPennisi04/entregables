import { Router } from "express";
import ProductManagerDao from "../dao/managers/productManager.managers.js";

export default class ProductRouter {
  path = "/product";
  router = Router();
  productManager = new ProductManagerDao();

  constructor() {
    this.initProductRoutes();
  }

  initProductRoutes() {
    // Get products
    this.router.get(`${this.path}`, async (req, res) => {
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
    this.router.get(`${this.path}/:pid`, async (req, res) => {
      const productId = req.params.pid;
      const product = await this.productManager.getProductById(productId);
      if (!product) {
        res.status(404).json({ error: "Product doesn't exist" });
        return;
      } else {
        res.json(product);
      }
    });

    //Post
    this.router.post(`${this.path}`, async (req, res) => {
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

    //Put
    this.router.put(`${this.path}/:pid`, async (req, res) => {
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
    this.router.delete(`${this.path}/:pid`, async (req, res) => {
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
