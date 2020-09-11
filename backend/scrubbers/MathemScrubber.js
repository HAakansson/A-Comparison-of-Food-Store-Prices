const Scrubber = require("./Scrubber");

module.exports = class MatHemScrubber extends Scrubber {
  constructor() {
    super("www.mathem.se");
  }

  translateSchema = {
    code: (x) => x.id,
    name: (x) => x.name,
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
      return x.badges.length > 0
        ? x.badges.some((y) => {
            return y.name === "Laktosfri";
          })
        : false;
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
    extra_info: (x) => {
      let information = {};
      information.country_of_origin = x.origin ? x.origin.name : "Unknown";
      information.desc = x.fullName;
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
