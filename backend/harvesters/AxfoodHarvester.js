const StoreHarvester = require("./StoreHarvester");
const fetch = require("node-fetch");
const path = require("path");
const DB = require("../DB");
const dbPath = path.join(__dirname, "../databases/foodStore.db");
const db = new DB(dbPath);

module.exports = class AxfoodHarvester extends StoreHarvester {
  static bustCache() {
    return "?avoidCache=" + (Math.random() + "").split(".")[1];
  }

  static async getCategories(store) {
    let data = await fetch(
      `https://${store}/leftMenu/categorytree${this.bustCache()}`
    );
    data = await data.json();
    let categoriesArray = [];
    data.children.forEach((c) => {
      categoriesArray.push({ name: c.title, url: c.url });
      c.children.forEach((cc) => {
        categoriesArray.push({ name: cc.title, url: cc.url });
        if (cc.children.length > 0) {
          cc.children.forEach((ccc) => {
            categoriesArray.push({ name: ccc.title, url: ccc.url });
          });
        }
      });
    });

    for (let obj of categoriesArray) {
      await db.run(
        /*sql*/ `
          INSERT INTO category (name, url) VALUES ($name, $url)
        `,
        {
          $name: obj.name,
          $url: obj.url,
        }
      );
    }
  }

  static async getProducts(store, categoryURL) {
    let raw = await fetch(
      `https://${store}/c/${categoryURL}${this.bustCache()}&size=1000`
    );
    return (await raw.json()).results;
  }

  static async getAllProducts() {
    // NOT WRITTEN YET!
    let catArr = [];
    let categories = await this.getCategories("www.hemkop.se");
    categories.children.forEach((c) => {
      c.children.forEach((cc) => {
        if (cc.children.length > 0) {
          cc.children.forEach((ccc) => {
            catArr.push(ccc.url);
          });
        } else {
          catArr.push(cc.url);
        }
      });
    });
    return catArr;
  }
};
