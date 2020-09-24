<template>
  <div id="shopping-list" class="card">
    <div class="container">
      <h4>{{ shoppingList.name }}</h4>
      <h4>Skapat av: {{ shoppingList.creator ? shoppingList.creator : "Okänd skapare" }}</h4>
    </div>
    <button @click="removeShoppingList">Remove Shopping List</button>
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
}
</script>

<style lang="scss" scoped>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.container {
  padding: 2px 16px;
}
</style>
