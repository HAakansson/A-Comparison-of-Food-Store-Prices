const AxfoodHarvester = require("./harvesters/AxfoodHarvester");
const AxfoodScrubber = require("./scrubbers/AxfoodScrubber");
const MathemHarvester = require("./harvesters/MathemHarvester");
const MathemScrubber = require("./scrubbers/MathemScrubber");

module.exports = class Harvesting {
  static async go() {
    let axHarvester = new AxfoodHarvester("www.willys.se");
    let axScrubber = new AxfoodScrubber("www.willys.se");
    let mathemHarvester = new MathemHarvester();
    let mathemScrubber = new MathemScrubber();

    let startTime = this.startTimer();
    let categories = await axHarvester.getCategories();
    let endTime = this.endTimer(startTime);
    console.log(`Done, took ${endTime}s to complete.`);

    startTime = this.startTimer();
    let categoriesMathem = await mathemHarvester.getCategories();
    endTime = this.endTimer(startTime);
    console.log(`Done, took ${endTime}s to complete.`);

    startTime = this.startTimer();
    let products = await axHarvester.getAllProducts(categories);
    endTime = this.endTimer(startTime);
    console.log(`Done, took ${endTime}s to complete.`);
    console.log("Number of products harvested: ", products.length);

    startTime = this.startTimer();
    let productsMathem = await mathemHarvester.getAllProducts(categoriesMathem);
    endTime = this.endTimer(startTime);
    console.log(`Done, took ${endTime}s to complete.`);
    console.log("Number of products harvested: ", productsMathem.length);

    startTime = this.startTimer();
    await axScrubber.scrubAll(products);
    endTime = this.endTimer(startTime);
    console.log(`Done, took ${endTime}s to complete.`);

    startTime = this.startTimer();
    await mathemScrubber.scrubAll(productsMathem);
    endTime = this.endTimer(startTime);
    console.log(`Done, took ${endTime}s to complete.`);
  }

  static startTimer() {
    return new Date().getTime();
  }
  static endTimer(startTime) {
    return (new Date().getTime() - startTime) / 1000;
  }
};
