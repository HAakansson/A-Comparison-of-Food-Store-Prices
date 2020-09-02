const StoreHarvester = require("./StoreHarvester");
const fetch = require("node-fetch");

module.exports = class AxfoodHarvester extends StoreHarvester {
  constructor(categoriesTranslation, size = 1000) {
    // if (this.constructor === AxfoodHarvester) {
    //   throw new Error("You can not create an instance of StoreHarvester");
    // }
    super(categoriesTranslation, (size = 1000));
  }

  static bustCache() {
    return "?avoidCache=" + (Math.random() + "").split(".")[1];
  }

  static async getCategories() {
    let raw = await fetch(
      "https://www.willys.se/leftMenu/categorytree" + this.bustCache()
    );
    return await raw.json();
  }

  static async getProducts(categoryURL) {
    let raw = await fetch(
      "https://www.willys.se/c/" +
        categoryURL +
        this.bustCache() +
        "&size=10000"
    );
    return (await raw.json()).results;
  }

  static async getAllProducts() {
    // NOT WRITTEN YET!
    let categories = await this.getCategories();
    // now loop basic categories and getProducts for each category...
    // how would you write this?
  }
};
