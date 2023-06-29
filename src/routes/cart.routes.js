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
        const cart = await this.cartManager.getCart();
        res.status(200).send({ status: "success", payload: cart });
      } catch ({ message }) {
        res.status(500).send({ status: "error", payload: message });
      }
      return;
    });

    //Get cart by ID
    this.router.get(`${this.path}/:cid`, async (req, res) => {
      try {
        const cartId = req.params.cid;
        const cartItems = await this.cartManager.getCartById(cartId);
        res.status(200).send({ status: "success", payload: cartItems });
      } catch ({ message }) {
        res.status(500).send({ status: "error", payload: message });
      }
    });

    //Post to create a new cart
    this.router.post(`${this.path}`, async (req, res) => {
      try {
        const { io } = req;
        const newCart = await this.cartManager.createCart();

        io.emit("newCartList", newCart);
        io.emit("newCartMessage", "New cart!!");

        res.status(200).send({ status: "success", payload: newCart });
      } catch ({ message }) {
        res.status(500).send({ status: "error", payload: message });
      }
    });

    //Post to add a product to the cart
    this.router.post(`${this.path}/:cid/product/:pid`, async (req, res) => {
      try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await this.cartManager.addProductToCart(cartId, productId);
        res.status(200).send({ status: "success", payload: cart });
      } catch ({ message }) {
        res.status(500).send({ status: "error", payload: message });
      }
    });

    //Put to add multiple products to the cart
    this.router.put(`${this.path}/:cid`, async (req, res) => {
      try {
        const cartId = req.params.cid;
        const products = req.body.products;

        const cart = await this.cartManager.addMultipleProductsToCart(cartId, products);

        res.status(200).send({ status: "success", payload: cart });
      } catch ({ message }) {
        res.status(500).send({ status: "error", payload: message });
      }
    });

    //Put to modify quantity of a product in a cart
    this.router.put(`${this.path}/:cid/product/:pid`, async (req, res) => {
      try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        const cart = await this.cartManager.setProductQuantity(cartId, productId, quantity);
        res.status(200).send({ status: "success", payload: cart });
      } catch ({ message }) {
        res.status(500).send({ status: "error", payload: message });
      }
    });

    // deletes one product from the cart
    this.router.delete(`${this.path}/:cid/product/:pid`, async (req, res) => {
      try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await this.cartManager.deleteProduct(cartId, productId);
        res.status(200).send({ status: "success", payload: cart });
      } catch ({ message }) {
        res.status(500).send({ status: "error", payload: message });
      }
    });

    // deletes all products from the cart
    this.router.delete(`${this.path}/:cid`, async (req, res) => {
      try {
        const cartId = req.params.cid;
        const cart = await this.cartManager.deleteAllProducts(cartId);
        res.status(200).send({ status: "success", payload: cart });
      } catch ({ message }) {
        res.status(500).send({ status: "error", payload: message });
      }
    });
  }
}
