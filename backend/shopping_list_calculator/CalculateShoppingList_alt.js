const path = require("path");
const DB = require("../DB");
const dbPath = path.join(__dirname, "../databases/foodStore.db");
const db = new DB(dbPath);

module.exports = class CalculateShoppingLis_alt {
  static storeArray = ["willys", "hemkop", "mathem"];
  static dbTries = 0;

  static async calculateTotalCost(shoppingList) {
    let list = JSON.parse(shoppingList);
    let storeComparisonArray = [];

    for (let store of this.storeArray) {
      let storeObject = {
        name: store,
        sum: 0,
        products: [],
      };
      for (let item of list) {
        let productString = `WHERE name LIKE "%${item.product}%"`;
        let brandString = item.brand ? `AND brand = "${item.brand}"` : "";
        let unit = item.unit ? `AND unit_measurement = "${item.unit}"` : "";
        let storeString = `AND store = "${store}"`;

        let results = await this.searchDBForProducts(
          item,
          productString,
          storeString,
          unit,
          brandString
        );

        let perfectMatches = this.findPerfectMatches(results);

        if (perfectMatches.length !== 0) {
          perfectMatches = this.sortAfterComparisonPrice(perfectMatches);
        } else {
          results = this.sortAfterComparisonPrice(results);
        }

        storeObject.products.push(
          perfectMatches.length > 0 ? perfectMatches[0] : results[0]
        );
      }
      storeObject.sum = storeObject.products.reduce((sum, product) => sum + product.unit_price, 0)
      storeComparisonArray.push(storeObject);
    }

    return storeComparisonArray;
  }

  static findPerfectMatches(array) {
    let perfectMatches = [];
    array.forEach((e) => {
      if (e.matched_string === 1) {
        perfectMatches.push(e);
      }
    });
    return perfectMatches;
  }

  static sortAfterComparisonPrice(array) {
    array.sort((a, b) => {
      return (
        (a.discount_comparison_price
          ? a.discount_comparison_price
          : a.comparison_price) -
        (b.discount_comparison_price
          ? b.discount_comparison_price
          : b.comparison_price)
      );
    });
    return array;
  }

  static async searchDBForProducts(
    item,
    productString,
    storeString,
    unit = "",
    brandString = ""
  ) {
    let results = await db.all(/*sql*/ `
      SELECT p.id, name, brand, thumbnail_url, unit_price, comparison_price, discount_comparison_price, discount_price, discount_quantity, store, display_volume, unit_measurement,
      CAST(LENGTH(name) AS FLOAT) / LENGTH("${item.product}") AS matched_string
      FROM Product AS p, Image AS i
      ${productString}
      ${brandString}
      ${unit}
      ${storeString}
      AND p.image_id = i.id
      ORDER BY matched_string`);

    if (results.length === 0) {
      this.tries++;
      return this.tries > 1
        ? []
        : await this.searchDBForProducts(item, productString, storeString);
    } else {
      this.tries = 0;
      return results;
    }
  }
};
