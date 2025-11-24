<template>
  <el-aside width="200px" class="layout-aside">
    <!-- Aside content -->
    <Logo />
    <Menu></Menu>
  </el-aside>
</template>

<script lang="ts" setup>
import Logo from './AppLogo.vue';
import Menu from './components/Menu.vue';
</script>

<style lang="scss" scoped></style>
