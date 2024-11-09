const state = {
  isCollapse: false,
  selectMenu: [],
};
const mutations = {
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse;
  },
};
export default {
  state,
  mutations,
};
