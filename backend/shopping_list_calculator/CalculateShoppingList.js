const path = require("path");
const DB = require("../DB");
const dbPath = path.join(__dirname, "../databases/foodStore.db");
const db = new DB(dbPath);

module.exports = class CalculateShoppingList {
  static storeArray = ["willys", "hemkop", "mathem"];

  static async calculateTotalCost(shoppingList) {
    let list = JSON.parse(shoppingList);
    let storeComparisonArray = []

    for (let store of this.storeArray) {
      let storeObject = {
        name: store,
        sum: null,
        products: []
      }
      for (let item of list) {
        let productString = `WHERE name LIKE "%${item.product}%"`;
        let brandString = item.brand ? `AND brand = "${item.brand}"` : "";
        let unit = item.unit ? `AND unit_measurement = "${item.unit}"` : "";
        let storeString = `AND store = "${store}"`;

        let results = await db.all(/*sql*/ `
          SELECT name, brand, unit_price, comparison_price, discount_comparison_price, discount_price, discount_quantity, store, display_volume, unit_measurement
          FROM Product
          ${productString}
          ${brandString}
          ${unit}
          ${storeString}
          ORDER BY unit_price`);
        
        storeObject.products.push(results[0]);
      }
      storeComparisonArray.push(storeObject);
    }

    return storeComparisonArray;
  }
};
