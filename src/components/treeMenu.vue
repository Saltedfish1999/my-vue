<template>
  <template v-for="item in props.menuData">
    <el-menu-item
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
const props = defineProps(["index", "menuData"]);

console.log(props);
</script>

<style></style>
