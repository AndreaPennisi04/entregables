import { cartModel } from "../models/cartManager.models.js";

export default class CartManagerDao {
  async createCart() {
    try {
      const newCartItem = await cartModel.create({});
      return newCartItem;
    } catch ({ message }) {
      throw new Error(`Creating cart failed, message: ${message}`);
    }
  }

  getCart = async () => {
    try {
      const carts = await cartModel.find({}).populate("products.product");
      return carts;
    } catch ({ message }) {
      throw new Error(`Get cart failed, message: ${message}`);
    }
  };

  getCartById = async (id) => {
    try {
      const cart = await cartModel.findOne({ _id: id }).populate("products.product");
      return cart;
    } catch ({ message }) {
      throw new Error(`Get cart by id failed, message: ${message}`);
    }
  };

  // Delete product from cart

  async deleteProduct(cartId, productId) {
    if (!cartId || !productId) {
      throw new Error("Need productId and cartId");
    }

    try {
      const result = await cartModel.updateOne({ _id: cartId }, { $pull: { products: { product: productId } } });
      if (result.modifiedCount === 0) {
        throw new Error("Product was not in the cart");
      }

      const cart = this.getCartById(cartId);

      return cart;
    } catch ({ message }) {
      throw new Error(`Delete product from cart failed, message: ${message}`);
    }
  }

  // Add multiple products to cart
  async addMultipleProductsToCart(cartId, products) {
    if (!products || !products.push) {
      throw new Error("Product field is required and should be an array of product Ids");
    }

    try {
      for (const product of products) {
        await this.addProductToCart(cartId, product);
      }
      const cart = this.getCartById(cartId);
      return cart;
    } catch ({ message }) {
      throw new Error(`Add product to cart failed, message: ${message}`);
    }
  }

  // deletes all products from the cart
  async deleteAllProducts(cartId) {
    const result = await cartModel.updateOne({ _id: cartId }, { products: [] });
    if (result.modifiedCount === 0) {
      throw new Error("Could not find the cart");
    }

    return await this.getCartById(cartId);
  }

  // Add multiple products to cart
  async setProductQuantity(cartId, productId, quantityRaw) {
    const quantity = parseInt(quantityRaw);
    if (!quantity && isNaN(quantity)) {
      throw new Error("Quantity is required and needs to be a valid integer");
    }

    const result = await cartModel.updateOne(
      { _id: cartId },
      { $set: { "products.$[product].quantity": quantity } },
      { arrayFilters: [{ "product.product": productId }] }
    );
    if (result.modifiedCount === 0) {
      throw new Error("No update was made");
    }
    return await this.getCartById(cartId);
  }

  // Add product to cart
  async addProductToCart(cartId, productId) {
    if (!cartId || !productId) {
      console.error("Need productId and cartId");
      return false;
    }

    try {
      let result = await cartModel.updateOne(
        { _id: cartId, "products.product": productId },
        { $inc: { "products.$.quantity": 1 } }
      );
      if (result.modifiedCount === 0) {
        result = await cartModel.updateOne({ _id: cartId }, { $push: { products: { product: productId } } });
      }
      if (result.modifiedCount === 0) {
        throw new Error("Could not update the cart");
      }

      const cart = this.getCartById(cartId);
      return cart;
    } catch ({ message }) {
      throw new Error(`Add product to cart failed, message: ${message}`);
    }
  }
}
