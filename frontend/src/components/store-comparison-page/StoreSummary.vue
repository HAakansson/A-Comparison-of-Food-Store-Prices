<template>
  <div class="store-summary">
    <div class="store-logo"><img :src="image" /></div>
    <div class="store-info">
      <p class="store-sum">Total kostnad: {{ totalCost }} kr</p>
    </div>
  </div>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class StoreSummary extends Vue {
  @Prop()
  storeInfo;

  get image() {
    return require(`../../assets/images/${this.storeInfo.name}.png`);
  }

  get totalCost (){
    return this.storeInfo.sum.toFixed(2);
  }

  created() {
    // console.log(this.storeInfo);
  }
}
</script>

<style lang="scss" scoped>
.store-summary {
  align-items: center;
  background: white;
  border: 2px solid black;
  border-radius: 10px;
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  height: 200px;
  padding: 10px;
  width: 100%;

  .store-logo {
    text-align: center;
    img {
      width: 50%;
    }
  }

  .store-info {
    text-align: center;
    .store-sum {
      font-size: 1.6em;
    }
  }
}
</style>
