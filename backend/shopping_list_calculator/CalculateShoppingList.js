
module.exports = class CalculateShoppingList {

  static calculateTotalCost(shoppingList) {
    console.log("Shopping List to calculate ", shoppingList);
  }

  static  async fetchCheapestProducts(shoppingList){
    //fetch products from the shoppinglist, based on name? and fetch the cheapest products.
    for (let product of shoppingList){
      await db.run(/*sql*/ `SELECT * FROM Product WHERE name LIKE $%productName%`,
      {
        $name: product.name
      })
    }
  }

}
