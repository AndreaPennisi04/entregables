import { promises as fs } from "fs";
import { getLogger } from "./utils/logger.js";

export default class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.logger = getLogger();
  }

  _writeProductsToFile = async (products) => {
    await fs.writeFile(this.path, JSON.stringify(products, null, "\t"), "utf-8");
  };

  async addProduct(product) {
    const currentProducts = await this.getProducts();

    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      this.logger.error("Data missing. All data is required");
      return false;
    }

    if (currentProducts.some((p) => p.code === product.code)) {
      this.logger.warning(`A product with the code: ${product.code} already exists`);
      return false;
    }

    let productId = 1;

    if (currentProducts.length != 0) {
      productId = currentProducts[currentProducts.length - 1].id + 1;
    }
    const newCar = { ...product, id: productId };

    currentProducts.push(newCar);

    try {
      await this._writeProductsToFile(currentProducts);
    } catch (error) {
      this.logger.error(`Error reading file: ${this.path} - ${error.message}`);
      return false;
    }

    return newCar;
  }

  getProducts = async (limit) => {
    let productsFromFile = [];
    try {
      const fileContent = await fs.readFile(this.path, "utf-8");
      productsFromFile = JSON.parse(fileContent);
      if (limit) {
        productsFromFile = productsFromFile.slice(0, parseInt(limit));
      }
    } catch (error) {
      this.logger.error(`Error reading file: ${this.path} - ${error.message}`);
    }
    return productsFromFile;
  };

  getProductById = async (id) => {
    const products = await this.getProducts();
    return products.find((product) => product.id === parseInt(id));
  };

  async updateProduct(idToUpdate, updateProduct) {
    const updateArray = await this.getProducts();
    const id = Number(idToUpdate);
    const indexOfProductToUpdate = updateArray.findIndex((p) => p.id === id);

    if (indexOfProductToUpdate < 0) {
      this.logger.error(`Can't find the product you are trying to update: id: ${id}`);
      return;
    }

    updateArray[indexOfProductToUpdate] = { id, ...updateProduct };

    try {
      await this._writeProductsToFile(updateArray);
    } catch (error) {
      this.logger.error(`Error writing file: ${this.path} - ${error.message}`);
    }

    return updateProduct;
  }

  removeProduct = async (idToDelete) => {
    const id = Number(idToDelete);
    const arrayToUpdate = await this.getProducts();
    const indexOfProductToDelete = arrayToUpdate.findIndex((p) => p.id === id);

    if (indexOfProductToDelete < 0) {
      this.logger.error(`Can't find the product you are trying to delete: id: ${id}`);
      return false;
    }

    arrayToUpdate.splice(indexOfProductToDelete, 1);

    try {
      await this._writeProductsToFile(arrayToUpdate);
    } catch (error) {
      this.logger.error(`Error writing file: ${this.path} - ${error.message}`);
      return false;
    }

    return true;
  };
}
