<template>
  <div class="search-field">
      <input v-model="search" type="text" placeholder="Sök produkt..."/>
  </div>
</template>


<script>
import { Vue, Component, Watch } from "vue-property-decorator";


@Component
export default class SearchField extends Vue {

search = "";

@Watch("search")
  onSearchStringChanged(newVal) {
    this.$store.state.searchQueries.searchString = "?s=";
    this.$store.state.searchQueries.searchString += newVal;
  }
}

</script>

<style scoped>

input {
  width: 100%;
  height: 30px;
  font-size: 14px;
}

</style>

