const localData = localStorage.getItem("pz_v3pz");

const state = localData
  ? localData.menu
  : {
      isCollapse: false,
      selectMenu: [],
      routerList: [],
    };
const mutations = {
  /**
   * 控制侧边栏的伸展
   */
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse;
  },
  /**
   * 添加菜单
   */
  addMenu(state, payload) {
    // 对数据进行去重
    if (
      state.selectMenu.findIndex((item) => item.path === payload.path) === -1
    ) {
      state.selectMenu.push(payload);
    }
  },
  /**
   * 删除菜单
   */
  closeMenu(state, payload) {
    console.log(state.selectMenu);

    const index = state.selectMenu.findIndex(
      (val) => val.name === payload.name
    );
    state.selectMenu.splice(index, 1);
  },
  /**
   * 动态路由的定义
   */
  dynamicMenu(state, payload) {
    const modules = import.meta.glob("../view/**/**/*.vue");
    // const modules = import.meta.glob('./dir/*.js')
    console.log(modules);

    // 动态路由拼接
    function routerSet(router) {
      router.forEach((route) => {
        //不存在子路由，就进行拼接
        if (!route.children) {
          const url = `../view${route.meta.path}/index.vue`;
          route.component = modules[url];
        } else {
          routerSet(route.children);
        }
      });
    }
    routerSet(payload);
    state.routerList = payload;
  },
};
export default {
  state,
  mutations,
};
