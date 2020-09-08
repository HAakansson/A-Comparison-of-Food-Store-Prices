const WillysHarvestAndScrubbing = require("./harvesters/StoreHarvesters/WillysHarvester");
const HemkopHarvestAndScrubbing = require("./harvesters/StoreHarvesters/HemkopHarvester");

module.exports = class Harvesting {
  static async go() {
    new WillysHarvestAndScrubbing();
    new HemkopHarvestAndScrubbing();
  }
};
