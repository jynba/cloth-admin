import { PageEnum } from '@/enums';
import type { AppRouteModule, AppRouteRecordRaw } from '@/router/types';
import { sortRouter } from '@/router/helper/sortRouter';

const modules = import.meta.glob('./modules/**/*.ts', { eager: true });

const routeModuleList: AppRouteModule[] = [];
const skip = []; // 跳过不需要展示的模块；后续解开

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  if (!skip.includes(mod.path)) {
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routeModuleList.push(...modList);
  }
});

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/index.vue'),
  meta: {
    title: '登录',
  },
};
// 业务路由
export const asyncRoutes = sortRouter([...routeModuleList]);
console.log(asyncRoutes, 'asyncRoutes');

// 浏览器中可导航到的路由
export const basicRoutes = [
  RootRoute,
  LoginRoute,
  // 当为动态路由时，注释掉此处
  // ...asyncRoutes,
  // REDIRECT_ROUTE,
  // PAGE_NOT_FOUND_ROUTE,
];
