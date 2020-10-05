import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    shoppingLists: [],
    searchQueries: {
      searchString: "?s=",
      categoryString: "&c=",
      dietaryString: "&d=",
    },
    products: null,

    storeComparisonArray: [
      {
        name: "Willys",
        sum: 5000,
        products: [],
      },
      {
        name: "Hemköp",
        sum: 4600,
        products: [],
      },
      {
        name: "Mathem",
        sum: 4800,
        products: [],
      },
    ],
  },
  mutations: {
    addToShoppingLists(state, data) {
      state.shoppingLists.unshift(data);
    },
    updateShoppingLists(state, data) {
      state.shoppingLists = data;
    },
    updateDietaryString(state, data) {
      state.searchQueries.dietaryString += data;
    },
    replaceDietaryString(state, data) {
      state.searchQueries.dietaryString = data;
    },
  },
  actions: {},
  modules: {},
});
