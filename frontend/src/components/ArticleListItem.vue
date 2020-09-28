<template>
  <div class="card">
    <svg v-if="isSwedish" class="swedish-flag" height="25" width="25">    
      <image href="https://upload.wikimedia.org/wikipedia/en/4/4c/Flag_of_Sweden.svg" height="25" width="25"/>
    </svg>
    <img :src="article.thumbnail_url">
    <div class="container">
      <h4 class="article"><b>{{article.name}}</b></h4>
      <p class="brand">{{article.brand !== "Unknown" ? article.brand : ""}} {{article.display_volume !== "Unknown" ? article.display_volume : ""}} {{article.unit_measurement !== "Unknown" ? article.unit_measurement : ""}}</p>
      <p class="membership">{{requiresMembership}}</p>
      <p class="discount-label">{{discountLabel}}</p>
      <p class="price" :class="{discount: article.discount_price}">{{price}}:-</p>
      <p class="comp-price">Jmf pris {{comparisonPrice}}:- /{{article.comparator}}</p>
      <div class="store-container">
        <p class="store">{{article.store}}</p>
      </div>
    </div>
  </div>
</template>


<script>
import { Vue, Component, Prop } from "vue-property-decorator";


@Component
export default class ArticleListItem extends Vue {


get isSwedish() {
  return this.article.country_of_origin === "Sweden" || this.article.country_of_origin === "Sverige" ? true : false;
}

get price() {

  this.article.unit_price = this.setDecimalNumber(this.article.unit_price);
  this.article.discount_price = this.setDecimalNumber(this.article.discount_price);

  if (this.article.discount_quantity !== null && this.article.discount_quantity < 99) {
      return this.article.discount_price ? (this.article.discount_price * this.article.discount_quantity).toFixed(2) : this.article.unit_price;    
  } else {
      return this.article.discount_price ? this.article.discount_price : this.article.unit_price;
  }
}

get discountLabel() {

  if (this.article.discount_quantity === null) { return ""; }


  if (this.article.discount_quantity > 99)
  {
    return `Handla för minst ${this.article.discount_quantity}`;  
  } else {
    return `${this.article.discount_quantity} för`;
  }
}

get comparisonPrice() {

  this.article.discount_comparison_price = this.setDecimalNumber(this.article.discount_comparison_price);
  this.article.comparison_price = this.setDecimalNumber(this.article.comparison_price);

  return this.article.discount_comparison_price ? this.article.discount_comparison_price : this.article.comparison_price;
}


get requiresMembership() {

  if (this.article.discount_requires_membership === 1) { return "Kräver medlemskap"; }
  else { return ""; }

}

setDecimalNumber(price) {
  
  
  let regex = /\d{1,4}[.,]\d{1}$/;
  return regex.test(price) ? price + "0" : price;
}





@Prop({
  type: Object, 
  required: true 
}) 
article; 



onCreate() {
  console.log("ARticle", this.article);
}

}



</script>

<style lang="scss" scoped>
.card {
  background-color: white;
  margin: 10px;
  padding-top: 15px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  text-align: center;
  width: 20%;
  position: relative;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  

  .swedish-flag {
    position: absolute;
    top: 7px;
    right: 7px;
  }
}

.card img {
object-fit: contain;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

.container {
  padding: 2px 16px;
  text-align: start;
}

.discount {
  color: red;
}

.article {
  padding-top: 15px; 
  //white-space: nowrap;
  // word-wrap: break-word;
  font-size: 1rem;
  margin: 0;
}

.brand {
  padding-top: 2px;
  margin: 0;
  font-size: 0.9rem;
}

.price {
  padding-top: 0px;
  margin: 0;
}

.comp-price {
  margin: 0;
  font-size: 0.9rem;
  color: #5c5c5c;
}

.discount-label {
  margin-bottom: 0;
  padding-bottom: 0;
}


.store-container {
  position: relative;
  bottom: 0;

}

.store {
  background-color: #5c5c5c;
  padding-top: 10px;
  color: white;
  height: 35px;
  text-align: center;
}

.membership {
  font-size: 0.9rem;
  font-style: italic;
}

@media (max-width: 992px) {
  .card {
    width: 25%;
  }
}

@media (max-width: 600px) {
  .card {
    width: 50%;
  }
}


</style>