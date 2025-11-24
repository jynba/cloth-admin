<template>
  <Tabs />
  <el-main>
    <router-view v-slot="{ Component, route }">
      <transition appear name="fade-transform" mode="out-in">
        <!-- 使用route.fullPath作为唯一key，防止进入同一路由，不同query时不跳转 -->
        <!-- <keep-alive :include="routeName()"> -->
        <component :is="Component" :key="route.fullPath" />
        <!-- </keep-alive> -->
      </transition>
    </router-view>
  </el-main>
</template>

<script lang="ts" setup>
import Tabs from './tabs/index.vue';
import { useWaterMark } from '@/hooks/web/useWaterMark';
import { useUserStoreWithOut } from '@/store/modules/user';
import { dateUtil, formatToDate } from '@/utils/dateUtil';
/**
 * @description include 设置需要缓存的路由(其他未设置的路由都不会被缓存) exclude 设置不需要缓存的路由
 * @description 数据只能从前端上报的可以缓存，数据会从终端，或移动端上报的不能缓存
 * @return string .eg 'AreaManage,ShopManage'
 */
// const routeName = () => {
//   const excludeName = [];
//   return excludeName.join(',').toString();
// };
const userStore = useUserStoreWithOut();
// 设置水印
onMounted(() => {
  const { setWatermark } = useWaterMark();
  const date = formatToDate(dateUtil());
  setWatermark(userStore.user?.username, date);
});
</script>

<style lang="scss" scoped>
.layout-main {
  background: #f0f2f5;
}
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.2s;
}
.fade-transform-enter-from {
  opacity: 0;
  transition: all 0.2s;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transition: all 0.2s;
  transform: translateX(30px);
}
</style>
