import { promises as fs } from "fs";
import ProductManager from "./ProductManager.js";
import { getLogger } from "./utils/logger.js";

export default class CartManager {
  logger;

  constructor(cartDbPath, productDbPath) {
    this.cartDbPath = cartDbPath;
    this.productManager = new ProductManager(productDbPath);
    this.cart = [];
    this.logger = getLogger();
  }

  _writecartToFile = async (cart) => {
    await fs.writeFile(this.cartDbPath, JSON.stringify(cart, null, "\t"), "utf-8");
  };

  async addCartItem() {
    const currentCart = await this.getCart();

    let cartId = 1;

    if (currentCart.length != 0) {
      cartId = currentCart[currentCart.length - 1].id + 1;
    }
    const newCartItem = { id: cartId, products: [] };

    currentCart.push(newCartItem);

    try {
      await this._writecartToFile(currentCart);
    } catch (error) {
      this.logger.error(`Error reading file: ${this.cartDbPath} - ${error.message}`);
      return false;
    }

    return { cartId };
  }

  //Get Cart
  getCart = async (limit) => {
    let cartFromFile = [];
    try {
      const fileContent = await fs.readFile(this.cartDbPath, "utf-8");
      cartFromFile = JSON.parse(fileContent);
      if (limit) {
        cartFromFile = cartFromFile.slice(0, parseInt(limit));
      }
    } catch (error) {
      this.logger.error(`Error reading file: ${this.cartDbPath} - ${error.message}`);
    }
    return cartFromFile;
  };

  getCartById = async (id) => {
    const cart = await this.getCart();
    return cart.find((cartItem) => cartItem.id === parseInt(id));
  };

  // Add product to cart
  async addProductToCart(cartId, productId) {
    if (!cartId || !productId) {
      this.logger.error("Need productId and cartId");
      return false;
    }

    const cid = Number(cartId);
    const pid = Number(productId);

    const product = await this.productManager.getProductById(pid);
    if (!product) {
      this.logger.error("The product you are trying to update does not exist");
      return false;
    }

    const updateArray = await this.getCart();
    const indexOfCartItemToUpdate = updateArray.findIndex((p) => p.id === cid);

    if (indexOfCartItemToUpdate < 0) {
      this.logger.error(`The cart you are looking for does not exist`);
      return;
    }

    const indexOfProductInCart = updateArray[indexOfCartItemToUpdate].products.findIndex((p) => p.productId === pid);

    if (indexOfProductInCart < 0) {
      updateArray[indexOfCartItemToUpdate].products.push({
        productId: pid,
        quantity: 1,
      });
    } else {
      updateArray[indexOfCartItemToUpdate].products[indexOfProductInCart].quantity =
        updateArray[indexOfCartItemToUpdate].products[indexOfProductInCart].quantity + 1;
    }

    try {
      await this._writecartToFile(updateArray);
    } catch (error) {
      this.logger.error(`Error writing file: ${this.cartDbPath} - ${error.message}`);
    }

    return updateArray[indexOfCartItemToUpdate];
  }
}
