import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

router.beforeEach((to, from) => {
  const token = localStorage.getItem("pz_token");
  //非登录页面不用携带token
  if (!token && to.path !== "/login") {
    return "/login";
  } else if (token && to.path === "/login") {
    return "/";
  } else {
    return true;
  }
});
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router);
app.use(store);
app.mount("#app");
