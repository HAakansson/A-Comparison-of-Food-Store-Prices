<template>
  <div class="home-page">
    <h1>Produkter</h1>
    <div>
      <ArticleList />
    </div>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import ArticleList from "../components/ArticleList";

@Component({
  components: {
      ArticleList,
  }
})
export default class HomePage extends Vue {



}



</script>

<style lang="scss" scoped>
.home-page {

  h1 {
    text-align: center;
  }

  div {
    background-color: #f3f3f3;
    
  }
}
</style>
