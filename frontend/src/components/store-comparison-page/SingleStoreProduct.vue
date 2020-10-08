<template>
  <div class="single-product">
    <div class="image-container">
      <img :src="product.thumbnail_url" />
    </div>
    <div class="product-info-container">
      <span class="product-text name">Namn: {{ name }}</span>
      <span class="product-text brand">Märke: {{ product.brand }}</span>
      <span class="product-text price">Pris: {{ product.unit_price }} kr</span>
      <span class="product-text comparison"
        >Jämförelsepris: {{ product.comparison_price }} kr / {{ unit }}</span
      >
    </div>
  </div>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class SingleStoreProduct extends Vue {
  @Prop()
  product;

  get name() {
    return this.product.name;
  }

  get brand() {
    return this.product.brand;
  }

  get price() {
    if (this.product.discount_price) {
      document
        .querySelector(".single-product .product-text price")
        .classList.add("red-text");
      return this.product.discount_price;
    } else {
      document
        .querySelector(".single-product .product-text price")
        .classList.remove("red-text");
      return this.product.unit_price;
    }
  }

  get comparisonPrice() {
    if (this.product.discount_comparison_price) {
      document
        .querySelector(".single-product .product-text comparison")
        .classList.add("red-text");
      return this.product.discount_comparison_price;
    } else {
      document
        .querySelector(".single-product .product-text comparison")
        .classList.remove("red-text");
      return this.product.discount_price;
    }
  }

  get unit() {
    if (this.product.unit_measurement === "g") {
      return "kg";
    } else if (this.product.unit_measurement === "dl") {
      return "l";
    } else if (this.product.unit_measurement === "p") {
      return "st";
    } else {
      return this.product.unit_measurement;
    }
  }
}
</script>

<style lang="scss" scoped>
.single-product {
  align-items: center;
  border-bottom: 1px solid black;
  display: flex;
  padding: 0.5em;

  .image-container {
    margin-right: 2em;
  }

  .product-info-container {
    display: flex;
    flex-direction: column;

    .product-text {
      font-size: 1em;
      font-weight: bold;
      .red-text {
        color: red;
      }
    }
  }

  &:last-child {
    border-bottom: none;
  }
}
</style>
