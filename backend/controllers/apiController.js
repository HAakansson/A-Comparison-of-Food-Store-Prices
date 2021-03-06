const DB = require("../DB");
const path = require("path");
const dbPath = path.join(__dirname, "../databases/foodStore.db");
const db = new DB(dbPath);

const getProducts = async (req, res) => {
  let searchArr = req.query.s ? req.query.s.split(" ") : null;
  let dietArr = req.query.d ? req.query.d.split(",") : null;
  let catArr = req.query.c ? req.query.c.split(",") : null;

  let searchString = "";
  if (searchArr) {
    searchArr.forEach((s, i) => {
      if (s[0] === "å" || s[0] === "ä" || s[0] === "ö") {
        s = s[0].toUpperCase() + s.slice(1);
      }
        searchString +=
          i === 0 ? `WHERE p.name LIKE "%${s}%" ` : `AND p.name LIKE "%${s}%" `;
    });
  }

  let dietString = "";
  if (dietArr) {
    dietArr.forEach((d) => {
      dietString += `AND dr.${d} = true `;
    });
  }

  let catString = catArr ? "AND c.name IN (" : "";
  let catChecks = "";
  if (catArr) {
    catArr.forEach((c, i) => {
      catChecks +=
        i === catArr.length - 1
          ? `"${c[0].toUpperCase() + c.slice(1)}"`
          : `"${c[0].toUpperCase() + c.slice(1)}",`;
    });
    catString += `${catChecks})`;
  }

  let query = /*sql*/ `SELECT p.*, dr.*, i.*,
    CAST(LENGTH("${searchArr.join(
      " "
    )}") AS FLOAT) / LENGTH(p.name) as matchedSearchString
    FROM Product as p
    JOIN Dietary_Restrictions as dr ON p.dietary_restrictions_id = dr.id
    JOIN Image as i ON p.image_id = i.id
    JOIN ProductsXCategories as pxc ON p.id = pxc.productId
    JOIN Category as c ON c.id = pxc.categoryId
    ${searchString}
    ${dietString}
    ${catString}
    ORDER BY matchedSearchString DESC`;

  let results = await db.all(query);

  let hash = {};
  results.forEach((r) => {
    hash[r.id] = r;
  });
  results = Object.values(hash);

  results.sort((a, b) => b.matchedSearchString - a.matchedSearchString);

  res.json(results);
};

module.exports = {
  getProducts,
};
