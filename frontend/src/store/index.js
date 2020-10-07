import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    shoppingLists: [],
    searchQueries:
    {
      searchString: "?s=",
      categoryString: "&c=",
      dietaryString: "&d="
    },
    products: null,

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
    updateCategoryString(state, data) {
      state.searchQueries.categoryString += data;
    },
    resetCategoryString(state) {
      state.searchQueries.categoryString = "&c=";
    },
    replaceDietaryString(state, data){
      state.searchQueries.dietaryString = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
