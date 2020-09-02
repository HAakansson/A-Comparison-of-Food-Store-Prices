//const AxfoodHarvester = require("./harvesters/AxfoodHarvester");
const MathemHarvester = require("./harvesters/MathemHarvester");

//const mathem = new MathemHarvester()

(async () => {
  //let data = await MathemHarvester.getCategories();

  let data = await MathemHarvester.getProductsPerCategory();

  //getCleanCategories

  console.log(data);

  /*
  data.forEach((element) => {
    console.log(element.id, element.productCount)
    console.log(element.children)

  });
  */

  /*
  data.children.forEach((c) => {
    c.children.forEach((cc) => {
      console.log(cc);
    });
  });
  */
  // console.log(data);

  // let data = await AxfoodHarvester.getProducts("Apotek");
  // console.log(data);
})();
