<template>
  <div class="single-product">
    <div class="image-container">
      <img :src="product.image" />
    </div>
    <div class="product-info-container">
      <span class="product-text">Namn: {{ product.name }}</span>
      <span class="product-text">Märke: {{ product.brand }}</span>
      <span class="product-text">Pris: {{ product.unit_price }} kr</span>
    </div>
  </div>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class SingleStoreProduct extends Vue {
  @Prop()
  product;
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
      font-size: 1.3em;
      font-weight: bold;
    }
  }

  &:last-child {
    border-bottom: none;
  }
}
</style>
