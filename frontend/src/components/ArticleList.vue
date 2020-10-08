<template>
  <div class="article-list-container">
    <div class="article-list" v-if="!showSpinner">
      <ArticleListItem
        v-for="article in articles"
        :key="article.id"
        :article="article"
      />
    </div>
    <div class="spinner" v-if="showSpinner">
      <Spinner />
    </div>
  </div>
</template>

<script>
import { Vue, Component, Watch } from "vue-property-decorator";
import ArticleListItem from "./ArticleListItem";
import Spinner from "./Spinner";

@Component({
  components: {
    ArticleListItem,
    Spinner,
  },
})
export default class ArticleList extends Vue {
  articles = null;
  showSpinner = false;

  @Watch("articles")
  onArticleListChange() {
    this.$emit("change-h1-text");
  }

  @Watch("$store.state.searchQueries", { deep: true, immediate: true })
  onSearchQueriesChanged(newVal) {
    let query =
      newVal.searchString + newVal.categoryString + newVal.dietaryString;

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.searchForProduct(query);
    }, 1000);
  }

  async searchForProduct(query) {
    let result = await fetch(`/api/products${query}`);
    this.articles = await result.json();
  }
}
</script>

<style lang="scss" scoped>
.article-list-container {
  .article-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .spinner {
    text-align: center;
  }
}
</style>
