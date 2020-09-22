import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchQueries:
    {
      searchString: "?s=",
      categoryString: "&c=",
      dietaryString: "&d="
    },
    products: null,
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
