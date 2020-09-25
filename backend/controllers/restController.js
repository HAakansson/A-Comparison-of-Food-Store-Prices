const DB = require("../DB");
const path = require("path");
const dbPath = path.join(__dirname, "../databases/foodStore.db");
const db = new DB(dbPath);
const CalculateShoppingList = require("../shopping_list_calculator/CalculateShoppingList");

function removeDoubletBrands(array) {
  let hash = {};
  for (let e of array) {
    hash[e.brand] = e;
  }
  return Object.values(hash);
}

const getDietaryRestrictions = async (req, res) => {
  let result = await db.all(/*sql*/ `SELECT * FROM Dietary_Restrictions`);
  res.json(result);
};

const postShoppingList = async (req, res) => {
  //var jsonList = JSON.stringify(req.body);
  CalculateShoppingList.calculateTotalCost(req.body);
};

const getProductSuggestions = async (req, res) => {
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
    /*sql*/ `SELECT id, name, unit_measurement, brand, (CAST(LENGTH($searchString) AS FLOAT) / LENGTH(name)) as matchedSearchString
    FROM Product 
    WHERE brand LIKE $searchString
    OR name LIKE $searchString 
    ORDER BY matchedSearchString DESC`,
    {
      $searchString: value,
    }
  );

  if (searchString[0] === "c" && searchString[1] === "r") {
    results.unshift({
      name: "Creme Fraiche",
      matchedSearchString: 1,
    });
  }

  let hash = {};
  for (let r of results) {
    hash[r.name] = r;
  }
  results = Object.values(hash);

  res.json(results);
};

const getBrandSuggestions = async (req, res) => {
  let brand = req.query.b;
  let brandString = `${req.query.b[0].toUpperCase() + req.query.b.slice(1)}%`;

  let results = await db.all(
    /*sql*/ `SELECT brand, CAST(LENGTH("${brand}") AS FLOAT) / LENGTH (brand) AS matchedSearchString
    FROM Product WHERE brand LIKE $brand
    ORDER BY matchedSearchString DESC`,
    { $brand: brandString }
  );

  results = removeDoubletBrands(results);
  results = results.map((r) => r.brand);
  res.json(results);
};

const getCategories = async (req, res) => {
  let results = await db.all(/*sql*/ `SELECT DISTINCT name, 
    CAST(LENGTH("${req.query.search}") AS FLOAT)/LENGTH(name) as match_percentage,
    FROM Category WHERE name LIKE "%${req.query.search}%"
    ORDER BY match_percentage DESC`);

  res.json(results);
};

const postCreateShoppingList = async (req, res) => {
  let result = await db.run(
    /*sql*/ `INSERT INTO ShoppingLists (name, creator, timestamp) VALUES ($name, $creator, $timestamp)`,
    {
      $name: req.body.name,
      $creator: req.body.creator || null,
      $timestamp: new Date().getTime(),
    }
  );

  let id = result.lastID;
  res.json(id);
};

const getAllShoppingLists = async (req, res) => {
  let result = await db.all(/*sql*/ `SELECT * FROM ShoppingLists`);
  res.json(result);
};

const getSingleShoppingList = async (req, res) => {
  let result = await db.all(
    /*sql*/ `SELECT * FROM ShoppingListItems WHERE shoppingListId = $id`,
    {
      $id: req.params.shoppingListId,
    }
  );
  res.json(result);
};

const postRowToList = async (req, res) => {
  let result = await db.run(
    /*sql*/ `INSERT INTO ShoppingListItems (product, brand, amount, unit, shoppingListId) VALUES ($product, $brand, $amount, $unit, $shoppingListId)`,
    {
      $product: req.body.product,
      $brand: req.body.brand,
      $amount: req.body.amount,
      $unit: req.body.unit,
      $shoppingListId: req.params.shoppingListId,
    }
  );
  res.json(result.lastID);
};

const getNewRowFromShoppingList = async (req, res) => {
  let result = await db.get(
    /*sql*/ `SELECT * FROM ShoppingListItems WHERE id = $id`,
    {
      $id: req.params.rowId,
    }
  );
  res.json(result);
};

const deleteRowFromList = async (req, res) => {
  let result = await db.run(
    /*sql*/ `
    DELETE FROM ShoppingListItems WHERE id = $id
  `,
    {
      $id: req.params.rowId,
    }
  );
  res.json(result.changes);
};

const deleteShoppingList = async (req, res) => {
  let result = await db.run(
    /*sql*/ `DELETE FROM ShoppingLists WHERE id = $id`,
    {
      $id: req.params.shoppingListId,
    }
  );
  res.json(result.changes);
};

module.exports = {
  postCreateShoppingList,
  postShoppingList,
  postRowToList,
  getCategories,
  getProductSuggestions,
  getDietaryRestrictions,
  getBrandSuggestions,
  getAllShoppingLists,
  getSingleShoppingList,
  getNewRowFromShoppingList,
  deleteRowFromList,
  deleteShoppingList,
};
