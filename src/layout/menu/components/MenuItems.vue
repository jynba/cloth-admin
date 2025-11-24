<template>
  <el-menu-item v-if="hasOneChildren(menu)" :key="menu.name" :index="menu.redirect ? menu.redirect : menu.path">
    <el-icon v-if="menu.meta.icon">
      <component :is="menu.meta.icon" />
    </el-icon>
    <template #title>
      <span>{{ menu.meta.title }}</span>
    </template>
  </el-menu-item>

  <el-sub-menu v-else :key="menu.path" :index="menu.path">
    <template #title>
      <el-icon v-if="menu.meta.icon">
        <component :is="menu.meta.icon" />
      </el-icon>
      <span>{{ menu.meta.title }}</span>
    </template>
    <MenuItems v-for="sub in handleMenuChildren(menu.children)" :key="sub.path" :menu="sub" />
  </el-sub-menu>
</template>

<script lang="ts" setup>
import type { AppRouteModule } from '@/router/types';

defineProps({
  menu: {
    type: Object,
    default: () => {},
  },
});
const hasOneChildren = (menu: AppRouteModule) => {
  // 判断是否为单路由显示
  if (!menu.children || menu.children.filter((item) => item.hidden)?.length === menu.children.length) {
    return true;
  }
  return false;
};
// 过滤出没有hidden的菜单
const handleMenuChildren = (menuChild: []): AppRouteModule[] => {
  return menuChild.filter((item: AppRouteModule) => !item.hidden);
};
</script>

<style lang="scss" scoped></style>
