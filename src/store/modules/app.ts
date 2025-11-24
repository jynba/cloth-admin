import { defineStore } from 'pinia';
import { store } from '@/store';
import type { ProjectConfig } from '@/setting/projectSetting';
import projectConfig from '@/setting/projectSetting';
import { Persistent } from '@/utils/cache/persistent';
import { PROJ_CFG_KEY } from '@/enums';
import { deepMerge } from '@/utils';

interface AppState {
  projectConfig: ProjectConfig;
}
export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({ projectConfig }),
  getters: {
    isCollapse(): boolean {
      return this.projectConfig.isCollapse;
    },
    getThemeColor(): string {
      const temp = Persistent.getLocal(PROJ_CFG_KEY) as ProjectConfig;
      return temp?.themeColor || this.projectConfig.themeColor;
    },
  },
  actions: {
    setProjectConfig(config: DeepPartial<ProjectConfig>): void {
      this.projectConfig = deepMerge(this.projectConfig || {}, config);
      Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig, true);
    },
  },
});

export function useAppStoreWithOut() {
  return useAppStore(store);
}
