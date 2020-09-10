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
        $code: product.code,
        $store: store.split(".")[1],
      }
    );
    
    return dbProduct ? dbProduct : false; 
  }


  static async updateProductDiscountAxfood(product, dbProduct) {
    
    db.run(
      /*sql*/ `UPDATE Product SET discount_price = $discount_price, discount_quantity = $discount_quantity, discount_comparison_price = $discount_comparison_price, discount_max_limit = $discount_max_limit, discount_requires_membership = $discount_requires_membership WHERE code = $code AND store = $store`,
      {
        $code: product.code,
        $store: dbProduct.store,
        $discount_price: product.potentialPromotions[0].rewardLabel !== null && product.potentialPromotions[0].rewardLabel !== "" ? product.potentialPromotions[0].rewardLabel.replace(/[,]/, ".").replace(/[a-z:\s/]/g, "") : null,
        $discount_quantity: product.potentialPromotions[0].conditionLabel !== null && product.potentialPromotions[0].conditionLabel !== "" ? product.potentialPromotions[0].conditionLabel.includes("Spara") ? null : parseFloat(product.potentialPromotions[0].conditionLabel.replace(/[a-z:\s]/g, "")) : null,
        $discount_comparison_price: product.potentialPromotions[0].comparePrice !== null && product.potentialPromotions[0].comparePrice !== "" ? product.potentialPromotions[0].comparePrice : null,
        $discount_max_limit: product.potentialPromotions[0].redeemLimitLabel !== null && product.potentialPromotions[0].redeemLimitLabel !== "" ? parseFloat(product.potentialPromotions[0].redeemLimitLabel.replace(/[a-z:\s]/g, "")) : null,
        $discount_requires_membership: product.potentialPromotions[0].campaignType !== null && product.potentialPromotions[0].campaignType !== "" ? product.potentialPromotions[0].campaignType.includes("LOYALTY") ? true : false : false,
      }
    );
  }


  static async updateProductPriceAxfood(product, dbProduct) {
    db.run(
      /*sql*/ `UPDATE Product SET unit_price = $unit_price  WHERE code = $code AND store = $store`,
      {
        $code: dbProduct.code,
        $store: dbProduct.store,
        $unit_price: product.priceValue
      }
    );

  }

  static async insertProductIntoDB(store, product) {
    let storeName = store.split(".")[1];

    if (storeName === "willys" || storeName === "hemkop") {
      let result = await db.run(
        /*sql*/ `INSERT INTO Product (name, brand, country_of_origin, description, display_volume, store, unit_price, comparator, comparison_price, code, unit_measurement, discount_price, discount_comparison_price, discount_max_limit, discount_quantity, discount_requires_membership) VALUES($name, $brand, $country_of_origin, $description, $display_volume, $store, $unit_price, $comparator, $comparison_price, $code, $unit_measurement, $discount_price, $discount_comparison_price, $discount_max_limit, $discount_quantity, $discount_requires_membership)`,
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
          $discount_price: product.discountProperties.discount_price,
          $discount_comparison_price: product.discountProperties.discount_comparison_price,
          $discount_max_limit: product.discountProperties.discount_max_limit,
          $discount_quantity: product.discountProperties.discount_quantity,
          $discount_requires_membership: product.discountProperties.discount_requires_membership
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
     await db.run(
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
          $dietary_restrictions_id: potentialId,
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
