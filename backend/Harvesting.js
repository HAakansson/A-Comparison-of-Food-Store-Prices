const WillysHarvester = require("./harvesters/AxFoodHarvesters/WillysHarvester");
const WillysScrubber = require('./scrubbers/AxfoodScrubbers/WillysScrubber')
const HemkopHarvester = require("./harvesters/AxFoodHarvesters/HemkopHarvester");
const HemkopScrubber = require('./scrubbers/AxfoodScrubbers/HemkopScrubber')
const MathemHarvester = require("./harvesters/MathemHarvester");
const MathemScrubber = require("./scrubbers/MathemScrubber");

module.exports = class Harvesting {
  static async go() {
    let willysHarvester = new WillysHarvester();
    let willysScrubber = new WillysScrubber();
    let hemkopHarvester = new HemkopHarvester();
    let hemkopScrubber = new HemkopScrubber();
    let mathemHarvester = new MathemHarvester();
    let mathemScrubber = new MathemScrubber();

 
    let startTime = this.startTimer();
    let categoriesMathem = await mathemHarvester.getCategories();
    let categoriesWillys = await willysHarvester.getCategories();
    let categoriesHemkop = await hemkopHarvester.getCategories();
    let endTime = this.endTimer(startTime);
    console.log(`Done, harvesting categories took ${endTime}s to complete.`);

    startTime = this.startTimer();
    let productsMathem = await mathemHarvester.getAllProducts(categoriesMathem);
    let productsWillys = await willysHarvester.getAllProducts(categoriesWillys);
    let productsHemkop = await hemkopHarvester.getAllProducts(categoriesHemkop);
    endTime = this.endTimer(startTime);
    console.log(`Done, getting all products took ${endTime}s to complete.`);
    console.log(`Number of products harvested from: Willys - ${productsWillys.length}, Hemköp - ${productsHemkop.length} and Mathem - ${productsMathem.length}`);

    startTime = this.startTimer();
    await mathemScrubber.scrubAll(productsMathem);
    endTime = this.endTimer(startTime);
    console.log(`Done, scrubbing Mathem took ${endTime}s to complete.`);

    startTime = this.startTimer();
    await willysScrubber.scrubAll(productsWillys);
    endTime = this.endTimer(startTime);
    console.log(`Done, scrubbing Willys took ${endTime}s to complete.`);

    startTime = this.startTimer();
    await hemkopScrubber.scrubAll(productsHemkop);
    endTime = this.endTimer(startTime);
    console.log(`Done, scrubbing Hemköp took ${endTime}s to complete.`);   
  }

  static startTimer() {
    return new Date().getTime();
  }
  static endTimer(startTime) {
    return (new Date().getTime() - startTime) / 1000;
  }
};
