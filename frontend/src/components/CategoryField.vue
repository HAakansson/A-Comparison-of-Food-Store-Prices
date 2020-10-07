<template>
  <div class="category-field">
      <input v-model="categorySearch" list="categories" type="text" placeholder="Sök kategori..."/>

    <datalist id="categories">
      <option v-for="(category, i) in categories" :key="i" :value="category.name" />
    </datalist>
    
  </div>
</template>


<script>
import { Vue, Component, Watch } from "vue-property-decorator";

@Component
export default class CategoryField extends Vue {

categorySearch = "";
categories = null;


@Watch("categorySearch")
  async onCategoryChange(value) {


    if (value.length < 2) { return; }

    this.getCategories(value);
    //console.log("Results: ", categoryResults);
    //this.categories = categoryResults;

      console.log("BEFORE TIMEOUT");

  //  clearTimeout(this.timer);
  //  this.timer = setTimeout(() => {
  //        console.log("INSIDE TIMEOUT");
      this.$store.commit("resetCategoryString");
      this.$store.commit("updateCategoryString", value);
            console.log(this.$store.state.searchQueries.categoryString);

      //console.log("VALUIE", value);
  //  }, 500);
  //  console.log("AFTER TIMEOUT");
   
  }


  async getCategories(categoryString) {
    let categoryResults = await fetch(`/rest/categories?c=${categoryString}`);
    this.categories = await categoryResults.json();
    //console.log(categoryResults);

    //return categoryResults;
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