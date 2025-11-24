import { useAppStore } from '@/store/modules/app';
import { computed, onBeforeMount } from 'vue';
import { DefaultColor } from '@/enums';
import { getLightColor } from '@/utils/tools';

export function useRootSetting() {
  const appStore = useAppStore();
  const themeConfig = computed(() => appStore.projectConfig);
  // 设置全局主题色
  const changeThemeColor = (val?: string) => {
    if (!val) {
      val = appStore?.getThemeColor || DefaultColor.COLOR;
    }
    appStore.setProjectConfig({ ...themeConfig.value, themeColor: val });
    document.documentElement.style.setProperty('--el-color-primary', themeConfig.value.themeColor);
    // 颜色变浅
    for (let i = 1; i <= 9; i++) {
      document.documentElement.style.setProperty(
        `--el-color-primary-light-${i}`,
        `${getLightColor(themeConfig.value.themeColor, i / 10)}`,
      );
    }
  };
  onBeforeMount(() => {
    changeThemeColor();
  });

  return { changeThemeColor };
}
