<template>
  <el-dropdown trigger="click" size="default">
    <el-button size="small">
      <span>操作</span>
      <i-uil-angle-down />
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <!-- <el-dropdown-item @click="closeCurrentTab"> 关闭当前 </el-dropdown-item> -->
        <el-dropdown-item @click="closeOtherTab"> 关闭其他 </el-dropdown-item>
        <el-dropdown-item @click="closeAllTab"> 关闭所有 </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { tabsStoreFun } from '@/store/modules/tabs';

const tabsStore = tabsStoreFun();
// const route = useRoute();
// 关闭当前路由，暂时不写
// const closeCurrentTab = () => {
//   // 判断详情页带参路由
//   const path = unref(router.currentRoute).fullPath as string;
//   // 判断首页路由
//   if (path === PageEnum.BASE_HOME) return;

//   if (Object.getOwnPropertyNames(route.query).length !== 0) {
//     const detailPath = `${route.path}?${JSON.stringify(route.query)}`;
//     tabsStore.removeTab(detailPath);
//   }
//   tabsStore.removeTab(unref(router.currentRoute).fullPath);
// };
// 关闭其他
const closeOtherTab = () => {
  tabsStore.closeMultipleTab(tabsStore.tabsMenuValue);
};
// 关闭所有
const closeAllTab = () => {
  tabsStore.closeMultipleTab();
};
</script>
