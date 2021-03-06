const fetch = require("node-fetch");
const Scrubber = require("./Scrubber");

module.exports = class MatHemScrubber extends Scrubber {
  constructor() {
    super("www.mathem.se");
  }

  translateSchema = {
    code: (x) => x.id,
    name: (x) => x.fullName,
    store: () => this.store.split(".")[1],
    brand: (x) => x.brand.name || "Unknown",
    image_url: (x) => x.images.ORIGINAL,
    thumbnail_url: (x) => x.images.SMALL,
    unit_price: (x) => x.price,
    display_volume: (x) => x.quantity,
    unit_measurement: (x) => x.unit,
    comparison_price: (x) => x.comparisonPrice,
    comparator: (x) => x.comparisonUnit,
    lactosefree: (x) => {
      return x.fullName.includes("Laktosfri");
      /*
      return x.badges.length > 0
        ? x.badges.some((y) => {
            return y.name === "Laktosfri";
          })
        : x.fullName.includes("Laktosfri") ? true : false;
        //: false;
        */
    },
    organic: (x) => {
      return x.badges.length > 0
        ? x.badges.some((y) => {
            return y.name === "Ekologisk";
          })
        : false;
    },
    gluten: (x) => {
      return x.badges.length > 0
        ? x.badges.some((y) => {
            return y.name === "Glutenfri";
          })
        : false;
    },
    extra_info: async (x) => {
      let information = {};

      let data;
      let rawData = await fetch(
        `https://api.mathem.io/product-search/noauth/search/detail/10/${x.id}`
      ).catch((err) => {
        console.log(err);
      });
      // If article number in deep article info does not match the article number from shallow article info, this will stop the operation and go to the next iteration, check scrubber class for more info.
      if (rawData.status === 400) {
        return;
      }
      data = await rawData.json();

      information.country_of_origin = x.origin ? x.origin.name : "Unknown";
      information.desc = data.info.PRODUCT_DESCRIPTION;
      information.vegan = x.badges.length > 0 ? x.badges.some((y) => { return y.name === "Vegansk"; }) : false;
      information.vegetarian = information.vegan === true ? true : x.categoryAncestry.some((y) => { return y.name.includes("Vegetarisk") });
      information.categories = x.categoryAncestry.map((x) => {
        return {
          name: x.name,
          categoryCode: x.url,
        };
      });
      return information;
    },
    discount: (x) => {
      let discount = {};
      if (!x.discount) {
        discount.price = null;
        discount.comparison_price = null;
        discount.quantity = null;
        discount.max_limit = null;
        return discount;
      }
      discount.price = x.discount.unitPrice;
      discount.comparison_price = x.discount.comparisonPrice;
      discount.quantity = x.discount.quantityToBeBought;
      discount.max_limit = x.discount.discountCountLimit;
      return discount;
    },
  };
};
