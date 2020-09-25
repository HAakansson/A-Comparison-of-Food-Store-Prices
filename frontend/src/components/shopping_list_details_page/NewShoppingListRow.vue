<template>
  <form class="new-shopping-list-row-form">
    <input
      list="brands"
      type="text"
      placeholder="Skriv in varumärke..."
      v-model="brand"
    />
    <input
      class="product-input"
      list="products"
      placeholder="Skriv in produkt..."
      v-model="product"
      @blur="getProductUnitMeasurement"
    />
    <input type="text" placeholder="Skriv in mängd..." v-model="amount" />
    <span v-if="unit">{{ unit }}</span>
    <button class="clear-inputs" @click.prevent="resetInputs">Rensa</button>
    <button class="save" @click.prevent="save">Spara ny rad</button>
    <p v-if="feedback" class="feedback">{{ feedback }}</p>

    <datalist id="brands">
      <option v-for="brand in brands" :key="brand" :value="brand" />
    </datalist>
    <datalist id="products">
      <option v-for="(product, i) in products" :key="i" :value="product.name" />
    </datalist>
  </form>
</template>

<script>
import { Vue, Component, Watch } from "vue-property-decorator";

@Component
export default class NewShoppingListRow extends Vue {
  brand = null;
  brands = null;
  product = null;
  products = null;
  amount = null;
  unit = null;
  feedback = null;

  @Watch("brand")
  async onBrandChange(value) {
    let brandResults = await this.getBrands(value);
    this.brands = brandResults;
  }

  @Watch("product")
  async onProductChange(value) {
    let productResults = await this.getProducts(value);
    this.products = productResults;
  }

  getProductUnitMeasurement(event) {
    if (this.products) {
      let product = this.products.find((p) => {
        return p.name === event.target.value;
      });
      this.unit = product.unit_measurement;
    } else {
      this.unit = null;
    }
  }

  resetInputs() {
    this.brand = null;
    this.product = null;
    this.amount = null;
    this.unit = null;
  }

  setUnit(e) {
    console.log(e);
  }

  async getBrands(brandString) {
    let brandResults = await fetch(`/rest/brandSuggestions?b=${brandString}`);
    brandResults = await brandResults.json();
    return brandResults;
  }

  async getProducts(productString) {
    let productResults = await fetch(
      `/rest/productSuggestions?s=${productString}`
    );
    productResults = await productResults.json();
    return productResults;
  }

  async save() {
    let rowInfo = {
      brand: this.brand,
      product: this.product,
      amount: this.amount,
      unit: this.unit,
    };
    if (!rowInfo.product) {
      this.feedback = "You must enter a product...";
      setTimeout(() => {
        this.feedback = null;
      }, 2000);
      return;
    }
    let resultId = await this.saveRowToList(rowInfo);
    this.$emit("new-row-added", resultId);
    this.resetInputs();
  }

  async saveRowToList(rowInfo) {
    let resultId = await fetch(
      `/rest/shoppingLists/${this.$route.params.shoppingListId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rowInfo),
      }
    );
    resultId = await resultId.json();
    return resultId;
  }

  created() {}
}
</script>

<style lang="scss" scoped>
.new-shopping-list-row-form {
  .clear-inputs,
  .save {
    display: none;
  }
  &:focus-within {
    .clear-inputs,
    .save {
      display: inline;
    }
  }
}
</style>
