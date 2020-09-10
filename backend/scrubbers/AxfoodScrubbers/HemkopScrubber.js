const AxfoodScrubber = require("../AxfoodScrubber")
module.exports = class HemkopScrubber extends AxfoodScrubber{
  constructor() {
    super("www.hemkop.se")
  }
}