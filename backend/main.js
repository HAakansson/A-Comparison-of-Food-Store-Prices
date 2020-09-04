const AxfoodHarvester = require("./harvesters/AxfoodHarvester");

(async () => {
  // let arr = await AxfoodHarvester.getAllProducts()
  // console.log(arr);
  // console.log(arr.length);

  // let count = 1;
  // arr.forEach(e => console.log(e, count++))

  AxfoodHarvester.getCategories("www.willys.se");
})();
