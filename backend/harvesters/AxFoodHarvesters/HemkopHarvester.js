const AxfoodHarvester = require("../AxfoodHarvester");

module.exports = class HemkopHarvester extends AxfoodHarvester {
  constructor() {
    super('www.hemkop.se')
  }
};
