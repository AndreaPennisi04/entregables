import express from "express";

const productRouter = express.Router();

// Get products
productRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await req.productManager.getProducts(limit);
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
  const product = await req.productManager.getProductById(productId);
  if (!product) {
    res.status(404).json({ error: "Product doesn't exist" });
    return;
  } else {
    res.json(product);
  }
});

//Post
productRouter.post("/", async (req, res) => {
  const { body, io } = req;
  const newProduct = await req.productManager.addProduct(body);
  if (newProduct === false) {
    res.status(400);
    res.json({ error: "Something went wrong" });
    return;
  }

  const products = await req.productManager.getProducts();
  io.emit("newProductsList", products);
  io.emit("newProductMessage", "New product arrived!!");

  res.status(200).json(newProduct);
});

//Put
productRouter.put("/products/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const { title, description, price, thumbnail, code, stock } = req.body;
    const updatedProduct = await req.productManager.updateProduct(productId, {
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
productRouter.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const deletedProduct = await req.productManager.removeProduct(productId);
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
