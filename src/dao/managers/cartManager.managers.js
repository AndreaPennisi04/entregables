import { cartModel } from "../models/cartManager.models.js";
import ProductManagerDao from "./productManager.managers.js";

export default class CartManagerDao {
  async createCart() {
    try {
      const newCartItem = await cartModel.create({ products: [] });
      return newCartItem;
    } catch (error) {
      console.log("🚀 ~ file: cartManager.managers.js:8 ~ CartManagerDao ~ error:", error);
    }
  }

  getCart = async (limit = "20") => {
    try {
      const carts = await cartModel.find({}).limit(parseInt(limit));
      return carts;
    } catch (error) {
      console.log("🚀 ~ file: cartManager.managers.js:19 ~ CartManagerDao ~ getCart= ~ error:", error);
    }
  };

  getCartById = async (id) => {
    try {
      const cart = await cartModel.findOne({ _id: id });
      return cart;
    } catch (error) {
      console.log("🚀 ~ file: cartManager.managers.js:28 ~ CartManagerDao ~ getCartById= ~ error:", error);
    }
  };

  // Add product to cart
  async addProductToCart(cartId, productId) {
    if (!cartId || !productId) {
      console.error("Need productId and cartId");
      return false;
    }

    const pm = new ProductManagerDao();

    const product = await pm.getProductById(productId);
    if (!product) {
      console.error("The product you are trying to update does not exist");
      return false;
    }

    const currentCart = await this.getCartById(cartId);
    console.log(
      "🚀 ~ file: cartManager.managers.js:48 ~ CartManagerDao ~ addProductToCart ~ currentCart:",
      currentCart
    );

    const indexOfProductInCart = currentCart.products.findIndex((p) => p.productId === productId);

    if (indexOfProductInCart < 0) {
      currentCart.products.push({
        productId: productId,
        quantity: 1,
      });
    } else {
      currentCart.products[indexOfProductInCart].quantity = currentCart.products[indexOfProductInCart].quantity + 1;
    }

    try {
      await cartModel.updateOne({ _id: cartId }, currentCart);
    } catch (error) {
      console.log("🚀 ~ file: cartManager.managers.js:63 ~ CartManagerDao ~ addProductToCart ~ error:", error);
    }

    return currentCart;
  }
}
