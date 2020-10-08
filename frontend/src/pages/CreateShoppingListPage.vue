<template>
  <div id="create-shopping-list-page">
    <form class="shopping-list-info-form">
      <div class="form-image">
        <i class="material-icons">receipt_long</i>
      </div>
      <div class="form-name">
        <label for="shopping-list-name">Shoppinglistans namn</label>
        <input
          id="shopping-list-name"
          v-model="shoppingListName"
          @keyup.enter.prevent="saveList"
          type="text"
          placeholder="Skriv in namn..."
        />
      </div>
      <div class="form-creator">
        <label for="shopping-list-creator">Shoppinglistans skapare</label>
        <input
          id="shopping-list-creator"
          type="text"
          v-model="creator"
          placeholder="Skriv in skapare..."
        />
      </div>
      <div class="form-buttons">
        <button class="back" @click.prevent="backToShoppingListsPage">
          Tillbaka
        </button>
        <button class="reset" @click.prevent="resetForm">Rensa</button>
        <button class="save" @click.prevent="saveList">Spara</button>
        <p v-if="feedback">{{ feedback }}</p>
      </div>
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

<style lang="scss" scoped>
#create-shopping-list-page {
  .shopping-list-info-form {
    align-items: center;
    background: white;
    border: 2px solid black;
    border-radius: 20px;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 10%;
    height: 400px;
    margin: 0 auto;
    margin-top: 2em;
    padding: 1em;
    text-align: center;
    width: 400px;

    label {
      font-size: 1.5em;
      margin-bottom: 0.6em;
    }

    input {
      font-size: 1.2em;
    }

    .form-image {
      i {
        color: green;
        font-size: 6em;
      }
    }
    .form-name,
    .form-creator {
      display: flex;
      flex-direction: column;
    }

    .form-buttons {
      display: flex;
      justify-content: space-around;

      .back,
      .reset,
      .save {
        color: white;
        width: 30%;
      }

      .back {
        background: red;
      }

      .reset {
        background: blue;
      }

      .save {
        background: green;
      }
    }
  }
}
</style>
