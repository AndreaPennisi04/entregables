import { productModel } from "../models/productManager.models.js";

export default class ProductManagerDao {
  getAllProducts = async (limit = 10, page = 1, sort, query, baseUrl) => {
    try {
      const products = await productModel.paginate(query && JSON.parse(query), {
        limit,
        page,
        sort: sort && { price: sort },
        customLabels: { docs: "payload" },
      });
      return {
        ...products,
        prevLink: products.prevPage && `${baseUrl}/views/products/${products.prevPage}`,
        nextLink: products.nextPage && `${baseUrl}/views/products/${products.nextPage}`,
      };
    } catch (error) {
      console.error("🚀 ~ file: productManager.managers.js:8 ~ ProductManagerDao ~ getAllProducts= ~ error:", error);
      throw new Error(
        "Error parsing parameters, sort can only be asc/desc, limit: can only be a number, page: can only be a number, query: has to be a valid JSON compliant with MongoDB query"
      );
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
