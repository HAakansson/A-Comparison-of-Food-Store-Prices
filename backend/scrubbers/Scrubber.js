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
    let productsInDb = await DataBaseHelper.getAllProducts(this.store);

    // create hash of new products
    let productsHash = {};
    for(let product of products){
      productsHash[product.code || product.id] = true;
    }
    // loop through old products
    let toBeDeleted = [];
    for(let product of productsInDb){
      if(!productsHash[product.code]){
        toBeDeleted.push(product);
      }
    }
    
    await DataBaseHelper.removeProducts(toBeDeleted);
    for (let product of products) {
      let dbProduct = await DataBaseHelper.checkIfProductExists(product, this.store);
      // if product exist...
      if (dbProduct) {
        // if store is Axfood: 
        if (dbProduct.store === "hemkop" || dbProduct.store === "willys") {
          try {
            this.isProductUpdatedAxfood(product, dbProduct); // checks if product needs to update price
          } catch (err) {
            console.log(err);
          }
        }
        if (dbProduct.store === "mathem") {
          if (!product.discount && dbProduct.discount_price) {
            await DataBaseHelper.resetDiscountsOnProductMathem(dbProduct);
          }
          if (product.price !== dbProduct.unit_price) {
            await DataBaseHelper.UpdatePriceOnProductMathem(product, dbProduct);
          }
          if (product.discount) {
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
        console.log(error);
      }

      if (scrubbedProduct) {
        await DataBaseHelper.insertProductIntoDB(scrubbedProduct);
      }
    }
    // return scrubbed;
  }
   async isProductUpdatedAxfood(product, dbProduct) {
    // if discount exist on scubbed product...
    if (product.potentialPromotions.length > 0)
    {
  
      // if price from api is not equal dbPr
      if (parseFloat(product.potentialPromotions[0].rewardLabel.replace(/[,]/, ".").replace(/[a-z:\s/]/g, "")) !== dbProduct.discount_price) {
        DataBaseHelper.updateProductDiscountAxfood(product, dbProduct);
        //DatabaseHelper.updateProductWithPotentialDiscount(product);
      } 
    }
    // if product price is not the same as price in db
     if (product.priceValue !== dbProduct.unit_price) {
          DataBaseHelper.updateProductPriceAxfood(product, dbProduct);
    }
  }
    
};
