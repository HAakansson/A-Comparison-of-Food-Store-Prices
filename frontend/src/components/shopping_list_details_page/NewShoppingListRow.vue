<template>
  <form class="new-shopping-list-row-form">
    <input
      class="brand-input"
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
    <input
      class="amount-input"
      type="text"
      placeholder="Skriv in mängd..."
      v-model="amount"
    />
    <div class="unit-container">
      <span v-if="unit">{{ unit }}</span>
    </div>
    <div class="buttons">
      <button class="clear-inputs" @click.prevent="resetInputs"><span>Rensa</span><i class="material-icons">clear</i></button>
      <button class="save" @click.prevent="save"><span>Spara ny rad</span><i class="material-icons">add_circle_outline</i></button>
    </div>
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
      console.log(product);
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
  align-items: center;
  display: grid;
  grid-template-columns: 20% 20% 10% 5% 1fr;
  margin: 0 0 1em 0;
  input {
    padding: 0.5em;
  }
  .brand-unput {
    grid-column: 1/2;
  }
  .product-inut {
    grid-column: 2/3;
  }
  .amount-input {
    grid-column: 3/4;
  }
  .unit-container {
    grid-column: 4/5;
    text-align: center;
  }
  .buttons {
    grid-column: 5/6;
    display: flex;
    margin: 0 1em;
    .clear-inputs,
    .save {
      display: none;
      margin: 0 1em 0 0;
    }
  }
  &:focus-within {
    .clear-inputs,
    .save {
      align-items: center;
      display: inline-flex;
      color: white;
    }
    .clear-inputs {
      background: blue;
    }
    .save {
      background: green;
    }
  }
}
</style>
