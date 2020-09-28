<template>
  <div id="shopping-list">
    <div class="card">
      <div class="container" @click="goToShoppingListDetails">
        <p class="shopping-list-name">{{ shoppingList.name }}</p>
        <p class="shopping-list-creator">
          Skapat av:
          {{ shoppingList.creator ? shoppingList.creator : "Okänd skapare" }}
        </p>
        <p class="shopping-list-timestamp">
          {{ new Date(shoppingList.timestamp).toLocaleString() }}
        </p>
      </div>
      <div class="shopping-list-footer">
        <button class="remove-button" @click="removeShoppingList">
          <i class="material-icons">delete</i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ShoppingList extends Vue {
  @Prop()
  shoppingList;

  removeShoppingList() {
    this.$emit("remove-shoppingList", this.shoppingList.id);
  }

  goToShoppingListDetails() {
    this.$router.push(`/shoppinglists/${this.shoppingList.id}`);
  }
}
</script>

<style lang="scss" scoped>
#shopping-list {
  margin: 0 2em;
  position: relative;
  .card {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    padding: 1em;
    text-align: center;
    transition: 0.3s;
    .container {
      padding: 2px 16px;
      .shopping-list-name {
        font-size: 1.5em;
        font-weight: bolder;
        text-decoration: underline;
        margin: 0 0 0.2em 0;
      }
      .shopping-list-creator {
        font-weight: bold;
        margin: 0 0 1em 0;
      }
    }
    .shopping-list-footer {
      display: flex;
      justify-content: flex-end;
    }
  }

  .card:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }

  .remove-button {
    background: red;
    color: white;
  }
}
</style>
