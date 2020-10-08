<template>
  <div id="shopping-lists-page">
    <div class="buttons">
      <button class="create-shopping-list" @click="goToCreateShoppingList">
        <span>Skapa en shoppinglista</span> <i class="material-icons">create</i>
      </button>
    </div>
    <h1 class="header">Dina Shoppinglistor</h1>

    <div v-if="showSpinner" class="spinner">
      <Spinner />
    </div>
    <div v-else class="shopping-lists-container">
      <p v-if="!shoppingLists">
        You currently have no shopping lists.
      </p>
      <ShoppingList
        v-else
        v-for="shoppingList in shoppingLists"
        :key="shoppingList.id"
        :shoppingList="shoppingList"
        @remove-shoppingList="removeShoppingList"
      />
    </div>
    <button v-if="showBackButton" class="back-button" @click="backToStartPage">
      Tillbaks till startsidan
    </button>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import ShoppingList from "../components/shopping_list_page/ShoppingList";
import Spinner from "../components/Spinner";

@Component({
  components: {
    ShoppingList,
    Spinner,
  },
})
export default class ShoppingListPage extends Vue {
  shoppingLists = null;
  showSpinner = false;

  get showBackButton() {
    return this.$route.name === "ShoppingListsPage";
  }

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
    this.showSpinner = true;
    let results = await fetch("/rest/shoppingLists");
    results = await results.json();
    this.showSpinner = false;
    return results;
  }

  async deleteShoppingList(id) {
    await fetch(`/rest/shoppingLists/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  }

  backToStartPage() {
    document.querySelector(".grid-item-1 .search-field input").focus();
    this.$router.push("/");
  }

  async created() {
    this.shoppingLists = await this.getShoppingLists();
  }
}
</script>

<style lang="scss" scoped>
#shopping-lists-page {
  margin: 1em 4em;
  .header {
    text-align: center;
  }

  .spinner {
    text-align: center;
  }

  .buttons {
    display: flex;
    justify-content: center;
    .create-shopping-list {
      align-items: center;
      display: flex;
      background: green;
      color: white;
      span,
      i {
        margin: 0 5px;
      }
    }
  }

  .shopping-lists-container {
    display: grid;
    grid-template-columns: repeat(5, 210px);
    justify-content: space-between;
    row-gap: 20px;
  }
}
</style>
