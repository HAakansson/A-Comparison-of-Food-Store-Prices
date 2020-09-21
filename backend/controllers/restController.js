const DB = require("../DB");
const path = require("path");
const dbPath = path.join(__dirname, "../databases/foodStore.db");
const db = new DB(dbPath);

const getCategories = async (req, res) => {
  await db.all(/*sql*/ `query....osv...`)
  //Code here
}

const getProductsById = async (req, res) => {
  let result = await db.all(/*sql*/ `SELECT * FROM Product WHERE ${req.params.productId} = code`)

  res.json(result);
}

module.exports = {
  getCategories,
  getProductsById
}