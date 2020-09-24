import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    shoppingLists: []

  },
  mutations: {
    addToShoppingLists(state, data) {
      state.shoppingLists.unshift(data);
    },
    updateShoppingLists(state, data) {
      state.shoppingLists = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
