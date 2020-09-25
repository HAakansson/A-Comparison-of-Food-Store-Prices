<template>
  <div id="shopping-lists-page">
    <div class="buttons">
      <button @click="goToCreateShoppingList">Create Shopping List</button>
    </div>
    <h2>Your Shopping Lists</h2>

    <div class="shopping-lists-container">
      <p v-if="!shoppingLists">
        You currently have no shopping lists.
      </p>
      <ShoppingList
        class="shopping-list"
        v-for="shoppingList in shoppingLists"
        :key="shoppingList.id"
        :shoppingList="shoppingList"
        @remove-shoppingList="removeShoppingList"
      />
    </div>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import ShoppingList from "../components/shopping_list_page/ShoppingList";

@Component({
  components: {
    ShoppingList,
  },
})
export default class ShoppingListPage extends Vue {
  shoppingLists = null;

  goToCreateShoppingList() {
    this.$router.push("/shoppinglists-create");
  }

  async removeShoppingList(id) {
    await this.deleteShoppingList(id);

    this.shoppingLists = this.shoppingLists.filter((list) => {
      return id !== list.id;
    });

    if (this.shoppingLists.length === 0) {
      this.shoppingLists = null;
    }
  }

  async getShoppingLists() {
    let results = await fetch("/rest/shoppingLists");
    results = await results.json();
    return results;
  }

  async deleteShoppingList(id) {
    await fetch(`/rest/shoppingLists/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  }

  async created() {
    this.shoppingLists = await this.getShoppingLists();
  }
}
</script>

<style lang="scss" scoped>
#shopping-lists-page {
  .shopping-list {
    cursor: pointer;
  }
}
</style>
