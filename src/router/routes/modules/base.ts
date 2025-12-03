import type { AppRouteModule } from '@/router/types';
import { LAYOUT } from '@/router/constant';
import { markRaw } from 'vue';
import UilLink from '~icons/uil/link';

const management: AppRouteModule = {
  path: '/base',
  name: 'base',
  component: LAYOUT,
  redirect: '/base/company',
  meta: {
    orderNo: 10,
    title: '组织架构',
    icon: markRaw(UilLink),
  },
  children: [
    {
      path: '/base/company',
      name: 'company',
      component: () => import('@/views/base/company/index.vue'),
      meta: {
        title: '公司管理',
      },
    },
    {
      path: '/base/companyDetail',
      name: 'company:r',
      component: () => import('@/views/base/company/details/index.vue'),
      hidden: true,
      meta: {
        title: '公司详情',
        activeMenu: '/base/company',
      },
    },
  ],
};

export default management;
