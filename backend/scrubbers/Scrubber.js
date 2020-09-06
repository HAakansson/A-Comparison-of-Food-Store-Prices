const DataBaseHelper = require("../DataBaseHelper");

module.exports = class Scrubber {
  constructor(store) {
    this.store = store;
    this.faultyCodes = ["101208360_ST", "101290126_ST"];
  }
  async scrubOne(product) {
    let scrubbed = {};
    let tschema = this.translateSchema;

    for (let key in tschema) {
      let scrubFunc = tschema[key];
      scrubbed[key] = await scrubFunc(product);
    }
    return scrubbed;
  }

  async scrubAll(products) {
    console.log(
      `Scrubbing products from ${this.store} and adding to DB started...`
    );
    // let scrubbed = [];
    for (let product of products) {
      if (this.faultyCodes.includes(product.code)) {
        continue;
      }
      if (await DataBaseHelper.checkIfProductExists(product)) {
        continue;
      }
      // scrubbed.push(await this.scrubOne(product)); // Why push it on to an array? Why not straight in to the DB?
      let scrubbedProduct = await this.scrubOne(product);
      DataBaseHelper.insertProductIntoDB(this.store, scrubbedProduct);
    }
    // return scrubbed;
  }
};
