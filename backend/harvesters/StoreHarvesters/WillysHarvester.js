const start = require("./StartHarvestAndScrubbing");
const AxfoodHarvester = require("../AxfoodHarvester");

module.exports = class WillysHarvester extends AxfoodHarvester {
  constructor() {
    super()
    start.startHarvestAndScrubbing("willys");
  }
};
