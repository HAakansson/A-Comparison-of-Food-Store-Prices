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

 clearTimeout(this.timer);
    this.timer = setTimeout( async () => {
    
    await this.getCategories(value);
  
    this.$store.commit("resetCategoryString");
    this.$store.commit("updateCategoryString", value);
  }, 1200);
   
  }


  async getCategories(categoryString) {
    let categoryResults = await fetch(`/rest/categories?c=${categoryString}`);
    this.categories = await categoryResults.json();
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