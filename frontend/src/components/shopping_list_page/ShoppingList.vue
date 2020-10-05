<template>
  <div id="shopping-list">
    <div class="card">
      <div class="container" @click="goToShoppingListDetails">
        <div class="shopping-list-name">{{ shoppingList.name }}</div>
        <div class="shopping-list-creator">
          Skapat av:
          {{ shoppingList.creator ? shoppingList.creator : "Okänd skapare" }}
        </div>
        <div class="shopping-list-timestamp">
          {{ new Date(shoppingList.timestamp).toLocaleString() }}
        </div>
      </div>
      <button class="remove-button" @click="removeShoppingList">
        <i class="material-icons">delete</i>
      </button>
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
  .card {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
    height: 200px;
    padding: 1em;
    position: relative;
    text-align: center;
    transition: 0.5s;
    width: 100%;

    .container {
      display: flex;
      flex-direction: column;
      height: 80%;
      justify-content: space-around;

      .shopping-list-name {
        font-size: 1.3em;
        font-weight: bolder;
        text-decoration: underline;
      }

      .shopping-list-creator {
        font-weight: bold;
      }
    }
  }

  .card:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }

  .remove-button {
    background: red;
    color: white;
    right: 10px;
    bottom: 10px;
    position: absolute;
    &:hover {
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
