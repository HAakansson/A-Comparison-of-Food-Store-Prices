<template>
  <div class="category-field">
      <input type="text" placeholder="Search for category..."/>
  </div>
</template>


<script>
import { Vue, Component } from "vue-property-decorator";

@Component
export default class CategoryField extends Vue {

// search = "";


// @Watch("search")
//   onSearchStringChanged(newVal) {

//     this.$store.state.searchQueries.searchString = "?s=";
//     this.$store.state.searchQueries.searchString += newVal;
//     console.log(this.$store.state.searchQueries);
//   }
// }




}

</script>

<style scoped>

input {
  width: 100%;
  height: 30px;
  font-size: 14px;
  
}

</style>