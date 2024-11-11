const state = {
  isCollapse: false,
  selectMenu: [],
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
};
export default {
  state,
  mutations,
};
