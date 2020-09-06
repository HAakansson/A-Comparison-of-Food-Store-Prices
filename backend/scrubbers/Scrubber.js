const DataBaseHelper = require("../DataBaseHelper");

module.exports = class Scrubber {
  constructor(store) {
    this.store = store;
  }
  async scrubOne(product) {
    let scrubbed = {};
    let tschema = this.translateSchema;

    for (let key in tschema) {
      let scrubFunc = tschema[key];
      scrubbed[key] = await scrubFunc(product);
    }
    // This is the extra check when an article number is faulty.
    return scrubbed["extra_info"] ? scrubbed : undefined;
  }

  async scrubAll(products) {
    console.log(
      `Scrubbing products from ${this.store} and adding to DB started...`
    );
    // let scrubbed = [];
    for (let product of products) {
      if (await DataBaseHelper.checkIfProductExists(product)) {
        continue;
      }
      // scrubbed.push(await this.scrubOne(product)); // Why push it on to an array? Why not straight in to the DB?
      let scrubbedProduct = await this.scrubOne(product);
      if (scrubbedProduct) {
        DataBaseHelper.insertProductIntoDB(this.store, scrubbedProduct);
      }
    }
    // return scrubbed;
  }
};
