//What do we want to save in the db?
//do we want to get ahold of the nutritionlist as well? Add to db? Fetched same as country and desc.

// WILLYS && Hemköp
// name = name **
//brand = manufacturer **
// countryOfOrigin = tradeItemCountryOfOrigin **, needs to be fetched from https://www.willys.se/axfood/rest/p/+code of single product+_ST?avoidCache=1599205595815
// desc = description **, also needs to be fetched from https://www.willys.se/axfood/rest/p/+code of single product+_ST?avoidCache=1599205595815

// displayVolume = displayVolume **, maybe convert if its in gram?
// Store = hardcode it
// unit_Price = priceValue **
// Comparator = comparePriceUnit **
//Comparision_price = comparePrice **

//check dietary restrictions
//Dairy = ** look for label "laktosfree"
//Organic/ecologic =  ** Look for label "ecological" and maybe "eu_ecological"
//Vegan = ** doesnt seem to have a label, only check for vegan in name??
//Gluten = ** look for label "glutenfree"
//Vegetarian: ** Its own category. Either check if product is in there or fetch https://www.willys.se/axfood/rest/p/+code of single product+_ST?avoidCache=1599205595815
//and look if it says its vegetarian in the breadcrumb => name field.

//images
//image url : image.url **
//thumbnail: thumbnail.url **
//-----------------------------------------------------------------------------------------

const fetch = require("node-fetch");
const Scrubber = require("./Scrubber");

module.exports = class AxfoodScrubber extends Scrubber {
  constructor(store) {
    super(store);
  }
  translateSchema = {
    code: (x) => x.code,
    name: (x) => x.name,
    store: () => this.store.split(".")[1],
    brand: (x) => x.manufacturer || "Unknown",
    image_url: (x) => x.image && x.image.url,
    thumbnail_url: (x) => x.thumbnail && x.thumbnail.url,
    unit_price: (x) => x.priceValue,
    display_volume: (x) => {
      return x.displayVolume !== null && x.displayVolume !== ""
        ? parseFloat(x.displayVolume.replace(/,/, ".").replace(/[a-z:\s]/g, ""))
        : "Unknown";
    },
    unit_measurement: (x) => {
      return x.displayVolume !== null && x.displayVolume !== ""
        ? x.displayVolume.replace(/[ca:\d.,\s]/gi, "")
        : "Unknown";
    },
    comparison_price: (x) => {
      let price;
      if (x.comparePrice !== null && x.comparePrice !== "") {
        price = parseFloat(x.comparePrice.replace(/,/, "."));
        
      }
      else {
        price = "Unknown"
      }
      return price;
    },
    comparator: (x) => x.comparePriceUnit !== null && x.comparePriceUnit !== "" ? x.comparePriceUnit : "Unknown",
    lactosefree: (x) =>
      x.labels.length > 0 ? x.labels.includes("laktosfree") : false,
    organic: (x) =>
      x.labels.length > 0 ? x.labels.includes("ecological") : false,
    gluten: (x) =>
      x.labels.length > 0 ? x.labels.includes("glutenfree") : false,
    extra_info: async (x) => {
      let information = {};
      // Seems we need detailed product info for this...
      // (one fetch per product - lots of extra time :( )
      let data;
      let rawData = await fetch(
        `https://${this.store}/axfood/rest/p/${x.code}`
      ).catch((err) => {
        console.log(rawData);
        testString = JSON.stringify(rawData)
        console.log(testString);
        console.log(err);
      });
      // If article number in deep article info does not match the article number from shallow article info, this will stop the operation and go to the next iteration, check scrubber class for more info.
      if (rawData.status === 400) {
        return;
      }
      data = await rawData.json();
      information.country_of_origin = data.originCountry
        ? data.originCountry
        : data.tradeItemCountryOfOrigin;
      if (!information.country_of_origin) {
        information.country_of_origin = "Unknown";
      }
      information.desc = data.description;
      information.vegan = data.name.includes("vegan") || data.name.includes("Vegan") || data.dietTypeInformation.includes("Vegan") || data.dietTypeInformation.includes("vegan");
      
      information.vegetarian = data.breadCrumbs.some((x) =>
        x.name.match(/vegetariskt?/gi) || data.dietTypeInformation.includes("Vegetarian") || data.dietTypeInformation.includes("vegetarian") || information.vegan == true
      );
      data.breadCrumbs.pop();
      information.categories = data.breadCrumbs.map((x) => {
        return {
          name: x.name,
          categoryCode: x.categoryCode,
        };
      });
      return information;
    },
    discountProperties: (x) => {

      let discount = {};


      // discount_price & discount_comarison_price & discount_quantity & discount_max_limit
      if (x.potentialPromotions.length > 0) {
        discount.discount_price = parseFloat(x.potentialPromotions[0].rewardLabel.replace(/[,]/, ".").replace(/[a-z:\s/]/g, ""));
        discount.discount_comparison_price = parseFloat(x.potentialPromotions[0].comparePrice.replace(/[,]/, ".").replace(/[a-z:\s/]/g, ""));
        discount.discount_max_limit = x.potentialPromotions[0].redeemLimitLabel !== null ? parseFloat(x.potentialPromotions[0].redeemLimitLabel.replace(/[\D:\s]/g, "")) : null;
        discount.discount_quantity = x.potentialPromotions[0].conditionLabel !== null && x.potentialPromotions[0].conditionLabel !== "" ? x.potentialPromotions[0].conditionLabel.includes("Spara") ? null : parseFloat(x.potentialPromotions[0].conditionLabel.replace(/[\D:\s]/g, "")) : null;
        discount.discount_requires_membership = x.potentialPromotions[0].campaignType !== null && x.potentialPromotions[0].campaignType !== "" ? x.potentialPromotions[0].campaignType.includes("LOYALTY") ? true : false : false;
      } else {
        discount.discount_price = null;
        discount.discount_comparison_price = null;
        discount.discount_max_limit = null;
        discount.discount_quantity = null;
        discount.discount_requires_membership = false;
      }
      return discount;
    }


  


  };
};
