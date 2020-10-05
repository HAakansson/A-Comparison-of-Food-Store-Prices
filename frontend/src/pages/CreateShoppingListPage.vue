<template>
  <div id="create-shopping-list-page">
    <form class="shopping-list-info-form">
      <label for="shopping-list-name">Shoppinglistans namn: </label>
      <input
        id="shopping-list-name"
        v-model="shoppingListName"
        @keyup.enter.prevent="saveList"
        type="text"
        placeholder="Skriv in namn..."
      />
      <label for="shopping-list-creator">Shoppinglistans skapare: </label>
      <input
        id="shopping-list-creator"
        type="text"
        v-model="creator"
        placeholder="Skriv in skapare..."
      />
      <button @click.prevent="resetForm">Rensa</button>
      <button @click.prevent="saveList">Spara</button>
      <button @click.prevent="backToShoppingListsPage">Tillbaka</button>
      <p v-if="feedback">{{ feedback }}</p>
    </form>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";

@Component
export default class createShoppingListPage extends Vue {
  shoppingListName = "";
  creator = "";
  feedback = "";

  resetForm() {
    this.shoppingListName = "";
    this.createShoppingList = "";
  }

  async saveList() {
    if (!this.shoppingListName) {
      this.feedback = "Du måste ange ett namn på din shoppinglista...";
      setTimeout(() => {
        this.feedback = "";
      }, 2000);
    } else {
      let newShoppingList = {
        name: this.shoppingListName,
        creator: this.creator,
      };

      let newShoppingListId = await this.createShoppingList(newShoppingList);
      this.$router.push(`/shoppinglists/${newShoppingListId}`);
    }
  }

  async createShoppingList(newShoppingList) {
    let result = await fetch("/rest/shoppingLists-create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newShoppingList),
    });

    result = await result.json();
    return result;
  }

  backToShoppingListsPage() {
    this.$router.push("/shoppinglists");
  }

  mounted() {
    document.querySelector("#shopping-list-name").focus();
  }
}
</script>

<style lang="scss" scoped></style>
