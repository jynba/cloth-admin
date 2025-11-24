import { defineStore } from 'pinia';
import { store } from '@/store';
import { PageEnum, TABS_CFG_KEY } from '@/enums';
import { Persistent } from '@/utils/cache/persistent';
import { router } from '@/router';

export const tabsStore = defineStore({
  id: 'tabsState',
  state: () => ({
    tabsMenuValue: PageEnum.BASE_HOME as string,
    tabsMenuList: [],
  }),
  actions: {
    getTabList() {
      const tabs = Persistent.getLocal(TABS_CFG_KEY) as [];
      if (tabs && tabs.length > 1) {
        this.tabsMenuList = tabs;
      }
      return this.tabsMenuList;
    },
    async addTabsToList(tab: any) {
      const temp = this.getTabList();
      const tabItem = {
        title: tab.title,
        path: tab.path,
        close: true,
      };
      // 判断当前路由是否已缓存
      if (temp.every((item) => item.path !== tab.path)) {
        temp.push(tabItem);
      }
      this.tabsMenuValue = tab.path;
      this.setTabsListToCache(this.tabsMenuList);
    },
    async setTabsMenuValue(tabsMenuValue: string) {
      this.tabsMenuValue = tabsMenuValue;
    },
    async setTabsListToCache(list: any) {
      this.tabsMenuList = list;
      Persistent.setLocal(TABS_CFG_KEY, this.tabsMenuList, true);
    },
    // 删除tab
    async removeTab(tabPath: string) {
      let val = this.tabsMenuValue;
      const temp = this.tabsMenuList;
      // 判断删除的是否为选中的
      if (val === tabPath) {
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].path == tabPath) {
            const nextTab = temp[i + 1] || temp[i - 1];
            val = nextTab.path;
            // 判断是否进入的是详情页
            if (val.split('?').length > 1) {
              const route = val.split('?')[0];
              const detailRoute = val.split('?')[1];
              router.push({ path: route, query: JSON.parse(detailRoute) });
            } else {
              router.push(val);
            }
          }
        }
      }
      this.tabsMenuValue = val;
      const resArr = temp.filter((i: any) => i.path !== tabPath);
      this.setTabsListToCache(resArr);
    },
    // 删除多个
    async closeMultipleTab(tabsMenuValue?: string) {
      this.tabsMenuList = this.tabsMenuList.filter((item) => {
        return item.path === tabsMenuValue || item.path === PageEnum.BASE_HOME;
      });
      this.setTabsListToCache(this.tabsMenuList);
    },
  },
});

export const tabsStoreFun = () => tabsStore(store);
