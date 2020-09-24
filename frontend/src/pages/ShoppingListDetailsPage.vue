<template>
  <div id="shopping-list-details">
    <div class="shopping-list-row">
      <input type="text" placeholder="Varumärke...">
      <input type="text" placeholder="Produktnamn...">
      <input type="text" placeholder="Mängd..."><span>kg</span>
    </div>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ShoppingListDetailsPage extends Vue {

}
</script>

<style lang="scss" scoped>

</style>