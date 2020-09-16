<template>
  <div class="home-page">
    <HeaderComponent />
    <h1>HomePage</h1>
    <div class="test">
      <h1>Sass Test</h1>
    </div>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import HeaderComponent from "../components/HeaderComponent.vue";


@Component({
  components: {
    HeaderComponent
  }
})
export default class HomePage extends Vue {}
</script>

<style lang="scss" scoped>
.home-page {
  h1 {
    color: red;
  }

  div {
    h1 {
      color: blue;
    }
  }
}
</style>
