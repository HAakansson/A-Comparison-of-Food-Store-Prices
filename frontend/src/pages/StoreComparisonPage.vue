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
        :storeProducts="storeData.products"
      />
    </div>
    <button class="back-button" @click="goBackToShoppingListId">
      Tillbaks till shoppinglistan
    </button>
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

  handleScroll() {
    // console.log("x: ", window.pageXOffset, "y: ", window.pageYOffset);
    let btn = document.querySelector(".store-comparison-page .back-button");
    let placement = 10 - window.pageYOffset;
    btn.style.bottom = `${placement}px`;
  }

  goBackToShoppingListId() {
    let lastRouteShoppingId = JSON.parse(
      localStorage.getItem("lastRouteParams")
    );
    this.$router.push(`/shoppinglists/${lastRouteShoppingId}`);
  }

  mounted() {
    console.log(this.$store.state.storeComparisonArray);

    window.addEventListener("scroll", this.handleScroll);
  }

  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  }
}
</script>

<style lang="scss" scoped>
.store-comparison-page {
  margin-bottom: 2em;
  padding: 2em;
  .store-summary-container,
  .store-details-container {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(3, 30%);
    justify-content: center;
  }
  .back-button {
    &:hover {
      background: rgba(0, 0, 0, 0.8);
      opacity: 1 !important;
    }
  }
}
</style>
