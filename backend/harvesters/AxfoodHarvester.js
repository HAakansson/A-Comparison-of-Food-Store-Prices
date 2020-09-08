const StoreHarvester = require("./StoreHarvester");
const fetch = require("node-fetch");
const DataBaseHelper = require("../DataBaseHelper");

module.exports = class AxfoodHarvester extends StoreHarvester {
  constructor(store) {
    super();
    this.store = store;
  }
  bustCache() {
    return "?avoidCache=" + (Math.random() + "").split(".")[1];
  }

  async getCategories() {
    console.log(`Harvesting categories from ${this.store} started...`);
    let data = await fetch(
      `https://${this.store}/leftMenu/categorytree${this.bustCache()}`
    );
    data = await data.json();
    let categoriesArrayForTheDB = []; // Cointains ALL the categories that goes in to the DB.
    let categoriesArrayForGetProducts = []; /* Only containts the top layer of categories that is going to be used to get all the products. */
    categoriesArrayForTheDB.push({
      name: data.title,
      url: "Unknown",
      store: this.store.split(".")[1],
      categoryCode: data.id,
    });
    data.children.forEach((c) => {
      categoriesArrayForTheDB.push({
        name: c.title,
        url: c.url,
        store: this.store.split(".")[1],
        categoryCode: c.id,
      });
      categoriesArrayForGetProducts.push(c.url);
      c.children.forEach((cc) => {
        categoriesArrayForTheDB.push({
          name: cc.title,
          url: cc.url,
          store: this.store.split(".")[1],
          categoryCode: cc.id,
        });
        if (cc.children.length > 0) {
          cc.children.forEach((ccc) => {
            categoriesArrayForTheDB.push({
              name: ccc.title,
              url: ccc.url,
              store: this.store.split(".")[1],
              categoryCode: ccc.id,
            });
          });
        }
      });
    });
    console.log("Harvesting done, adding to database started...");
    for (let obj of categoriesArrayForTheDB) {
      if (await DataBaseHelper.checkIfCategoryExists(obj)) {
        continue;
      }
      await DataBaseHelper.insertCategoryToDB(obj);
    }
    return categoriesArrayForGetProducts;
  }

  async getProducts(categoryURL) {
    let raw = await fetch(
      `https://${this.store}/c/${categoryURL}${this.bustCache()}&size=1000`
    );
    return (await raw.json()).results;
  }

  async getAllProducts(categoriesArray) {
    console.log(`Harvesting products from ${this.store} started...`);
    let allProducts = [];
    for (let categoryURL of categoriesArray) {
      let products = await this.getProducts(categoryURL);
      allProducts.push(...products);
    }
    return allProducts;
  }
};
