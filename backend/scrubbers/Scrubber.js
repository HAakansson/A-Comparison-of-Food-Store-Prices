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
      if (DataBaseHelper.checkIfProductExists(product)) {
        console.log('In if', product);
        continue;
      }
      // scrubbed.push(await this.scrubOne(product)); // Why push it on to an array? Why not straight in to the DB?
      let scrubbedProduct;

      try {
        scrubbedProduct = await this.scrubOne(product);
      } catch (error) {
        console.log(product);
        console.log(error);
      }

      if (scrubbedProduct) {
        console.log('in scrubbed if', product);
       await DataBaseHelper.insertProductIntoDB(this.store, scrubbedProduct);
      }
    }
    // return scrubbed;
  }
};
