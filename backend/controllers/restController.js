const DB = require("../DB");
const path = require("path");
const dbPath = path.join(__dirname, "../databases/foodStore.db");
const db = new DB(dbPath);

const getCategories = async (req, res) => {
  await db.all(/*sql*/ `query....osv...`)
  //Code here
}

const getDietaryRestrictions = async (req, res) =>{
  // let result = await db.all(/*sql*/ `SELECT d.organic, d.gluten, d.vegetarian, d.vegan, d.lactosefree FROM Dietary_Restrictions as d WHERE d.id = 1`)
  let result = await db.all(/*sql*/`SELECT name FROM PRAGMA_TABLE_INFO('Dietary_Restrictions')`);
  result = result.slice(1, result.length)
  result = result.map(x => x.name);

   res.json(result);
}

module.exports = {
  getCategories,
  getDietaryRestrictions
}