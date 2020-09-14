const DB = require("../DB");
const path = require("path");
const dbPath = path.join(__dirname, "../databases/foodStore.db");
const db = new DB(dbPath);

// const getSomething = async (req, res) => {
//   await db.all(/*sql*/ `query....osv...`);
//   //Code here
// };

module.exports = {
  // getSomething,
};
