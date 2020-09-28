<template>
<div>
  <img class="image" :src="product.img_url" alt="Picture">
  <h2>{{product.name}}</h2>
</div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ProductPage extends Vue {
  product = null;


   async getProductById(id) {
     let result = await fetch(`/rest/products/${id}`);
    this.product = await result.json();
    console.log(this.product);
    //this.$store.state.products = result;
  }
   created(){
     console.log('in created');
   this.getProductById(this.$route.params.productId);
    }
}

</script>

<style scoped lang="scss">
.image{
  border: red 2px solid;
}
</style>