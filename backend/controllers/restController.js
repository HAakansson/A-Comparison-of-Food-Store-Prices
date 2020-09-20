const DB = require("../DB");
const path = require("path");
const dbPath = path.join(__dirname, "../databases/foodStore.db");
const db = new DB(dbPath);
const CalculateShoppingList = require('../shopping_list_calculator/CalculateShoppingList');

const getCategories = async (req, res) => {
  let results = await db.all(/*sql*/ `SELECT DISTINCT name, 
    CAST(LENGTH("${req.query.search}") AS FLOAT)/LENGTH(name) as match_percentage,
    CASE WHEN name LIKE "${req.query.search}%"
    THEN true ELSE false END firstphrase
    FROM Category WHERE name LIKE "%${req.query.search}%"
    ORDER BY firstphrase DESC, match_percentage DESC`);

  res.json(results);
};

const getDietaryRestrictions = async (req, res) => {
  let result = await db.all(/*sql*/ `SELECT * FROM Dietary_Restrictions`);
};


const postShoppingList = async (req, res) => {

  //var jsonList = JSON.stringify(req.body);
  CalculateShoppingList.calculateTotalCost(req.body);
}

module.exports = {
  getCategories,
  getDietaryRestrictions,
};
