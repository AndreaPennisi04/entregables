import { Router } from "express";
import CartManagerDao from "../dao/managers/cartManager.managers.js";

export default class CartRouter {
  path = "/cart";
  router = Router();
  cartManager = new CartManagerDao();

  constructor() {
    this.initCartRoutes();
  }

  initCartRoutes() {
    //Get cart
    this.router.get(`${this.path}`, async (req, res) => {
      try {
        const { limit } = req.query;
        const cart = await this.cartManager.getProducts(limit);
        res.status(200);
        res.send(cart);
      } catch (error) {
        res.status(500);
        res.send(error);
      }
      return;
    });

    //Get cart by ID
    this.router.get(`${this.path}/:cid`, async (req, res) => {
      const cartId = req.params.cid;
      const cartItems = await this.cartManager.getCartById(cartId);
      if (!cartItems) {
        res.status(404).json({ error: "Cart doesn't exist" });
        return;
      } else {
        res.json(cartItems);
      }
    });

    //Post to create a new cart
    this.router.post(`${this.path}`, async (req, res) => {
      const { io } = req;
      const newCart = await this.cartManager.createCart();

      io.emit("newCartList", newCart);
      io.emit("newCartMessage", "New cart!!");

      res.status(200).json(newCart);
    });

    //Post to add a product to the cart
    this.router.post(`${this.path}/:cid/product/:pid`, async (req, res) => {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const currentCart = await this.cartManager.addProductToCart(cartId, productId);
      if (!currentCart) {
        res.status(400);
        res.json({ error: "Something went wrong" });
        return;
      }
      res.status(200).json(currentCart);
    });
  }
}
