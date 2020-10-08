const DB = require("../DB");
const path = require("path");
const dbPath = path.join(__dirname, "../databases/foodStore.db");
const db = new DB(dbPath);

module.exports = class CalculateShoppingList {

  static async getCategoriesFromProductID(searchString){

    var results = await db.all(
      /*sql*/ 
      `SELECT 
          C.categoryCode, C.name, C.store, C.rank, C.parent
      FROM
          Product as P, ProductsXCategories as PxC, Category AS C
      WHERE 
          P.id = PxC.productId AND PxC.categoryId = C.id  AND P.id = $searchString`,
      {
        $searchString: searchString,
      }
    )
    return results;
  }

  static searchCategories = async (listOfCategories, targetstore) => {

    let start = listOfCategories.find(category => {return category.rank === 2});
    let templist = [];
    
    for (let i = 0; i < start.name.length -1; i++) {

      for(let j = 0; j < i + 1; j++){
        let searchString = `${start.name.slice(j, start.name.length -i + j)}`
        templist.push(`SELECT
                        "${searchString}" AS searchString,
                        LENGTH("${searchString}") AS searchStringLength,
                        LENGTH(name) AS nameLength,
                        id,
                        name,
                        store,
                        rank,
                        categoryCode,
                        parent,
                        CASE 
                          WHEN name LIKE "%${searchString}%"
                              THEN (SELECT ROUND(CAST(LENGTH("${searchString}") AS FLOAT)/LENGTH(name), 2))
                          ELSE NULL 
                        END cat_match 
                       FROM 
                         Category
                       WHERE
                         name LIKE "%${searchString}%" AND rank = ${start.rank} AND store = "${targetstore}"`);
              }}

      let query = templist.join("\n UNION \n")

      let fullquery = `SELECT 
                        searchString,
                        searchStringLength,
                        nameLength,
                        id,
                        name,
                        store,
                        rank,
                        categoryCode,
                        parent,
                        cat_match 
                      FROM (${query}) ORDER BY searchStringLength DESC`
            
      let results = await db.all(
                fullquery
              );
      return results
  }
  static sortProducts = async (matchedCategories, targetStore, targetProduct) => {

    let target = matchedCategories[0];
    let start = targetProduct;

    let queryList = [];
    
    for (let i = 0; i < start.name.length -1; i++) {

      for(let j = 0; j < i + 1; j++){
        let searchString = `${start.name.slice(j, start.name.length -i + j)}`
        queryList.push(`
              SELECT
                "${searchString}" AS searchString,
                LENGTH("${searchString}") AS searchStringLength,
                P.id,
                P.name,
                P.brand,
                P.country_of_origin,
                P.description,
                P.display_volume,
                P.store,
                P.unit_price,
                P.comparator,
                P.comparison_price,
                P.dietary_restrictions_id,
                P.image_id,
                P.code,
                P.unit_measurement,
                P.discount_price,
                P.discount_comparison_price,
                P.discount_quantity,
                P.discount_max_limit,
                P.discount_requires_membership
            FROM
                ProductsXCategories as PxC,
                Category AS C,
                Product AS P
            WHERE P.id = PxC.productId AND 
                        PxC.categoryId = C.id  AND
                        C.categoryCode = "${target.categoryCode}" AND --variab
                        C.store = "${targetStore}" AND
                        P.name LIKE "%${searchString}%"`);
      }
    }
    let subquery = queryList.join("\n UNION \n")

      let fullquery = `SELECT 
                        searchString,
                        MAX(searchStringLength) AS searchStringLength,
                        id,
                        name,
                        brand,
                        country_of_origin,
                        description,
                        display_volume,
                        store,
                        unit_price,
                        comparator,
                        comparison_price,
                        dietary_restrictions_id,
                        image_id,
                        code,
                        unit_measurement,
                        discount_price,
                        discount_comparison_price,
                        discount_quantity,
                        discount_max_limit,
                        discount_requires_membership
                      FROM (${subquery})
                      GROUP BY
                        id
                      ORDER BY 
                        searchStringLength DESC`
                
      let results = await db.all(
                fullquery
              );

    return results
  }
  static async getEquilaventProducts(incShoppingList){

    let shoppinglist = {mathem: [], willys: [], hemkop: []}

    for (let listItem of incShoppingList) {

      let stores = ["mathem", "willys", "hemkop"];

      let startingProductID = listItem.productId

      let startingProduct = await db.get(`SELECT * FROM Product WHERE ${startingProductID} = id`)
      let tempProduct = startingProduct;
      tempProduct["amount"] = listItem.amount
      shoppinglist[startingProduct.store].push(tempProduct);
      stores = stores.filter(item => item !== startingProduct.store);
  
      let categories = await this.getCategoriesFromProductID(startingProductID);
  
      for (let singlestore of stores) {
        let targetCategories = await this.searchCategories(categories, singlestore);
        
        let products = await this.sortProducts(targetCategories, singlestore, startingProduct);
        let tempProduct = products[0];
        tempProduct["amount"] = listItem.amount;
  
        shoppinglist[singlestore].push(tempProduct)
      } 
    }

    console.log("shopping list")
    console.log(shoppinglist)

    let resultarray = [];

    let shops = ["mathem", "willys", "hemkop"];
    for (let shop of shops) {
      
      let tempobj = {}
      tempobj["name"] = shop
      tempobj["products"] = shoppinglist[shop];
      let tempsum = 0;
      for (let prod of shoppinglist[shop]){
        tempsum =+ prod.unit_price * prod.amount;
      }
      tempobj["sum"] = tempsum
      resultarray.push(tempobj)
    }



    
    
    return resultarray;
  }

  static calculateTotalCost(incShoppingList) {

    /*
    INCOMIGN SHOPPINGLIST example
    let shoppinglist = [
      {​​​​amount: 200,
      brand: "Estrella",
      id: 50,
      product: "Sourcream & Onion",
      productId: 28245,
      shoppingListId: 21,
      unit: "g"}​​​​, 
      {​​​​
      amount: 200,
      brand: "Estrella",
      id: 50,
      product: "Sourcream & Onion",
      productId: 28245,
      shoppingListId: 21,
      unit: "g",
      }​​​​
    ]
    */
    let response = this.getEquilaventProducts(incShoppingList);
    return response;
  }

}
