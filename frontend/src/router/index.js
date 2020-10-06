import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "@/pages/HomePage";
import ArticlePage from "@/pages/ArticlePage";
import ShoppingListsPage from "@/pages/ShoppingListsPage";
import CreateShoppingListPage from "@/pages/CreateShoppingListPage";
import ShoppingListDetailsPage from "@/pages/ShoppingListDetailsPage";
import StoreComparisonPage from "@/pages/StoreComparisonPage";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/products/:productId",
    name: "ArticlePage",
    component: ArticlePage,
    props: true,
  },
  {
    path: "/shoppinglists",
    name: "ShoppingListsPage",
    component: ShoppingListsPage,
  },
  {
    path: "/shoppinglists-create",
    name: "CreateShoppingListPage",
    component: CreateShoppingListPage,
  },
  {
    path: "/shoppinglists/:shoppingListId",
    name: "ShoppingListDetailsPage",
    component: ShoppingListDetailsPage,
  },
  {
    path: "/store-comparison-page",
    name: "StoreComparisonPage",
    component: StoreComparisonPage,
    beforeEnter: (to, from, next) => {
      if (from.params.shoppingListId) {
        localStorage.setItem("lastRouteParams", JSON.stringify(from.params.shoppingListId));
      }
      next();
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
