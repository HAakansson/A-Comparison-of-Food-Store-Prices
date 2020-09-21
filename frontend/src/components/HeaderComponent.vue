<template>
  <div class="header-component">
    <header>
       <h1>Prisjämföraren</h1>
       <form>
         <!-- <input v-bind:value="searchedString" class="search-field" type="text" placeholder="Search for product..."/> -->
         <input v-model="searchedString" class="search-field" type="text" placeholder="Search for product..."/>
          <button v-on:click="searchButtonPressed" type="button">Search</button>
       </form>

       <!-- <img src="https://banner2.cleanpng.com/20171217/01f/shopping-cart-png-5a364b6d3217e8.4884266315135076932052.jpg" /> -->
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
  background-color: rgb(195, 226, 147);
}

.search-field{
  background: #fff;
  color: #666;
  font: 90%/180% Arial, Helvetica, sans-serif;
  width: 800px;
  max-width: 96%;
  margin: 0 auto;
}

h1 {
  margin-top: 0px;
  padding-top: 40px;
  padding-bottom: 15px;
  font-size: 45px;
  text-align: center;
  color: rgb(75, 104, 104);
  text-decoration: underline;
}
</style>

