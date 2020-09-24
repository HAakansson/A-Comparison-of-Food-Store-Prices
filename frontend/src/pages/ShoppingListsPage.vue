<template>
  <div id="shopping-lists-page">
    <div class="buttons">
      <button @click="goToCreateShoppingList">Create Shopping List</button>
    </div>
    <h2>Your Shopping Lists</h2>

    <div class="shopping-lists-container">
      <p v-if="shoppingList.length === 0">
        You currently have no shopping lists.
      </p>
      <ShoppingList
        class="shopping-list"
        v-for="shoppingList in shoppingList"
        :key="shoppingList.id"
        :shoppingList="shoppingList"
        @remove-shoppingList="removeShoppingList"
        @click="goToShoppingListDetails"
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
  get shoppingList() {
    return this.$store.state.shoppingLists;
  }

  goToCreateShoppingList() {
    this.$router.push("/shoppinglists-create");
  }

  removeShoppingList(id) {
    console.log("before", this.$store.state.shoppingLists);
    let updatedShoppingLists = this.$store.state.shoppingLists.filter((e) => {
      return e.id !== id;
    });

    this.$store.commit("updateShoppingLists", updatedShoppingLists);
    console.log("after", this.$store.state.shoppingLists);
  }

  goToShoppingListDetails() {}
}
</script>

<style lang="scss" scoped>
#shopping-lists-page {
  .shopping-list {
    cursor: pointer;
  }
}
</style>
