//const AxfoodHarvester = require("./harvesters/AxfoodHarvester");
const MathemHarvester = require("./harvesters/MathemHarvester");

(async () => {

  let data = await MathemHarvester.getAllProducts();

  console.log(data)

})();
