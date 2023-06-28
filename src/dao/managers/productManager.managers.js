import { productModel } from "../models/productManager.models.js";

export default class ProductManagerDao {
  getAllProducts = async (limit = 10, page = 1, sort, query) => {
    try {
      const products = await productModel.paginate(JSON.parse(query) || {}, {
        limit,
        page,
        sort: sort && { price: sort },
      });
      return products;
    } catch (error) {
      console.log("🚀 ~ file: productManager.managers.js:8 ~ ProductManagerDao ~ getAllProducts= ~ error:", error);
    }
  };

  getProductById = async (id) => {
    try {
      const product = await productModel.findOne({ _id: id });
      return product;
    } catch (error) {
      console.log("🚀 ~ file: productManager.managers.js:18 ~ ProductManagerDao ~ getProductById= ~ error:", error);
    }
  };

  removeProduct = async (id) => {
    try {
      await productModel.deleteOne({ _id: id });
    } catch (error) {
      console.log("🚀 ~ file: productManager.managers.js:27 ~ ProductManagerDao ~ removeProduct= ~ error:", error);
    }
  };

  async addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      console.error("Data missing. All data is required");
    }

    try {
      const newCar = await productModel.create(product);
      return newCar;
    } catch (error) {
      console.log("🚀 ~ file: productManager.managers.js:46 ~ ProductManagerDao ~ addProduct ~ error:", error);
    }
  }

  async updateProduct(idToUpdate, productToUpdate) {
    try {
      const product = await productModel.updateOne({ _id: idToUpdate }, productToUpdate);
      return product;
    } catch (error) {
      console.log("🚀 ~ file: productManager.managers.js:57 ~ ProductManagerDao ~ updateProduct ~ error:", error);
    }
  }
}
