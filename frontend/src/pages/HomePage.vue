<template>
  <div class="home-page">
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";


@Component
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
