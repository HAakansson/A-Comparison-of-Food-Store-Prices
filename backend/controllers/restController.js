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
  } else if (searchString.length < 6) {
    value = `${searchString}%`;
  } else {
    value = `%${searchString}%`;
  }
  let results = await db.all(
    /*sql*/ `SELECT name FROM Product WHERE name LIKE $searchString ORDER BY name ASC`,
    {
      $searchString: value,
    }
  );
  results = results.map((e) => {
    return e.name.split(" ").filter((f) => {
      return (
        (f.includes(searchString[0].toUpperCase() + searchString.slice(1)) ||
          f.includes(searchString)) && !(/[/&]/.test(f))
      );
    })[0];
  });
  if (searchString.includes("cr")) {
    results.push("Creme Fraiche")
  }
  results = [...new Set(results)];
  res.json(results);
};

module.exports = {
  getCategories,
  getSuggestions,
};
