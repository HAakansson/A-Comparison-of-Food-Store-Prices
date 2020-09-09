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

  static async checkIfProductExists(product, store) {
    let dbProduct = await db.get(
      /*sql*/ `SELECT * FROM Product WHERE code = $code AND store = $store`,
      {
        $code: product.code || product.id,
        $store: store.split(".")[1],
      }
    );
    return dbProduct;
  }
  static async UpdatePriceOnProductMathem(product, dbProduct) {
    await db.run(
      /*sql*/ `UPDATE Product SET unit_price = $newPrice WHERE code = $code`,
      {
        $newPrice: product.price,
        $code: dbProduct.code,
      }
    );
  }

  static async UpdateDiscountsOnProductMathem(product, dbProduct) {
    await db.run(
      /*sql*/ `UPDATE Product SET discount_price = $newPrice, discount_comparison_price = $comparison_price, discount_quantity = $quantity, discount_max_limit = $max_limit WHERE code = $code`,
      {
        $newPrice:
          product.discount.price ||
          product.discount.displayPrice ||
          product.discount.unitPrice,
        $comparison_price: product.discount.comparisonPrice,
        $quantity: product.discount.quantityToBeBought,
        $max_limit: product.discount.discountCountLimit,
        $code: dbProduct.code,
      }
    );
  }

  static async resetDiscountsOnProductMathem(dbProduct) {
    await db.run(
      /*sql*/ `UPDATE Product SET discount_price = $newPrice, discount_comparison_price = $comparison_price, discount_quantity = $quantity, discount_max_limit = $max_limit WHERE code = $code`,
      {
        $newPrice: null,
        $comparison_price: null,
        $quantity: null,
        $max_limit: null,
        $code: dbProduct.code,
      }
    );
  }

  static async insertProductIntoDB(store, product) {
    let storeName = store.split(".")[1];
    let result = await db.run(
      /*sql*/ `INSERT INTO Product (name, brand, country_of_origin, description, display_volume, store, unit_price, comparator, comparison_price, code, unit_measurement, discount_price, discount_comparison_price, discount_quantity,discount_max_limit) VALUES($name, $brand, $country_of_origin, $description, $display_volume, $store, $unit_price, $comparator, $comparison_price, $code, $unit_measurement, $discount_price, $discount_comparison_price, $discount_quantity,$discount_max_limit)`,
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
        $discount_price: product.discount.price,
        $discount_comparison_price: product.discount.comparison_price,
        $discount_quantity: product.discount.quantity,
        $discount_max_limit: product.discount.max_limit,
      }
    );
    if (result) {
      let productId = result.lastID;
      let potentialId = await this.checkIfDietaryRestrictionExists(
        product,
        productId
      );
      await this.insertDataIntoProductsXCategories(product, productId);
      await this.insertDataIntoImageTable(product);

      potentialId
        ? await this.insertDataIntoDietaryTable(product, potentialId)
        : await this.insertDataIntoDietaryTable(product);
    }
  }

  static async insertDataIntoProductsXCategories(product, productId) {
    for (let category of product.extra_info.categories) {
      let result = await db.get(
        /*sql*/ `SELECT id FROM Category WHERE categoryCode = $categoryCode`,
        { $categoryCode: category.categoryCode }
      );
      if (result) {
        await db.run(
          /*sql*/ `INSERT INTO ProductsXCategories (productId, categoryId) VALUES ($productId, $categoryId)`,
          { $productId: productId, $categoryId: result.id }
        );
      }
    }
  }

  static async insertDataIntoImageTable(product) {
    let result = await db.run(
      /*sql*/ `INSERT INTO Image (image_url, thumbnail_url) VALUES ($image_url, $thumbnail_url)`,
      {
        $image_url: product.image_url,
        $thumbnail_url: product.thumbnail_url,
      }
    );
    if (result) {
      db.run(
        /*sql*/ `UPDATE Product SET image_id = $image_id WHERE code = $code`,
        {
          $image_id: result.lastID,
          $code: product.code,
        }
      );
    }
  }

  static async checkIfDietaryRestrictionExists(product, productId) {
    let dietaryRestrictionExist = await db.get(
      /*sql*/ `SELECT id FROM Dietary_Restrictions WHERE organic = $organic AND gluten = $gluten AND vegetarian = $vegetarian AND vegan = $vegan AND lactosefree = $lactosefree`,
      {
        $organic: product.organic,
        $gluten: product.gluten,
        $vegetarian: product.extra_info.vegetarian,
        $vegan: product.extra_info.vegan,
        $lactosefree: product.lactosefree,
      }
    );
    return dietaryRestrictionExist ? dietaryRestrictionExist.id : false;
  }

  static async insertDataIntoDietaryTable(product, potentialId) {
    if (potentialId) {
      db.run(
        /*sql*/ `UPDATE Product SET dietary_restrictions_id = $dietary_restrictions_id WHERE code = $code`,
        {
          $dietary_restrictions_id: potentialId, //result.lastID,
          $code: product.code,
        }
      );
    } else {
      let result = await db.run(
        /*sql*/ `INSERT INTO Dietary_Restrictions (organic, gluten, vegetarian, vegan, lactosefree) VALUES ($organic, $gluten, $vegetarian, $vegan, $lactosefree)`,
        {
          $organic: product.organic,
          $gluten: product.gluten,
          $vegetarian: product.extra_info.vegetarian,
          $vegan: product.extra_info.vegan,
          $lactosefree: product.lactosefree,
        }
      );

      if (result) {
        db.run(
          /*sql*/ `UPDATE Product SET dietary_restrictions_id = $dietary_restrictions_id WHERE code = $code`,
          {
            $dietary_restrictions_id: result.lastID,
            $code: product.code,
          }
        );
      }
    }
  }
};
