import { ClientError } from "../../utils/ClientError.js";
import { ErrorCode } from "../../utils/ErrorCode.js";
import { cartModel } from "../models/cartModel.models.js";

export default class CartManagerDao {
  async createCart(userId) {
    try {
      const newCartItem = await cartModel.create({ user: userId });
      return newCartItem;
    } catch (error) {
      throw new ClientError("CartManagerDao.createCart", ErrorCode.DB_ISSUE);
    }
  }

  getCart = async (userId) => {
    try {
      const carts = await cartModel.find({ user: userId }).populate("products.product");
      return carts;
    } catch (error) {
      throw new ClientError("CartManagerDao.createCart", ErrorCode.DB_ISSUE);
    }
  };

  getCartById = async (id) => {
    try {
      const cart = await cartModel.findOne({ _id: id }).populate("products.product");
      return cart;
    } catch (error) {
      throw new ClientError("CartManagerDao.getCartById", ErrorCode.DB_ISSUE);
    }
  };

  // Delete product from cart

  async deleteProduct(cartId, productId) {
    try {
      if (!cartId || !productId) {
        throw new ClientError(
          "CartManagerDao.deleteProduct",
          ErrorCode.BAD_PARAMETERS,
          400,
          "BAD PARAM",
          "missing cartId or ProductId"
        );
      }

      const result = await cartModel.updateOne({ _id: cartId }, { $pull: { products: { product: productId } } });
      if (result.modifiedCount === 0) {
        throw new ClientError(
          "CartManagerDao.deleteProduct",
          ErrorCode.BAD_PARAMETERS,
          400,
          "BAD PARAM",
          "Product was not in the cart"
        );
      }

      const cart = this.getCartById(cartId);

      return cart;
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new ClientError("CartManagerDao.deleteProduct", ErrorCode.DB_ISSUE);
    }
  }

  // Add multiple products to cart
  async addMultipleProductsToCart(cartId, products) {
    try {
      if (!products || !products.push) {
        throw new ClientError(
          "CartManagerDao.addMultipleProductsToCart",
          ErrorCode.BAD_PARAMETERS,
          400,
          "BAD PARAM",
          "product is required and products should be an array"
        );
      }

      for (const product of products) {
        await this.addProductToCart(cartId, product);
      }
      const cart = this.getCartById(cartId);
      return cart;
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new ClientError("CartManagerDao.addMultipleProductsToCart", ErrorCode.DB_ISSUE);
    }
  }

  // deletes all products from the cart
  async deleteAllProducts(cartId) {
    try {
      const result = await cartModel.updateOne({ _id: cartId }, { products: [] });
      if (result.modifiedCount === 0) {
        throw new ClientError("CartManagerDao.deleteAllProducts", ErrorCode.CART_MISSING);
      }

      return await this.getCartById(cartId);
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new ClientError("CartManagerDao.deleteAllProducts", ErrorCode.DB_ISSUE);
    }
  }

  // Add multiple products to cart
  async setProductQuantity(cartId, productId, quantityRaw) {
    try {
      const quantity = parseInt(quantityRaw);
      if (!quantity && isNaN(quantity)) {
        throw new ClientError(
          "CartManagerDao.setProductQuantity",
          ErrorCode.BAD_PARAMETERS,
          400,
          "BAD PARAM",
          "Quantity is required and needs to be a valid integer"
        );
      }

      const result = await cartModel.updateOne(
        { _id: cartId },
        { $set: { "products.$[product].quantity": quantity } },
        { arrayFilters: [{ "product.product": productId }] }
      );
      if (result.modifiedCount === 0) {
        throw new ClientError("CartManagerDao.setProductQuantity", ErrorCode.DB_ISSUE);
      }
      return await this.getCartById(cartId);
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new ClientError("CartManagerDao.setProductQuantity", ErrorCode.DB_ISSUE);
    }
  }

  removeCart = async (id) => {
    try {
      await cartModel.deleteOne({ _id: id });
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new ClientError("CartManagerDao.removeCart", ErrorCode.DB_ISSUE);
    }
  };

  // Add product to cart
  async addProductToCart(cartId, productId) {
    try {
      if (!cartId || !productId) {
        throw new ClientError(
          "CartManagerDao.addProductToCart",
          ErrorCode.BAD_PARAMETERS,
          400,
          "BAD PARAM",
          "cartId and productId are required"
        );
      }

      let result = await cartModel.updateOne(
        { _id: cartId, "products.product": productId },
        { $inc: { "products.$.quantity": 1 } }
      );
      if (result.modifiedCount === 0) {
        result = await cartModel.updateOne({ _id: cartId }, { $push: { products: { product: productId } } });
      }
      if (result.modifiedCount === 0) {
        throw new ClientError("CartManagerDao.setProductQuantity", ErrorCode.DB_ISSUE);
      }

      const cart = this.getCartById(cartId);
      return cart;
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new ClientError("CartManagerDao.addProductToCart", ErrorCode.DB_ISSUE);
    }
  }
}
