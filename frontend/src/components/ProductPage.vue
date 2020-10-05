<template>
<div class=products>
<div class="grid-container">
<div class="grid-item-1">
 <img class="productImage" :src="product.image_url">
</div>
<div class="grid-item-2">
<h1 class="productName">{{product.name}}</h1>
<p class="productBrand">{{product.display_volume}}{{product.unit_measurement}} {{product.brand}}</p>
  <p class="description">{{product.description}}</p>
  <p class="membership">{{requiresMembership}}</p>
  <p class="discount-label">{{discountLabel}}</p>
  <p class="price" :class="{discount: product.discount_price}">{{price}}:-</p>
  <p class="comp-price">Jmf pris {{comparisonPrice}}:- /{{product.comparator}}</p>
</div>
</div>
</div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ProductPage extends Vue {
  product = null;


   async getProductById(id) {
     let result = await fetch(`/rest/products/${id}`);
    this.product = await result.json();
    console.log(this.product);
    //this.$store.state.products = result;
  }
   created(){
     console.log('in created');
   this.getProductById(this.$route.params.productId);
    }

    get price() {
  this.product.unit_price = this.setDecimalNumber(this.product.unit_price);
  this.product.discount_price = this.setDecimalNumber(this.product.discount_price);

  if (this.product.discount_quantity !== null && this.product.discount_quantity < 99) {
      return this.product.discount_price ? (this.product.discount_price * this.product.discount_quantity).toFixed(2) : this.product.unit_price;    
  } else {
      return this.product.discount_price ? this.product.discount_price : this.product.unit_price;
  }
}

get discountLabel() {

  if (this.product.discount_quantity === null) { return ""; }


  if (this.product.discount_quantity > 99)
  {
    return `Handla för minst ${this.product.discount_quantity}`;  
  } else {
    return `${this.product.discount_quantity} för`;
  }
}

get comparisonPrice() {

  this.product.discount_comparison_price = this.setDecimalNumber(this.product.discount_comparison_price);
  this.product.comparison_price = this.setDecimalNumber(this.product.comparison_price);

  return this.product.discount_comparison_price ? this.product.discount_comparison_price : this.product.comparison_price;
}


get requiresMembership() {

  if (this.product.discount_requires_membership === 1) { return "Kräver medlemskap"; }
  else { return ""; }

}

setDecimalNumber(price) {
  
  
  let regex = /\d{1,4}[.,]\d{1}$/;
  return regex.test(price) ? price + "0" : price;
}
}

</script>

<style scoped lang="scss">
.products {
  background-color: white;
  margin: 10px;
  padding-top: 15px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  text-align: center;
  width: 50vw;
  height: 50vh;
  margin: auto;
  margin-top: 30px;
  flex-direction: column;
}

.productImage {
  max-width: 198px;
  max-height: 198px;
  object-fit: contain;
}

.grid-item-1 {
  grid-column: 1/3;
  grid-row: 1/2;
  margin-top: 50px;
}

.grid-item-2 {
  grid-column: 3/5;
  grid-row: 1/2;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;

}

.productName {
  margin-bottom: 0;
  padding-right: 20px;
}

.productBrand {
  margin-top: 0;
}

.price {
  font-size: 1.3rem;
  margin: 0px;
  font-weight: bold;
}

.comp-price {
  margin-top: 0px;
}

.discount-label {
  margin-bottom: 0px;
}

.description {
  padding-right: 20px;
}

.membership {
  font-style: italic;
}

</style>