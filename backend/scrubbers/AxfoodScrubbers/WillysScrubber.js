const AxfoodScrubber = require("../AxfoodScrubber")
module.exports = class WillysScrubber extends AxfoodScrubber{
  constructor() {
    super("www.willys.se")
  }
}