<template>
  <el-container>
    <Menu></Menu>
    <el-container direction="vertical">
      <Navbar></Navbar>
      <AppMain></AppMain>
      <el-footer>
        <div class="footer">
          <span>{{ new Date().getFullYear() }} © 深圳市沐腾科技有限公司</span>
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Navbar from './nav/Navbar.vue';
import AppMain from './AppMain.vue';
import Menu from './menu/index.vue';
import { useAppStoreWithOut } from '@/store/modules/app';

const appStore = useAppStoreWithOut();
const isCollapse = computed(() => appStore.isCollapse);

// 监听窗口大小变化，折叠 aside
const screenWidth = ref<number>(0);
const listeningWindow = () => {
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth;
      if (isCollapse.value === false && screenWidth.value < 1200)
        appStore.setProjectConfig({ isCollapse: !isCollapse.value });
      if (isCollapse.value === true && screenWidth.value > 1200)
        appStore.setProjectConfig({ isCollapse: !isCollapse.value });
    })();
  };
};
listeningWindow();
</script>

<style lang="scss" scoped>
:deep(.el-header) {
  height: $nav-height;
}
:deep(.el-main) {
  box-sizing: border-box;
  padding: 10px 12px;
  overflow-x: hidden;
  background-color: #f0f2f5;
}
:deep(.el-footer) {
  height: auto;
  padding: 0;
}
.footer {
  height: 20px;
  background: #ffffff;
  border-top: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    font-size: 12px;
    color: #858585;
    text-decoration: none;
    letter-spacing: 0.5px;
  }
}
</style>
