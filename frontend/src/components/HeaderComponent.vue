<template>
  <div class="header-component">
    <h1>The Price Comparitor</h1>
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
  onSomeData(oldVal, newVal) {
    // The method to be run when the variable changes must be declared directly underneath the @Watch.
    console.log(oldVal, newVal);
    this.searchedString = newVal;
  }



  created() {
    console.log("CREATED");
  }
  mounted() {}
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped></style>

