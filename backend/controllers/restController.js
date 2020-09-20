const DB = require("../DB");
const path = require("path");
const dbPath = path.join(__dirname, "../databases/foodStore.db");
const db = new DB(dbPath);

const getCategories = async (req, res) => {
  await db.all(/*sql*/ `query....osv...`);
  //Code here
};

const getSuggestions = async (req, res) => {
  let value = "";
  let searchString = req.query.s;
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

module.exports = {
  getCategories,
  getSuggestions,
};
