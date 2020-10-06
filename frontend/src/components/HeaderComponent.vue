<template>
  <div class="header-component">
    <h1 class="title" @click="backToHomePage">Prisjämföraren</h1>
    <div class="grind-container">
      <div class="grid-item-1">
        <SearchField />
      </div>
      <div class="grid-item-2">
        <CategoryField />
      </div>
      <div class="grid-item-3">
        <div
          class="diet-checkboxes"
          v-for="(diet, i) in dietaryRestrictions"
          :key="i"
        >
          <Checkbox :name="diet.name" :dietVal="diet.value" />
        </div>
      </div>
    </div>
    <button
      v-if="showGoToShoppingListsButton"
      class="shopping-list-icon"
      @click="goToShoppingLists"
    >
      <span>Shoppinglista</span>
      <i class="material-icons">receipt_long</i>
    </button>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import Checkbox from "./Checkbox";
import SearchField from "./SearchField";
import CategoryField from "./CategoryField";

@Component({
  components: {
    Checkbox,
    SearchField,
    CategoryField,
  },
})
export default class HeaderComponent extends Vue {
  get showGoToShoppingListsButton() {
    return this.$route.name === "HomePage";
  }

  dietaryRestrictions = [
    {
      name: "Vegan",
      value: "vegan",
    },
    {
      name: "Vegetariskt",
      value: "vegetarian",
    },
    {
      name: "Glutenfri",
      value: "gluten",
    },
    {
      name: "Ekologiskt",
      value: "organic",
    },
    {
      name: "Laktosfri",
      value: "lactosefree",
    },
  ];

  backToHomePage() {
    if (!this.$route.path === "/") {
      this.$router.push("/");
    }
  }

  goToShoppingLists() {
    this.$router.push("/shoppinglists");
  }

  mounted() {
    if (this.$route.name === "HomePage") {
      document.querySelector(".grid-item-1 .search-field input").focus();
    }
  }
}
</script>

<style lang="scss" scoped>
.header-component {
  background-image: url("https://www.ruohonjuuri.fi/media/wysiwyg/Happy_Food_Store.JPG");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 30vh;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 5px;
  position: relative;
  text-shadow: 0px -1px black, 1px 0px black, 0px 1px black, -1px 0px black;

  .shopping-list-icon {
    align-items: center;
    background: green;
    display: flex;
    color: white;
    padding: 5px 10px !important;
    position: absolute;
    opacity: 1 !important;
    right: 10px;
    top: 10px;

    &:hover {
      background: rgba(0, 128, 0, 0.8);
    }

    i,
    span {
      font-size: 2em;
      margin: 0 5px;
    }
  }
}

.title {
  cursor: pointer;
  display: inline-block;
  width: auto;
  margin: auto;
  margin-bottom: 25px;
  padding: 0;
}

h1 {
  margin-top: 0;
  padding-top: 50px;
  text-align: center;
  font-size: 3.2em;
}

.grind-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  row-gap: 5px;
  column-gap: 25px;
  padding: 0px 160px;
}

.grid-item-1 {
  grid-column: 1/3;
  grid-row: 1/2;
}

.grid-item-2 {
  grid-column: 3/5;
  grid-row: 1/2;
}

.grid-item-3 {
  grid-column: 1/5;
  grid-row: 2/3;
  display: flex;
  justify-content: center;
}
</style>
