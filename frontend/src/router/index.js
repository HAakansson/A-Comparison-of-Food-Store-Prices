import Vue from "vue";
import VueRouter from "vue-router";
import HomePage from "@/pages/HomePage";
import ArticlePage from "@/pages/ArticlePage"

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
    props: true
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
