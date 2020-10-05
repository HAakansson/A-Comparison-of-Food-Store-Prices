<template>
  <div class="store-comparison-page">
    <div class="store-summary-container">
      <StoreSummary
        v-for="(storeInfo, i) in storeComparisonArray"
        :key="i"
        :storeInfo="storeInfo"
      />
    </div>
    <div class="store-details-container">
      <StoreProducts
        v-for="(storeData, i) in storeComparisonArray"
        :key="i"
        :storeData="storeData"
      />
    </div>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import StoreSummary from "../components/store-comparison-page/StoreSummary";
import StoreProducts from "../components/store-comparison-page/StoreProducts";

@Component({
  components: {
    StoreSummary,
    StoreProducts,
  },
})
export default class StoreComparisonPage extends Vue {
  get storeComparisonArray() {
    return this.$store.state.storeComparisonArray;
  }
}
</script>

<style lang="scss" scoped>
.store-comparison-page {
  padding: 2em;
  .store-summary-container,
  .store-details-container {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(3, 30%);
    justify-content: center;
  }
}
</style>
