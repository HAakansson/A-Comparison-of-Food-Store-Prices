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
    name: (x) => x.name,
    store: () => this.store.split(".")[1],
    brand: (x) => x.manufacturer,
    imageUrl: (x) => x.image && x.image.url,
    thumbnail_url: (x) => x.thumbnail && x.thumbnail.url,
    unit_price: (x) => x.priceValue,
    display_volume: (x) =>
      parseFloat(x.displayVolume.replace(/,/, ".").replace(/[a-z:\s]/g, "")),
    unitMeasurement: (x) => x.displayVolume.replace(/[ca:\d.,\s]/gi, ""),
    comparision_price: (x) => parseFloat(x.comparePrice.replace(/,/, ".")),
    comparator: (x) => x.comparePriceUnit,
    dairy: (x) => x.labels.includes("laktosfree"),
    organic: (x) => x.labels.includes("ecological"),
    gluten: (x) => x.labels.includes("glutenfree"),
    vegan: (x) => x.name.includes("vegan") || x.name.includes("Vegan"),
    extraInfo: async (x) => {
      let information = {};
      // Seems we need detailed product info for this...
      // (one fetch per product - lots of extra time :( )
      // maybe ask productOwner if Swedish/non Swedish enough?
      let rawData = await fetch(
        `https://${this.store}/axfood/rest/p/${x.code}`
      );
      let data = await rawData.json();
      information.countryOfOrigin =
        data.originCountry || data.tradeItemCountryOfOrigin;
      information.desc = data.description;
      information.vegetarian = data.breadCrumbs.some((x) =>
        x.name.match(/vegetariskt?/gi)
      );

      return information;
    },
  };
};