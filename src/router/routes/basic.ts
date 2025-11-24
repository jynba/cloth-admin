import type { AppRouteRecordRaw } from '@/router/types';
import { EXCEPTION_COMPONENT, LAYOUT, PAGE_NOT_FOUND_NAME, REDIRECT_NAME } from '@/router/constant';

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: PAGE_NOT_FOUND_NAME,
  component: EXCEPTION_COMPONENT,
  // 找不到页面时
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    hideMenu: true,
  },
};

export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: '/redirect',
  name: REDIRECT_NAME,
  component: LAYOUT,
  meta: {
    title: REDIRECT_NAME,
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: REDIRECT_NAME,
      component: () => import('@/views/system/redirect/index.vue'),
      meta: {
        title: REDIRECT_NAME,
        hideBreadcrumb: true,
      },
    },
  ],
};

export const ERROR_LOG_ROUTE: AppRouteRecordRaw = {
  path: '/error-log',
  name: 'ErrorLog',
  component: LAYOUT,
  redirect: '/error-log/list',
  meta: {
    title: 'ErrorLog',
    hideBreadcrumb: true,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'list',
      name: 'ErrorLogList',
      component: () => import('@/views/system/error-log/index.vue'),
      meta: {
        title: 'ErrorLogList',
        hideBreadcrumb: true,
        currentActiveMenu: '/error-log',
      },
    },
  ],
};
