<template>
  <div class="common-layout">
    <el-container>
      <Aside />
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from "../components/aside.vue";
</script>

<style></style>
