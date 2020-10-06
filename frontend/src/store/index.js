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
        products: [
          {
            name: "Mjölk",
            brand: "Arla",
            unit_price: 11,
            image:
              "//static.mathem.se/shared/images/products/small/fruktkasse-bas-4kg-klass1.jpg",
            id: 123,
          },
          {
            name: "Choklad",
            brand: "Marabou",
            unit_price: 19,
            image:
              "//static.mathem.se/shared/images/products/small/yoghurt-latt-mild-naturell-0-5--1500g-arla-ko.jpg",
            id: 123,
          },
          {
            name: "Choklad",
            brand: "Marabou",
            unit_price: 19,
            image:
              "//static.mathem.se/shared/images/products/small/yoghurt-latt-mild-naturell-0-5--1500g-arla-ko.jpg",
            id: 123,
          },
          {
            name: "Choklad",
            brand: "Marabou",
            unit_price: 19,
            image:
              "//static.mathem.se/shared/images/products/small/yoghurt-latt-mild-naturell-0-5--1500g-arla-ko.jpg",
            id: 123,
          },
        ],
      },
      {
        name: "Hemköp",
        sum: 4600,
        products: [
          {
            name: "Mjölk",
            brand: "Arla",
            unit_price: 10,
            image:
              "//static.mathem.se/shared/images/products/small/fruktkasse-bas-4kg-klass1.jpg",
            id: 123,
          },
          {
            name: "Mjölk",
            brand: "Arla",
            unit_price: 10,
            image:
              "//static.mathem.se/shared/images/products/small/fruktkasse-bas-4kg-klass1.jpg",
            id: 123,
          },
          {
            name: "Mjölk",
            brand: "Arla",
            unit_price: 10,
            image:
              "//static.mathem.se/shared/images/products/small/fruktkasse-bas-4kg-klass1.jpg",
            id: 123,
          },
        ],
      },
      {
        name: "Mathem",
        sum: 4800,
        products: [
          {
            name: "Mjölk",
            brand: "Arla",
            unit_price: 12,
            image:
              "//static.mathem.se/shared/images/products/small/fruktkasse-bas-4kg-klass1.jpg",
            id: 123,
          },
        ],
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
