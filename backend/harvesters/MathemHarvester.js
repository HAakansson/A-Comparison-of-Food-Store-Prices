const StoreHarvester = require("./StoreHarvester");
const DataBaseHelper = require("../DataBaseHelper");
const fetch = require("node-fetch");
const fs = require("fs");

module.exports = class MathemHarvester extends StoreHarvester {
  constructor() {
    super();
    this.store = "www.mathem.se";
  }

  async getCategories() {
    console.log(`Harvesting categories from ${this.store} started...`);
    let raw = await fetch(
      "https://api.mathem.io/ecom-navigation/noauth/v2/menu/10"
    );
    let data = await raw.json();
    let categories = data.categories;
    let categoriesArrayForTheDB = []; // Cointaints ALL the categorin to the DB.
    let categoriesArrayForGetProducts = []; // Only containts the top layer of ies that goes categories that is going to be used to get all the products.
    categories.forEach((c1) => {
      categoriesArrayForTheDB.push({
        name: c1.title,
        store: this.store.split(".")[1],
        url: c1.id,
        categoryCode: c1.id,
      });
      categoriesArrayForGetProducts.push({
        id: c1.id,
        count: c1.productCount,
      });
      c1.children.forEach((c2) => {
        categoriesArrayForTheDB.push({
          name: c2.title,
          store: this.store.split(".")[1],
          url: c2.id,
          categoryCode: c2.id,
        });
        if (c2.children.length > 0) {
          c2.children.forEach((c3) => {
            categoriesArrayForTheDB.push({
              name: c3.title,
              store: this.store.split(".")[1],
              url: c3.id,
              categoryCode: c3.id,
            });
          });
        }
      });
    });
    console.log(`Harvesting from ${this.store} done, adding to database started...`);
    for (let obj of categoriesArrayForTheDB) {
      if (await DataBaseHelper.checkIfCategoryExists(obj)) {
        continue;
      }
      await DataBaseHelper.insertCategoryToDB(obj);
    }
    return categoriesArrayForGetProducts;
  }

  async getProducts(id, number) {
    let raw = await fetch(
      `https://api.mathem.io/product-search/noauth/search/products/10/categorytag/${id}?size=${number}`
    );
    return (await raw.json()).products;
  }

  async getAllProducts(categoriesArrayForGetProducts) {
    console.log(`Harvesting products from ${this.store} started...`);
    let allProducts = [];
    for (let obj of categoriesArrayForGetProducts) {
      let products = await this.getProducts(obj.id, obj.count);
      allProducts.push(...products);
    }
    return allProducts;
  }
};
