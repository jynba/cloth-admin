<template>
  <el-scrollbar class="flex-1 menu-father">
    <el-menu
      class="el-menu-container"
      :unique-opened="false"
      :default-active="activeMenu"
      :collapse-transition="false"
      :collapse="isCollapse"
      mode="vertical"
      :router="true"
    >
      <MenuItem v-for="menu in permission_routes" :key="menu.path" :menu="menu" />
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { useAppStoreWithOut } from '@/store/modules/app';
import { usePermissionStoreWithOut } from '@/store/modules/permission';
// import { asyncRoutes } from '@/router/routes'; 静态路由
import MenuItem from './MenuItems.vue';

// 路由根据sort字段排序
const appStore = useAppStoreWithOut();
const store = usePermissionStoreWithOut();
// 使用动态路由
const permission_routes = store.accessedRoutes;
const isCollapse = computed(() => appStore.isCollapse);
const activeMenu = computed(() => {
  const { meta, path } = useRoute();
  if (meta.activeMenu) {
    return meta.activeMenu as string;
  }
  return path;
});
</script>

<style lang="scss" scoped>
.menu-father {
  border-right: 1px solid #e5e7eb;
  box-shadow: 10px 0px 5px -5px rgb(0 0 0 / 15%);
  :deep(.el-menu) {
    border-right: 0px;
  }
  :deep(.el-menu .el-menu-item.is-active:before) {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 4px;
    content: '';
    background: var(--el-color-primary);
  }
}
</style>
