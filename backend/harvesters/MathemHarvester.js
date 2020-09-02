const StoreHarvester = require("./StoreHarvester");
const fetch = require("node-fetch");

module.exports = class MathemHarvester extends StoreHarvester {
  constructor(categoriesTranslation, size = 1000) {
    // if (this.constructor === AxfoodHarvester) {
    //   throw new Error("You can not create an instance of StoreHarvester");
    // }
    super(categoriesTranslation, (size = 1000));
  }
  /*
  static bustCache() {
    return "?avoidCache=" + (Math.random() + "").split(".")[1];
  }
  */

  static async getCategories() {
    let raw = await fetch(
      "https://api.mathem.io/ecom-navigation/noauth/v2/menu/10"
    );
    //let mycategories = raw["categories"];
    return await raw.json();
  }

  static async getCleanCategories() {

    let mycategories = await this.getCategories();

    let categories = await mycategories["categories"];

    /*

    await categories.array.forEach(element => { 

        console.log(element.id, element.productCount)
        
    });
    */

    //console.log(categories)

    return categories;

  }

  static async getProductsPerCategory() {

    
    //https://api.mathem.io/product-search/noauth/search/products/10/categorytag/frukt-o-gront?size=535&storeId=10&searchType=category

    let raw = await fetch("https://api.mathem.io/product-search/noauth/search/products/10/categorytag/frukt-o-gront?size=20&storeId=10&searchType=category");

    //console.log(raw.products);

    return (await raw.json()).products;
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
