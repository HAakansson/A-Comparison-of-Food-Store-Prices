const path = require("path");
const DB = require("../DB");
const dbPath = path.join(__dirname, "../databases/foodStore.db");
const db = new DB(dbPath);

module.exports = class CalculateShoppingLis_alt {
  static storeArray = ["willys", "hemkop", "mathem"];
  static dbTries = 0;

  static async calculateTotalCost(shoppingList) {
    let list = shoppingList;
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
        let amount = item.amount ? item.amount : "";

        let results = await this.searchDBForProducts(
          item,
          productString,
          storeString,
          unit,
          brandString
        );

        let perfectMatches = this.findPerfectMatches(results);

        if (perfectMatches.length !== 0) {
          perfectMatches = this.addTotalCostOfMultiplesOfProduct(
            perfectMatches,
            amount
          );
          perfectMatches = this.sortAfterTotalCost(perfectMatches);
        } else {
          results = this.addTotalCostOfMultiplesOfProduct(results, amount);
          results = this.sortAfterTotalCost(results);
        }

        // Since the products has been sorted, the first one is the cheepest one, that one goes in to the storeObject.
        storeObject.products.push(
          perfectMatches.length > 0 ? perfectMatches[0] : results[0]
        );
      }

      // if (storeObject.name === "mathem") {
      //   console.log(storeObject);
      // }

      storeObject.sum = storeObject.products.reduce((sum, p) => {
        let price = p ? (p.cost ? p.cost : p.unit_price) : 0;
        return sum + price;
      }, 0);

      console.log(storeObject);
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

  static sortAfterTotalCost(array) {
    array.sort((a, b) => {
      return a.cost - b.cost;
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

  static addTotalCostOfMultiplesOfProduct(array, amount) {
    // Ta bort produkter vars mängd överstiger den efterfrågade mängden. Tex, vill vi ha en liter mjölk, ta bort alla produkter som har volymer över en liter.
    array = array.filter((p) => {
      return !(amount / p.display_volume < 1);
    });

    // Ta fram totalkostnaden av den efterfrågade mängden av produkten. till exempel, kostanden av två enochenhalvlitersförpackningar av mjölk när den efterfrågade mängden är tre liter mjölk.
    array = array.map((p) => {
      let numberOfProducts = Math.floor(amount / p.display_volume);
      let cost = numberOfProducts * p.unit_price;
      return {
        ...p,
        numberOfProducts,
        cost,
        amount,
      };
    });
    return array;
  }
};
