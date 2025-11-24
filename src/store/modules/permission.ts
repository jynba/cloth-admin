import { defineStore } from 'pinia';
import { store } from '@/store';
import { asyncRoutes } from '@/router/routes';
import type { AppRouteModule, PermissionState } from '@/router/types';
import { sleep } from '@/utils/tools';
import { clearAuthCache } from '@/utils/auth';
import { error } from '@/hooks/elementPlus/useMessage';

/**
 * @description 判断服务器返回的权限数组中是否存在当前路由的name
 * @returns boolean
 */
function hasRouteName(permissionList, route: AppRouteModule) {
  return permissionList.filter((item: string) => item === route.name).length;
}

export function filterAsyncRoutes(routes: AppRouteModule[], permissionArr) {
  const res: AppRouteModule[] = [];
  if (permissionArr.length === 0) {
    error('当前账号无权限访问！');
    sleep(2).then(() => {
      clearAuthCache();
      window.location.href = '/';
    });
    return res;
  }
  routes.forEach((route) => {
    const tmp: AppRouteModule = { ...route };
    if (hasRouteName(permissionArr, tmp)) {
      if (tmp.children) {
        const children = filterAsyncRoutes(tmp.children, permissionArr);
        tmp.children = children;
        tmp.redirect = permissionArr.includes(children.find((item) => item.path === tmp.redirect)?.name)
          ? tmp.redirect
          : children[0]?.path;
      }
      res.push(tmp);
    }
  });

  return res;
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    accessedRoutes: [],
    hasRoleRoutes: false,
  }),
  actions: {
    generateRoutes(adminAccount, permission) {
      return new Promise((resolve) => {
        let filterResultRoutes;
        if (adminAccount) {
          filterResultRoutes = asyncRoutes || [];
        } else {
          // 将路由数组中的name和传过来的权限数组做对比
          filterResultRoutes = filterAsyncRoutes(asyncRoutes, permission);
          console.log(filterResultRoutes, 'filterResultRoutes');
        }
        this.accessedRoutes = filterResultRoutes;
        resolve(filterResultRoutes);
      });
    },
    // 将生成路由存入本地
    setHasRoleRoutes(permission: boolean) {
      this.hasRoleRoutes = permission;
    },
  },
});

export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
