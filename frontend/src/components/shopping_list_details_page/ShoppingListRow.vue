<template>
  <div class="shopping-list-row">
    <input
      class="readonly"
      type="text"
      placeholder="Skriv in varumärke..."
      readonly
      v-model="brand"
    />
    <input
      class="readonly"
      type="text"
      placeholder="Skriv in produkt..."
      readonly
      v-model="product"
    />
    <input
      class="readonly"
      type="text"
      placeholder="Skriv in mängd..."
      readonly
      v-model="amount"
    />
    <span>{{ shoppingListRow.unit }}</span>
    <button class="remove" @click="removeRow">Ta bort rad</button>
  </div>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ShoppingListRow extends Vue {
  @Prop({
    type: Object,
    require: true,
  })
  shoppingListRow;

  get brand() {
    return this.shoppingListRow.brand;
  }
  get product() {
    return this.shoppingListRow.product;
  }
  get amount() {
    return this.shoppingListRow.amount;
  }

  async removeRow() {
    await this.deleteRowFromList(this.shoppingListRow.id);
    this.$emit("row-deleted", this.shoppingListRow.id)
  }

  async deleteRowFromList(id) {
    await fetch(`/rest/shoppingList/row/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  }
}
</script>

<style lang="scss" scoped>
.shopping-list-row {
  .readonly {
    background: lightgray;
    border-color: lightgray;
  }
}
</style>
