import { clearAuthCache, getToken } from '@/utils/auth';
import { useUserStoreWithOut } from '@/store/modules/user';
import { getPageTitle } from '@/setting/pageTitleSetting';
import { usePermissionStoreWithOut } from '@/store/modules/permission';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import type { RouteRecordRaw } from 'vue-router';
import { router } from '@/router';
import { PageEnum } from '@/enums';
import { sleep } from '@/utils/tools';
import { error } from '@/hooks/elementPlus/useMessage';

const LOGIN_PATH = PageEnum.BASE_LOGIN;
const whiteList = [LOGIN_PATH, '/largeScreen'];

const userStore = useUserStoreWithOut();
const permissionStore = usePermissionStoreWithOut();

// 设置角色是否分配路由
function setHasRoleRoutes(role: boolean) {
  permissionStore.setHasRoleRoutes(role);
}

// 设置页面标题
export function setPageTitle(title: string) {
  document.title = getPageTitle(title);
}

// 是否为admin账号（新：role === 1；兼容旧：node.node_type === 'Root'）
export function isAdmin() {
  const user: any = userStore.user || {};
  if (user?.role === 1) return true;
  return user?.node?.node_type === 'Root';
}

// 是否授权
export function hasToken(): boolean {
  const token = getToken();
  return !!token;
}

// 判断是否已经分配路由权限
export function hasRoleRoutes(): boolean {
  return permissionStore.hasRoleRoutes;
}

// 生成动态路由
export async function generateFinallyRoutes(_, to, next) {
  // if (!userStore.user) {
  //   error('当前账号无权限访问！');
  //   sleep(1).then(() => {
  //     clearAuthCache();
  //     window.location.reload();
  //   });
  // }
  // 临时绕过权限：直接认为是管理员账号，放行所有异步路由
  const adminAccount = true;
  const permission: string[] = [];
  const accessRoutes: any = await permissionStore.generateRoutes(adminAccount, permission);
  console.log('动态路由数组accessRoutes: ', accessRoutes);
  // TODO: 实现真正动态路由，将路由数组加到路由表中
  accessRoutes.forEach((route: RouteRecordRaw) => {
    router.addRoute(route as RouteRecordRaw);
  });
  // 加入错误页面，在addRoute之前加会导致重定向异常
  router.addRoute(PAGE_NOT_FOUND_ROUTE as any);
  // 注册完成后，设置角色已分配路由
  setHasRoleRoutes(true);
  // 跳转到accessRoutes中的第一个路由
  if (to.path === PageEnum.BASE_HOME) {
    next({ path: accessRoutes[0]?.children[0]?.path, replace: true });
  } else {
    next({ ...to, replace: true });
  }
}

// 路由白名单
export function isWhiteList(to): boolean {
  return whiteList.includes(to.path as PageEnum);
}
