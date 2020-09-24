<template>
  <div id="create-shopping-list-page">
    <form class="shopping-list-info">
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
import { v4 as uuid4 } from "uuid";

@Component
export default class createShoppingListPage extends Vue {
  shoppingListName = "";
  creator = "";
  feedback = "";

  resetForm() {
    document.querySelector(".shopping-list-info").reset();
  }

  saveList() {
    if (!this.shoppingListName) {
      this.feedback = "Du måste ange ett namn på din shoppinglista...";
      setTimeout(() => {
        this.feedback = "";
      }, 2000);
    } else {
      this.$store.commit("addToShoppingLists", {
        id: uuid4(),
        name: this.shoppingListName,
        creator: this.creator,
        content: [],
      });
      this.$router.push("/shoppinglists");
    }
  }

  mounted() {
    document.querySelector("#shopping-list-name").focus();
  }

  backToShoppingListsPage() {
    this.$router.push("/shoppinglists");
  }
}
</script>

<style lang="scss" scoped></style>
