<template>
  <el-header class="flex items-center justify-between border-b">
    <div>
      <IPrimeAlignLeft class="text-25px cursor-pointer" @click="toggleFun"></IPrimeAlignLeft>
    </div>
    <div class="flex h-full items-center">
      <div class="mr-5">
        <el-color-picker v-model="themeColor" size="small" :predefine="predefineColors" @change="changeThemeColor" />
      </div>
      <div class="mr-5 cursor-pointer" @click="refresh">
        <i-uil-sync />
      </div>
      <div class="mr-5 cursor-pointer" @click="toggle">
        <component :is="isFullscreen ? UilCompressArrows : UilExpandArrowsAlt" />
      </div>
      <div class="mr-1">
        {{ getTimeState() }}
      </div>
      <div class="h-full cursor-pointer hover:bg-gray-50">
        <el-dropdown trigger="click">
          <div class="p-10px text-20px flex items-center">
            {{ userStore.user?.username }}
            <IUilAngleDown class="text-25px cursor-pointer" />
          </div>

          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/system/personal">
                <el-dropdown-item> 个人中心 </el-dropdown-item>
              </router-link>
              <el-dropdown-item @click="logout"> 退出登录 </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import { useAppStoreWithOut } from '@/store/modules/app';
import { useUserStoreWithOut } from '@/store/modules/user';
import { useRootSetting } from '@/hooks/setting/useRootSetting';
import { useFullscreen } from '@vueuse/core';
import UilExpandArrowsAlt from '~icons/uil/expand-arrows-alt';
import UilCompressArrows from '~icons/uil/compress-arrows';
import { getTimeState } from '@/utils/dateUtil';

const { toggle, isFullscreen } = useFullscreen();

const appStore = useAppStoreWithOut();
const themeColor = ref(appStore.projectConfig.themeColor);
const { changeThemeColor } = useRootSetting();
const userStore = useUserStoreWithOut();
const isCollapse = computed(() => appStore.isCollapse);

const predefineColors = ref(['#09BB07', '#0F62FE', '#ff8c00', '#fad400', '#00ced1', '#E74C3C', '#9B59B6']);

const refresh = () => {
  window.location.reload();
};

const toggleFun = () => {
  appStore.setProjectConfig({ isCollapse: !isCollapse.value });
};

const logout = () => {
  userStore.logout();
};
</script>

<style lang="scss" scoped>
:deep(.el-dropdown) {
  height: 100%;
}
</style>
