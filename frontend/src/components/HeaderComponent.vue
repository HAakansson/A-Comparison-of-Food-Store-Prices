<template>
  <div class="header-component">
      <h1>Prisjämföraren</h1>
      <div class="grind-container">
        <div class="grid-item-1">
          <div class="i1">
            <!-- <h2>product</h2> -->
                <input v-model="searchedProduct" class="search-field" type="text" placeholder="Search for product..."/>
          </div>
        </div>
        <div class="grid-item-2">
          <div class="i2">
            <!-- <h2>category</h2> -->
                <input v-model="searchedProduct" class="search-field" type="text" placeholder="Search for Category..."/>
          </div>
        </div>
        <div class="grid-item-3">
          <div class="diet-checkboxes" v-for="(diet, i) in dietaryRestrictions" :key="i">
              
            <Checkbox :name="diet.name"/>

          </div>
        </div>
     
      </div>
  </div>
</template>

<script>
import { Vue, Component, Watch } from "vue-property-decorator";
import Checkbox from "./Checkbox";

@Component({
  components: {
    Checkbox
  },
})
export default class HeaderComponent extends Vue {

  searchedProduct = "";

  dietaryRestrictions = [
    {
      name: "Vegan"
    }, 
    {
      name: "Vegetarian"
    }, 
    {
      name: "Gluten"
    }, 
    {
      name: "Organic"
    }, 
    {
      name: "Lactosfree"
    }, 

    
  ]

  @Watch("searchedProduct", { deep: true })
  onSomeData(product) {
    // The method to be run when the variable changes must be declared directly underneath the @Watch.
    
    this.searchForProduct(product);
    //this.searchedString = newVal;
  }


  searchButtonPressed() {
    
    console.log("Searching...");
    console.log(this.searchedProduct);

    //this.$router.push({ path: '/' });


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
  background-image: url("https://www.ruohonjuuri.fi/media/wysiwyg/Happy_Food_Store.JPG");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 30vh;
  color:white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 5px;
  text-shadow:  0px -1px black, 1px 0px black, 0px 1px black, -1px 0px black;
  
}

h1 {
  margin-top: 0;
  padding-top: 50px;
  text-align: center;
  font-size: 3.2em;

}

.i1 {
  background-color: lightcoral;
}
.i2 {
  background-color: rebeccapurple;
}

input {
  width: 100%;
  height: 30px;
  font-size: 14px;
  // padding: 0;
  // margin: 0;
}



.grind-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 5px;
  padding: 0px 5px;
  // grid-template-areas: 
  //   "searchinput searchinput categoryinput categoryinput"
  //   ". dietaryinput dietaryinput ."
  
}


.grid-item-1 {
  grid-column: 1/3;
  grid-row: 1/2;
  // grid-area: searchinput;
  // margin: auto;
  //overflow: hidden;

}


.grid-item-2 {
  grid-column: 3/5;
  grid-row: 1/2;
  // grid-area: categoryinput;
  // margin: auto;

  //overflow: hidden;

}




.grid-item-3 {
  grid-column: 1/5;
  grid-row: 2/3;
  display: flex;
  justify-content: center;

  // grid-area: dietaryinput;
}

</style>

