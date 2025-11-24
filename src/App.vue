<template>
  <el-config-provider size="default" :locale="zhCn">
    <!-- <div :class="['app-container', isCollapse && 'is-mobile']" v-cloak> -->
    <router-view />
    <!-- </div> -->
  </el-config-provider>
</template>

<script lang="ts" setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn';
</script>

<style lang="scss"></style>
