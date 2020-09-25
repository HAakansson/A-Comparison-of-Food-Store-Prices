<template>
  <div id="shopping-list">
    <div class="card">
      <div class="container" @click="goToShoppingListDetails">
        <h4>{{ shoppingList.name }}</h4>
        <h4>
          Skapat av:
          {{ shoppingList.creator ? shoppingList.creator : "Okänd skapare" }}
        </h4>
      </div>
      <button class="remove-button" @click="removeShoppingList">
        Remove Shopping List
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
    this.$router.push(`/shoppinglists/${this.shoppingList.id}`)
  }
}
</script>

<style lang="scss" scoped>
#shopping-list {
  .card {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    .container {
      padding: 2px 16px;
    }
  }

  .card:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }

  .remove-button {
    cursor: pointer;
  }
}
</style>
