<template>
  <div class="category-field">
      <input @blur="resetInput" v-model="categorySearch" list="categories" type="text" placeholder="Sök kategori..."/>

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

// TODO: när man raderar kategori fältet ska den söka med tomt....
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
  async resetInput(){  
    let categoryInput = this.categorySearch.toLowerCase();
    if (categoryInput.length <= 2 && categoryInput !== "öl"){
      this.categorySearch = "";
       this.$store.commit("resetCategoryString");
     this.$store.commit("updateCategoryString", this.categorySearch);

    }
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