module.exports = class StoreHarvester {
  constructor(categoriesTranslation, size = 1000) {
    if (this.constructor === StoreHarvester) {
      throw new Error("You can not create an instance of StoreHarvester");
    }
    this.categoriesTranslation = categoriesTranslation;
    this.size = size;
  }

  static async getAllProducts() {
    // throw new Error("You have to implement the method getAllProduts");
  }

  static async getCategories() {
    // throw new Error("You have to implement the method getCategories");
  }

  static async getProduct() {
    // throw new Error("You have to implement the method getProduct");
  }
};
