<template>
  <div class="article-list">
      <ArticleListItem v-for="article in articles" :key="article.id" :article="article"/>
  </div>
</template>


<script>
import { Vue, Component, Watch } from "vue-property-decorator";
import ArticleListItem from "./ArticleListItem";


@Component({
  components: {
    ArticleListItem,
  }
})
export default class ArticleList extends Vue {

  articles = null;

  // get articleList() {
  //   return this.$store.state.products || "No Articles Found";
  // }


  

  @Watch("articles", { immediate: true })
  onArticleListChange(newVal) {
    console.log(newVal);
  }


 @Watch("$store.state.searchQueries", { deep: true })
 onSearchQueriesChanged(newVal) {

  let query = newVal.searchString + newVal.categoryString + newVal.dietaryString;

  clearTimeout(this.timer);
  this.timer = setTimeout(() => {
      this.searchForProduct(query);
  }, 1000); 
  
 }

  async searchForProduct(query) {
    let result = await fetch(`/api/products${query}`);
    this.articles = await result.json();

    //this.$store.state.products = result;
  }


}
</script>

<style lang="scss" scoped>

.article-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

</style>