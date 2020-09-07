const StoreHarvester = require("./StoreHarvester");
const fetch = require("node-fetch");
const fs = require('fs');

module.exports = class MathemHarvester extends StoreHarvester {
  constructor(categoriesTranslation, size = 1000) {
    // if (this.constructor === AxfoodHarvester) {
    //   throw new Error("You can not create an instance of StoreHarvester");
    // }
    super(categoriesTranslation, (size = 1000));
  }

  

  static async getCategories() {
    let raw = await fetch(
      "https://api.mathem.io/ecom-navigation/noauth/v2/menu/10"
    );

    let data = await raw.json()
    let mycategories = data["categories"];
    
    mycategories = mycategories.map(item => {

      return {id: item.id, productCount: item.productCount}
    });

    return mycategories;
  }



  static async getProductsPerCategory(id, number) {
    /*
      name
      brand
      country_of_origin
      desc
      display/volume
      store
      unit_price
      comparator
      Comparison_price
      FK_dietary_Restrictions
        .....
      FK_image_id
        image_url
        thumbnail_url

      additional:
        code
        display_volume
    */
    //supplier??

    let base = "https://api.mathem.io/product-search/noauth/search/products/10/";

    let numberofproducts = "?size=" + number;

    let productcategory = "categorytag/"+ id;

    let raw = await fetch(base + productcategory + numberofproducts);
    
    let myproducts = await raw.json()

    myproducts = myproducts.products.map(product => {
      return {name: product.name, 
              categories: product.categoryAncestry,
              brand: product.brand.name,
              country_of_origin: product.origin,
              desc: product.fullName,
              displayvolume: product.quantity,
              store: "Mathem",
              unit_price: product.price,
              comparison_price: product.comparisonPrice,
              comparator: product.comparisonUnit, 
              dietary_restr: product.badges,
              image: product.images.ORIGINAL,
              code: product.id
      }
    })
    return myproducts;
  }

  static async getAllProducts() {

    function writeToFile(fileName, data) {
      fs.writeFileSync(fileName, JSON.stringify(data, null, '  '), 'utf-8');
    }

    let categories = await this.getCategories();
    let allProducts = {};

    var category;

    for (category of categories) {
      let products = await MathemHarvester.getProductsPerCategory(category.id, category.productCount);
      allProducts[category.id] = products;
    }

    writeToFile('mathem.json', allProducts);

    return allProducts;
  }
};
