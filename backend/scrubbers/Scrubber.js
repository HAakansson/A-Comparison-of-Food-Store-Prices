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
      
      let sProduct;
      let dbProduct;

      try {
        sProduct = await this.scrubOne(product);

      } catch (err)
      {
        console.log(err);
      }

      dbProduct = await DataBaseHelper.checkIfProductExists(sProduct);



      //console.log(dbProduct);

      // if product exist...
      if (dbProduct) {

        // if store is Axfood: 
        if (sProduct.store === "hemkop" || sProduct.store === "willys") {
          try {
             this.isProductUpdatedAxfood(product, dbProduct); // checks if product needs to update price
          } catch (err) {
            console.log(err);
          }

        } else {
          // for mathem...
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


 
   async isProductUpdatedAxfood(product, dbProduct) {

    // if discount exist on scubbed product...
    if (product.potentialPromotions.length > 0)
    {
      
      // if price from api is not equal dbPr
      if (parseFloat(product.potentialPromotions[0].rewardLabel.replace(/[,]/, ".").replace(/[a-z:\s/]/g, "")) !== dbProduct.discount_price) {
                
        console.log("DISCOUNT PRICE DIFFERENT")
        console.log(product.code);

        DataBaseHelper.updateProductDiscountAxfood(product, dbProduct);
        //DatabaseHelper.updateProductWithPotentialDiscount(product);
      } 
    }

     console.log(product.priceValue, dbProduct.unit_price);
     
     
    // if product price is not the same as price in db
     if (product.priceValue !== dbProduct.unit_price) {
       console.log("PRICE DIFFERENT");
       console.log(product.code);

          DataBaseHelper.updateProductPriceAxfood(product, dbProduct);
    }
  }
    
};
