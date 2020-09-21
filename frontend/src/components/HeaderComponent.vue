<template>
  <div class="header-component">
    <header>
       <h1>The Price Comparitor</h1>
       <form>
         <!-- <input v-bind:value="searchedString" class="search-field" type="text" placeholder="Search for product..."/> -->
         <input v-model="searchedString" class="search-field" type="text" placeholder="Search for product..."/>
          <button v-on:click="searchButtonPressed" type="button">Search</button>
       </form>
    </header>
  </div>
</template>

<script>
import { Vue, Component, Watch } from "vue-property-decorator";
// Vue and Component must always be imported from the vue-property-decorater. If you are going to need Props and Watches, it must be imported from the vue-property-decorator.

// @Component must always be written directly above export default.
@Component({
  // In this components object, you must add the nested components that you use.
  components: {
    //Some Component.
  },
})
export default class HeaderComponent extends Vue {

  searchedString = "";



  @Watch("searchedString", { deep: true })
  onSomeData(product) {
    // The method to be run when the variable changes must be declared directly underneath the @Watch.
    
    this.searchForProduct(product);
    //this.searchedString = newVal;
  }


  searchButtonPressed() {
    console.log("Searching...");
    console.log(this.searchedString);
  }

  searchForProduct(product) {
    console.log("Searching for product....", product);
  }


  created() {}
  mounted() {}
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
.header-component{
  margin-top: 0px;
  background-color: pink;
}

.search-field{
  background: #fff;
  color: #666;
  font: 90%/180% Arial, Helvetica, sans-serif;
  width: 800px;
  max-width: 96%;
  margin: 0 auto;
}
</style>

