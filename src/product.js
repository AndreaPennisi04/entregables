import express from "express";
import ProductManager from "./ProductManager.js";

const productRouter = express.Router();

const pm = new ProductManager("./files/products.json");

// Get products
productRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await pm.getProducts(limit);
    res.status(200);
    res.send(products);
    return;
  } catch (error) {
    res.status(500);
    res.send(error);
  }
  return;
});

//Get product by ID
productRouter.get("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const product = await pm.getProductById(productId);
  if (!product) {
    res.status(404).json({ error: "Product doesn't exist" });
    return;
  } else {
    res.json(product);
  }
});

//Post
productRouter.post("/", async (req, res) => {
  const { body } = req;
  const newProduct = await pm.addProduct(body);
  if (newProduct === false) {
    res.status(400);
    res.json({ error: "Something went wrong" });
    return;
  }
  res.status(200).json(newProduct);
});

//Put
productRouter.put("/products/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const { title, description, price, thumbnail, code, stock } = req.body;
    const updatedProduct = await pm.updateProduct(productId, { title, description, price, thumbnail, code, stock });
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
productRouter.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const deletedProduct = await pm.removeProduct(productId);
    if (!deletedProduct) {
      res.status(404).json({ error: "Could not delete the product" });
      return;
    } else {
      res.json({ message: "Success!!" });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: "Error when attempting to remove the product." });
    res.send(error);
  }
});

export default productRouter;
