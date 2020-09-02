const AxfoodHarvester = require("./harvesters/AxfoodHarvester");

(async () => {
  let data = await AxfoodHarvester.getCategories();
  data.children.forEach((c) => {
    c.children.forEach((cc) => {
      console.log(cc);
    });
  });
  // console.log(data);

  // let data = await AxfoodHarvester.getProducts("Apotek");
  // console.log(data);
})();
