const AxfoodHarvester = require("./harvesters/AxfoodHarvester");
const AxfoodScrubber = require("./scrubbers/AxfoodScrubber");

(async () => {
  // let arr = await AxfoodHarvester.getAllProducts()
  // console.log(arr);
  // console.log(arr.length);

  // let count = 1;
  // arr.forEach(e => console.log(e, count++))

  // AxfoodHarvester.getCategories("www.willys.se");
  let axScrub = new AxfoodScrubber('www.willys.se');
  let products = await AxfoodHarvester.getProducts(
    "www.willys.se",
    "Kott-chark-och-fagel/Fagel/Fryst-fagel"
  );

  let result = await axScrub.scrubAll(products);
})();
