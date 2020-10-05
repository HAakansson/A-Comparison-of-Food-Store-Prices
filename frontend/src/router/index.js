import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "@/pages/HomePage";
import ShoppingListsPage from "@/pages/ShoppingListsPage";
import CreateShoppingListPage from "@/pages/CreateShoppingListPage";
import ShoppingListDetailsPage from "@/pages/ShoppingListDetailsPage"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
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
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
