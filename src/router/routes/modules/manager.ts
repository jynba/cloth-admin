import type { AppRouteModule } from '@/router/types';
import { LAYOUT } from '@/router/constant';
import { markRaw } from 'vue';
import UilUserMd from '~icons/uil/user-md';

const manager: AppRouteModule = {
  path: '/manager',
  name: 'manager',
  component: LAYOUT,
  redirect: '/manager/admins',
  meta: {
    orderNo: 59,
    icon: markRaw(UilUserMd),
    title: '人员管理',
  },
  children: [
    {
      path: '/manager/admins',
      name: 'admins',
      component: () => import('@/views/manager/admins/index.vue'),
      meta: {
        title: '管理员管理',
      },
    },
    {
      path: '/manager/tailors',
      name: 'tailors',
      component: () => import('@/views/manager/tailors/index.vue'),
      meta: {
        title: '师傅管理',
      },
    },
  ],
};

export default manager;
