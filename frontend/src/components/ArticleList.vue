<template>
  <div class="article-list">
    <ArticleListItem
      v-for="article in articles"
      :key="article.id"
      :article="article"
    />
  </div>
</template>

<script>
import { Vue, Component, Watch } from "vue-property-decorator";
import ArticleListItem from "./ArticleListItem";

@Component({
  components: {
    ArticleListItem,
  },
})
export default class ArticleList extends Vue {
  articles = null;

  @Watch("articles")
  onArticleListChange() {
    this.$emit("change-h1-text");
  }

  @Watch("$store.state.searchQueries", { deep: true, immediate: true })
  onSearchQueriesChanged(newVal) {

    let newCat = newVal.categoryString.replace(/\s&\s/, "REMOVE");
    let query =
      newVal.searchString + newCat + newVal.dietaryString;

    if (query === "?s=&c=&d=") { return; }
    if (newVal.searchString === "?s=") { newVal.searchString = "?s= "; }

    clearTimeout(this.timer);
    this.timer = setTimeout( async () => {
      await this.searchForProduct(query);
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
