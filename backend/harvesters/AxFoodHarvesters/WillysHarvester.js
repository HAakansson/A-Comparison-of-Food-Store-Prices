const AxfoodHarvester = require("../AxfoodHarvester");

module.exports = class WillysHarvester extends AxfoodHarvester {
  constructor() {
    super('www.willys.se')
  }
};
