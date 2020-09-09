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
    let i = 1;
    for (let product of products) {
      let dbProduct = await DataBaseHelper.checkIfProductExists(
        product,
        this.store
      );
      if (dbProduct) {
        if (dbProduct.store === "mathem") {
          if (!product.discount && dbProduct.discount_price) {
            await DataBaseHelper.resetDiscountsOnProductMathem(dbProduct);
          }
          if (product.price !== dbProduct.unit_price) {
            await DataBaseHelper.UpdatePriceOnProductMathem(product, dbProduct);
          }
          if (product.discount) {
            console.log(i, product.name, product.discount.price);
            i++;
            await DataBaseHelper.UpdateDiscountsOnProductMathem(
              product,
              dbProduct
            );
          }
        }
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
        DataBaseHelper.insertProductIntoDB(this.store, scrubbedProduct);
      }
    }
    // return scrubbed;
  }
};
