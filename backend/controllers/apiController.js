const DB = require("../DB");
const path = require("path");
const dbPath = path.join(__dirname, "../databases/foodStore.db");
const db = new DB(dbPath);

const getProducts = async (req, res) => {
  let s = req.query.s ? req.query.s.split(",") : null;
  let c = req.query.c ? req.query.c.split(",") : null;
  let d = req.query.d ? req.query.d.split(",") : null;

  // let dietaryResults = await db.all(/*sql*/ `SELECT * FROM Dietary_Restrictions WHERE `)

  console.log(s, c, d);
  res.json(null); 
};

module.exports = {
  getProducts,
};
