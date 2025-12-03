import type { AppRouteModule } from '@/router/types';
import { LAYOUT } from '@/router/constant';
import { markRaw } from 'vue';
import UilLink from '~icons/uil/link';

const order: AppRouteModule = {
  path: '/order',
  name: 'order',
  component: LAYOUT,
  redirect: '/order/list',
  meta: {
    orderNo: 30,
    title: '订单管理',
    icon: markRaw(UilLink),
  },
  children: [
    {
      path: '/order/list',
      name: 'order_list',
      component: () => import('@/views/order/list/index.vue'),
      meta: {
        title: '订单列表',
      },
    },
    {
      path: '/order/detail',
      name: 'order_detail',
      component: () => import('@/views/order/detail/index.vue'),
      hidden: true,
      meta: {
        title: '订单详情',
        activeMenu: '/order/list',
      },
    },
  ],
};

export default order;
