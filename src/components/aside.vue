<template>
  <el-menu
    :style="{ width: !isCollapse ? '234px' : '64px' }"
    default-active="2"
    class="aside-container"
    @open="handleOpen"
    @close="handleClose"
    active-text-color="#ffd04b"
    background-color="#545c64"
    text-color="#fff"
    :collapse="isCollapse"
  >
    <p class="logo-lg">{{ isCollapse ? "管理" : "陪诊管理" }}</p>
    <TreeMenu :index="1" :menu-data="menuData" />
  </el-menu>
</template>

<script setup>
import TreeMenu from "./treeMenu.vue";
import { useRouter } from "vue-router";
import { reactive, computed } from "vue";
import { useStore } from "vuex";

const router = useRouter();

// const menuData = reactive(router.options.routes[0].children); //创建响应数据
const store = useStore();
const isCollapse = computed(() => store.state.menu.isCollapse);
const menuData = computed(() => store.state.menu.routerList);
const handleClose = () => {};
const handleOpen = () => {};
</script>

<style lang="less" scoped>
.aside-container {
  height: 100%;
  .logo-lg {
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
}
</style>
