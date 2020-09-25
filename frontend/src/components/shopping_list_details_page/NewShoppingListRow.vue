<template>
  <form class="new-shopping-list-row-form">
    <input type="text" placeholder="Skriv in varumärke..." v-model="brand" />
    <input type="text" placeholder="Skriv in produkt..." v-model="product" />
    <input type="text" placeholder="Skriv in mängd..." v-model="amount" />
    <span>unit</span>
    <button class="clear-inputs" @click.prevent="resetInputs">Rensa</button>
    <button class="save" @click.prevent="save">Spara ny rad</button>
    <p v-if="feedback" class="feedback">{{ feedback }}</p>
  </form>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";

@Component
export default class NewShoppingListRow extends Vue {
  brand = null;
  product = null;
  amount = null;
  unit = null;
  feedback = null;

  resetInputs() {
    this.brand = null;
    this.product = null;
    this.amount = null;
    this.unit = null;
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
