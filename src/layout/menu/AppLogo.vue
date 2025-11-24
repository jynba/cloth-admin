<template>
  <div v-if="isCollapse" class="w-200px tracking-wider logo flex items-center justify-center border-b">
    <h3 class="text-19px m-7px font-bold text-black tracking-4px">{{ config.VITE_GLOB_APP_TITLE }}</h3>
  </div>
  <div v-else>
    <div class="logo border-b text-18px">
      <h1 class="text-black font-bold">量体师</h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppStoreWithOut } from '@/store/modules/app';
import { getAppEnvConfig } from '@utils/env';

const appStore = useAppStoreWithOut();
const isCollapse = computed(() => !appStore.isCollapse);
const config = getAppEnvConfig();
</script>

<style lang="scss" scoped>
.logo-icon {
  margin-left: 15px;
}
.logo {
  height: $nav-height;
  line-height: $nav-height;
  text-align: center;
}
</style>
