<template>
  <div class="card">
    <svg v-if="isSwedish" class="swedish-flag" height="25" width="25">    
      <image href="https://upload.wikimedia.org/wikipedia/en/4/4c/Flag_of_Sweden.svg" height="25" width="25"/>
    </svg>
    <img :src="article.thumbnail_url">
    <div class="container">
      <h4><b>{{article.name}}</b></h4>
      <p>{{article.brand}}</p>
      <p :class="{discount: article.discount_price}">{{price}} kr</p>
    </div>
  </div>
</template>


<script>
import { Vue, Component, Prop } from "vue-property-decorator";


@Component
export default class ArticleListItem extends Vue {


get isSwedish() {
  return this.article.country_of_origin === "Sweden" || this.article.country_of_origin === "Sverige" ? true : false;
}

get price() {
  return this.article.discount_price ? this.article.discount_price : this.article.unit_price;
}

@Prop({
  type: Object, 
  required: true 
}) 
article; 

}



</script>

<style lang="scss" scoped>
.card {
  margin: 10px;
  padding-top: 15px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  text-align: center;
  width: 20%;
  position: relative;
  cursor: pointer;

  .swedish-flag {
    position: absolute;
    top: 7px;
    right: 7px;
  }
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

.container {
  padding: 2px 16px;
}

.discount {
  color: red;
}

@media (max-width: 992px) {
  .card {
    width: 25%;
  }
}

@media (max-width: 600px) {
  .card {
    width: 50%;
  }
}


</style>