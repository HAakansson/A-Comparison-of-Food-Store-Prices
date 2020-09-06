const path = require("path");
const DB = require("./DB");
const dbPath = path.join(__dirname, "./databases/foodStore.db");
const db = new DB(dbPath);

module.exports = class DataBaseHelper {
  static async checkIfCategoryExists(category) {
    let categoryExists = await db.get(
      /*sql*/ `SELECT * FROM Category WHERE categoryCode = $categoryCode`,
      { $categoryCode: category.categoryCode }
    );
    return categoryExists ? true : false;
  }

  static async insertCategoryToDB(category) {
    await db.run(
      /*sql*/ `
          INSERT INTO Category (name, url, store, categoryCode) VALUES ($name, $url, $store, $categoryCode)
        `,
      {
        $name: category.name,
        $url: category.url,
        $store: category.store,
        $categoryCode: category.categoryCode,
      }
    );
  }

  static async checkIfProductExists(product) {
    let productExists = await db.get(
      /*sql*/ `SELECT * FROM Product WHERE code = $code`,
      { $code: product.code }
    );
    return productExists ? true : false;
  }

  static async insertProductIntoDB(store, product) {
    let storeName = store.split(".")[1];
    let productId;
    if (storeName === "willys" || storeName === "hemkop") {
      await db.run(
        /*sql*/ `INSERT INTO Product (name, brand, country_of_origin, description, display_volume, store, unit_price, comparator, comparison_price, code, unit_measurement) VALUES($name, $brand, $country_of_origin, $description, $display_volume, $store, $unit_price, $comparator, $comparison_price, $code, $unit_measurement)`,
        {
          $name: product.name,
          $brand: product.brand,
          $country_of_origin: product.extra_info.country_of_origin,
          $description: product.extra_info.desc,
          $display_volume: product.display_volume,
          $store: product.store,
          $unit_price: product.unit_price,
          $comparator: product.comparator,
          $comparison_price: product.comparison_price,
          $code: product.code,
          $unit_measurement: product.unit_measurement,
        },
        function (err) {
          if (err) {
            console.log("Some error ocurred in the INSERT phase: ", err);
          } else {
            console.log("Does this show");
            productId = this.lastID;
          }
        }
      );
      console.log("Insertion ok, on to the next");
      this.insertDataIntoProductsXCategories(product, productId);
      this.insertDataIntoImageTable(product);
      this.insertDataIntoDietaryTable(product);
    }
  }

  static async insertDataIntoProductsXCategories(product, productId) {
    console.log("ProductID: ", productId);

    for (let category of product.extra_info.categories) {
      let categoryId = await db.get(
        /*sql*/ `SELECT id FROM Category WHERE categoryCode = $categoryCode`,
        { $categoryCode: category.$categoryCode }
      );
      await db.run(
        /*sql*/ `INSERT INTO ProductsXCategories (productId, categoryId) VALUES ($productId, $categoryId)`,
        { $productId: productId, $categoryId: categoryId }
      );
    }
  }

  static async insertDataIntoImageTable(product) {
    await db.run(
      /*sql*/ `INSERT INTO Image (image_url, thumbnail_url) VALUES ($image_url, $thumbnail_url)`,
      {
        $image_url: product.image_url,
        $thumbnail_url: product.thumbnail_url,
      },
      function () {
        db.run(
          /*sql*/ `UPDATE Product SET image_id = $image_id WHERE code = $code`,
          {
            $image_id: this.lastID,
            $code: product.code,
          }
        );
      }
    );
  }

  static async insertDataIntoDietaryTable(product) {
    await db.run(
      /*sql*/ `INSERT INTO Dietary_Restrictions (organic, gluten, vegetarian, vegan, lactosefree) VALUES ($organic, $gluten, $vegetarian, $vegan, $lactosefree)`,
      {
        $organic: product.organic,
        $gluten: product.gluten,
        $vegetarian: product.extra_info.vegetarian,
        $vegan: product.vegan,
        $lactosefree: product.lactosefree,
      },
      function () {
        db.run(
          /*sql*/ `UPDATE Product SET dietary_restrictions_id = $dietary_restrictions_id WHERE code = $code`,
          {
            $dietary_restrictions_id: this.lastID,
            $code: product.code,
          }
        );
      }
    );
  }
};
