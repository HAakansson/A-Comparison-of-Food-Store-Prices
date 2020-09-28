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

<style lang="scss">
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: #f3f3f3;
}


#app {
  background-color: #f3f3f3;
  button {
    border: none;
    border-radius: 5px;
    font-size: 0.8em;
    font-weight: bold;
    cursor: pointer;
    padding: 0.3em;
    &:hover {
      opacity: 0.6;
    }
  }
}

</style>
