const DB = require("../DB");
const path = require("path");
const dbPath = path.join(__dirname, "../databases/foodStore.db");
const db = new DB(dbPath);
const CalculateShoppingList = require("../shopping_list_calculator/CalculateShoppingList");

const getDietaryRestrictions = async (req, res) => {
  let result = await db.all(/*sql*/ `SELECT * FROM Dietary_Restrictions`);
  res.json(result);
};

const postShoppingList = async (req, res) => {
  //var jsonList = JSON.stringify(req.body);
  CalculateShoppingList.calculateTotalCost(req.body);
};

const getSuggestions = async (req, res) => {
  let value = "";
  let searchString = req.query.s;
  if (
    searchString[0] === "å" ||
    searchString[0] === "ä" ||
    searchString[0] === "ö"
  ) {
    searchString = searchString[0].toUpperCase() + searchString.slice(1);
  }
  if (searchString.length <= 1) {
    res.json(null);
  } else if (searchString.length < 5) {
    value = `${searchString}%`;
  } else {
    value = `%${searchString}%`;
  }
  let results = await db.all(
    /*sql*/ `SELECT name, (CAST(LENGTH("${searchString}") AS FLOAT) / LENGTH(name)) as matchedSearchString  FROM Product WHERE name LIKE $searchString ORDER BY matchedSearchString DESC LIMIT 30`,
    {
      $searchString: value,
    }
  );
  results = results.map((x) => x.name);
  if (searchString[0] === "c" && searchString[1] === "r") {
    results.push("Creme Fraiche");
  }
  results = [...new Set(results)];
  res.json(results);
};

const getCategories = async (req, res) => {
  let results = await db.all(/*sql*/ `SELECT DISTINCT name, 
    CAST(LENGTH("${req.query.search}") AS FLOAT)/LENGTH(name) as match_percentage,
    CASE WHEN name LIKE "${req.query.search}%"
    THEN true ELSE false END firstphrase
    FROM Category WHERE name LIKE "%${req.query.search}%"
    ORDER BY firstphrase DESC, match_percentage DESC`);

  res.json(results);
};

module.exports = {
  getCategories,
  getSuggestions,
  getDietaryRestrictions,
  postShoppingList,
};
