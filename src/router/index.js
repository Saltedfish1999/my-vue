import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "../view/Main.vue";
import Login from "../view/login/index.vue";

const routes = [
  {
    path: "/",
    component: Layout,
  },
  {
    path: "/login",
    component: Login,
  },
];

const router = createRouter({
  //路由数据
  routes,
  //路由匹配模式
  history: createWebHashHistory(),
});
export default router;
