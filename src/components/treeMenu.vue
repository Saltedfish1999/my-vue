<template>
  <template v-for="item in props.menuData">
    <el-menu-item
      @click="handleClick(item, `${props.index}-${item.meta.id}`)"
      v-if="!item.children || item.children.length === 0"
      :key="`${props.index}-${item.meta.id}`"
      :index="`${props.index}-${item.meta.id}`"
    >
      <el-icon size="20">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>
    <el-sub-menu
      v-else
      :index="`${props.index}-${item.meta.id}`"
      :key="submenu + `${props.index}-${item.meta.id}`"
    >
      <template #title>
        <el-icon size="20">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.name }}</span>
      </template>
      <tree-menu
        :index="`${props.index}-${item.meta.id}`"
        :menuData="item.children"
      />
    </el-sub-menu>
  </template>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps(["index", "menuData"]); //接受父组件的数据
const router = useRouter(); //创建router实例
/**
 * 点击跳转事件
 */
const handleClick = (item, active) => {
  router.push(item.meta.path);
};
console.log(props);
</script>

<style></style>
