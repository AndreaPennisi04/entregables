import express from "express";
import CartManager from "./CartManager.js";

const cartRouter = express.Router();
const cm = new CartManager("./files/carts.json", "./files/products.json");

cartRouter.get("/", async (req, res) => {
  const cartItems = await cm.getCart();
  if (!cartItems) {
    res.status(404).json({ error: "there was an issue" });
    return;
  } else {
    res.json(cartItems);
  }
});

cartRouter.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cartItems = await cm.getCartById(cartId);

  if (!cartItems) {
    res.status(404).json({ error: "Product doesn't exist" });
    return;
  } else {
    res.json(cartItems);
  }
});

//Post to create a new cart
cartRouter.post("/", async (req, res) => {
  const { body } = req;
  const newCartItem = await cm.addCartItem(body);
  if (newCartItem === false) {
    res.status(400);
    res.json({ error: "Something went wrong" });
    return;
  }
  res.status(200).json(newCartItem);
});

//Post to add a product to the cart
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  const result = await cm.addProductToCart(cartId, productId);
  if (!result) {
    res.status(404);
    res.json({ error: "Something went wrong" });
    return;
  }
  res.status(200).json(result);
});

export default cartRouter;
