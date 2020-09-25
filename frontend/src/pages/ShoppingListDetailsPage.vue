<template>
  <div id="shopping-list-details">
    <div v-if="shoppingList" class="shopping-list-container">
      <ShoppingListRow
        v-for="row in shoppingList"
        :key="row.id"
        :shoppingListRow="row"
        @row-deleted="deleteRowFromShoppingList"
      />
      <NewShoppingListRow
        :shoppingListId="shoppingListId"
        @new-row-added="updateShoppingList"
      />
    </div>
    <div v-else>
      <p>
        Du har för tillfället inget sparat på denna inköpslista. Lägg till
        nedan...
      </p>
      <NewShoppingListRow
        :shoppingListId="shoppingListId"
        @new-row-added="updateShoppingList"
      />
    </div>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import ShoppingListRow from "../components/shopping_list_details_page/ShoppingListRow";
import NewShoppingListRow from "../components/shopping_list_details_page/NewShoppingListRow";

@Component({
  components: {
    ShoppingListRow,
    NewShoppingListRow,
  },
})
export default class ShoppingListDetailsPage extends Vue {
  shoppingList = [];
  brand = "";
  product = "";
  amount = "";

  get shoppingListId() {
    return this.$route.params.shoppingListId;
  }

  async updateShoppingList(newRowId) {
    let result = await fetch(`/rest/shoppingLists/row/${newRowId}`);
    result = await result.json();
    this.shoppingList.push(result);
  }

  deleteRowFromShoppingList(rowId) {
    this.shoppingList = this.shoppingList.filter((item) => {
      return rowId !== item.id;
    });
  }

  async getSingleShoppingList(shoppingListId) {
    let results = await fetch(`/rest/shoppingLists/${shoppingListId}`);
    results = await results.json();
    return results;
  }

  async created() {
    let results = await this.getSingleShoppingList(this.shoppingListId);
    if (results.length !== 0) {
      this.shoppingList = results;
    }
  }
}
</script>

<style lang="scss" scoped></style>
