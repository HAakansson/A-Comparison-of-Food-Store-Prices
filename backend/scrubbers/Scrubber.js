module.exports = class Scrubber {
  constructor(store) {
    this.store = store;
  }
  async scrubOne(product) { 
    let scrubbed = {};
    let tschema = this.translateSchema;
    
    for (let key in tschema) {
      let scrubFunc = tschema[key];
      scrubbed[key] = await scrubFunc(product);
    }
    return scrubbed;
  }

   async scrubAll(products) {
    let scrubbed = [];
    for (let product of products) {
      scrubbed.push(await this.scrubOne(product));
    }
    console.log(scrubbed);

    //  return scrubbed;
  }
};