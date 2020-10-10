<template>
  <div class="single-product">
    <div v-if="!product" class="no-product">
      <p>Ingen hittad produkt.</p>
    </div>
    <div v-else class="product-container">
      <div class="image-container">
        <img :src="product.thumbnail_url" />
      </div>
      <div class="product-info-container">
        <span class="product-text name">{{ name }}</span>
        <span class="product-text brand">{{ product.brand }}</span>
        <span class="product-text price">Styckpris: {{ price }}</span>
        <span v-if="amount > 0" class="product-text amount"
          >Önskad mängd: {{ amount }} {{ rawUnitMeasurement }}</span
        >
        <span class="product-text volume"
          >Förpackningsmängd: {{ productVolume }} {{ rawUnitMeasurement }}</span
        >
        <span class="product-text totalCost"
          >{{ requestedQuantity }} st, {{ totalCost }}</span
        >
        <span class="product-text comparison"
          >Jmf-pris: {{ comparisonPrice }} / {{ unitMeasurement }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
import CurrencyConverter from "../../assets/CurrencyConverter";

@Component
export default class SingleStoreProduct extends Vue {
  @Prop()
  product;

  get name() {
    return this.product ? this.product.name : null;
  }

  get brand() {
    return this.product ? this.product.brand : null;
  }

  get price() {
    return CurrencyConverter.convertToSwedishCurr(
      this.product ? this.product.unit_price : 0
    );
  }

  // get discountPrice() {
  //   return CurrencyConverter.convertToSwedishCurr(this.product ? this.product.discount : null);
  // }

  get comparisonPrice() {
    return CurrencyConverter.convertToSwedishCurr(
      this.product ? this.product.comparison_price : 0
    );
  }

  // get comparisonDiscountPrice() {
  //   return this.product ? this.product.discount_comparison_price : null;
  // }

  get unitMeasurement() {
    // if (true) {
    if (this.product.unit_measurement === "g") {
      return "kg";
    } else if (
      this.product.unit_measurement === "dl" ||
      this.product.unit_measurement === "ml"
    ) {
      return "l";
    } else if (this.product.unit_measurement === "p") {
      return "st";
    } else {
      return this.product.unit_measurement;
    }
    // } else {
    //   return null;
    // }
  }

  get rawUnitMeasurement() {
    return this.product ? this.product.unit_measurement : null;
  }

  get productVolume() {
    return this.product ? this.product.display_volume : null;
  }

  get requestedQuantity() {
    return this.product
      ? this.product.numberOfProducts
        ? this.product.numberOfProducts
        : 1
      : 1;
  }

  get totalCost() {
    return CurrencyConverter.convertToSwedishCurr(this.product
      ? this.product.cost
        ? this.product.cost.toFixed(2)
        : this.product.unit_price
      : 0);
  }

  get amount() {
    return this.product ? (this.product.amount ? this.product.amount : 0) : 0;
  }
}
</script>

<style lang="scss" scoped>
.single-product {
  align-items: center;
  border-bottom: 1px solid black;
  display: flex;
  justify-content: center;
  min-height: 140px;
  padding: 0.5em;

  .product-container {
    align-items: center;
    display: grid;
    grid-template-columns: 1fr 2fr;
  }

  .image-container {
    margin-right: 2em;
  }

  .product-info-container {
    display: flex;
    flex-direction: column;

    .product-text {
      font-size: 0.9em;
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
