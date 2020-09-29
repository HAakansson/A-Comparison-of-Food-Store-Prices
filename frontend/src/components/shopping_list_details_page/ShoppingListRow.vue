<template>
  <div class="shopping-list-row">
    <div class="column brand">{{ shoppingListRow.brand ? shoppingListRow.brand : "-" }}</div>
    <div class="column product">{{ shoppingListRow.product }}</div>
    <div class="column amount">{{ shoppingListRow.amount ? shoppingListRow.amount : "-"  }}</div>
    <div class="column unit">{{ shoppingListRow.unit }}</div>
    <div class="buttons">
      <button class="remove-button" @click="removeRow">
        <span>Ta bort rad</span><i class="material-icons">delete</i>
      </button>
    </div>
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
    this.$emit("row-deleted", this.shoppingListRow.id);
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
  align-items: center;
  display: grid;
  grid-template-columns: 20% 20% 10% 5% 1fr;
  margin: 0 0 1em 0;
  .column {
    border: 1px solid black;
    min-height: 36px;
    padding: 0.5em;
    text-align: center;
  }
  .buttons {
    display: flex;
    margin: 0 1em;
    .remove-button {
      align-items: center;
      display: flex;
      background: red;
      color: white;
    }
  }
}
</style>
