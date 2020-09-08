const AxfoodHarvester = require("../AxfoodHarvester");
const start = require("./StartHarvestAndScrubbing");

module.exports = class HemkopHarvester extends AxfoodHarvester {
  constructor() {
    super()
    start.startHarvestAndScrubbing("hemkop");
  }
};
