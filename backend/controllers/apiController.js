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

  let query = /*sql*/ `SELECT p.id, p.name, p.store, p.unit_price, p.comparison_price, p.comparator, p.display_volume, p.unit_measurement, p.country_of_origin, dr.*, i.*,
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
