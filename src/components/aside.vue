<template>
  <el-menu
    style="max-width: 230px; width: 100%"
    default-active="2"
    class="aside-container"
    @open="handleOpen"
    @close="handleClose"
    active-text-color="#ffd04b"
    background-color="#545c64"
    text-color="#fff"
  >
    <p class="logo-lg">陪诊管理</p>
    <TreeMenu :index="1" :menu-data="menuData" />
  </el-menu>
</template>

<script setup>
import TreeMenu from "./treeMenu.vue";
import { useRouter } from "vue-router";
import { reactive } from "vue";

const router = useRouter();
console.log(router);

const menuData = reactive(router.options.routes[0].children); //创建响应数据
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
