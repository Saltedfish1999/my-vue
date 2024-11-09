import { createApp } from "vue";
import { createStore } from "vuex";
import menu from "./menu";

// 创建一个新的 store 实例
export default createStore({
  modules: {
    menu,
  },
});
