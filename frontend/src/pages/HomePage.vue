<template>
  <div class="home-page">
    <h1>Skriv en sökning ovan...</h1>
    <div>
      <ArticleList @change-h1-text="changeH1Text" />
    </div>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import ArticleList from "../components/ArticleList";

@Component({
  components: {
    ArticleList,
  },
})
export default class HomePage extends Vue {
  changeH1Text(){
    document.querySelector(".home-page h1").innerText = "Produkter";
  }
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
