<template>
  <div id="app">
    <HeaderComponent />
    <router-view />
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import HeaderComponent from "./components/HeaderComponent.vue";


@Component({
  components: {
    HeaderComponent
  }
})
export default class App extends Vue {}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: #f3f3f3;
}


#app {
  background-color: #f3f3f3;
}

</style>
