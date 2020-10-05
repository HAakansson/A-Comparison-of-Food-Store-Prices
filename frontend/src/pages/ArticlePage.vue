<template>
<div>
<ProductPage/>
</div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import ProductPage from "../components/ProductPage"

@Component({
  components: {
    ProductPage
      
  }
})

export default class ArticlePage extends Vue {



}


</script>