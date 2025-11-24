<template>
  <el-menu :default-active="activeIndex" mode="horizontal" style="min-width: 320px; height: 50px">
    <el-menu-item v-for="item in menus" :key="item.path" :index="item.path">
      <router-link v-if="!item.hidden" :to="item.path + (item.query ? item.query : '')">{{ item.name }}</router-link>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

defineOptions({
  name: 'SubMenu', // 全局表格布局样式
});
defineProps({
  menus: {
    type: Array as PropType<any[]>,
    defalut: () => [],
  },
});

const activeIndex = computed(() => {
  const { path } = useRoute();
  return path;
});
</script>

<style lang="scss" scoped>
.el-menu-item {
  padding: 0;
  a {
    display: block;
    padding: 0 10px;
  }
}
.el-menu--horizontal > .el-menu-item.is-active,
.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  //color: #747571;
  color: var(--el-color-primary);
  background-color: #fff;
}
</style>
