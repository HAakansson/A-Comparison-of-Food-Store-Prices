<template>
  <div class="store-products">
    <SingleStoreProduct
      v-for="product in storeProducts"
      :key="product.id"
      :product="product"
    />
  </div>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
import SingleStoreProduct from "./SingleStoreProduct";

@Component({
  components: {
    SingleStoreProduct,
  },
})
export default class StoreProducts extends Vue {
  @Prop()
  storeProducts;
}
</script>

<style lang="scss" scoped>
.store-products {
  background: white;
  border: 2px solid black;
  border-radius: 10px;
  margin-top: 1em;
  padding: 0.5em;
}
</style>
