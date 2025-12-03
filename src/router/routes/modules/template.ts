import type { AppRouteModule } from '@/router/types';
import { LAYOUT } from '@/router/constant';
import { markRaw } from 'vue';
import UilFileAlt from '~icons/uil/file-alt';

const template: AppRouteModule = {
  path: '/template',
  name: 'template',
  component: LAYOUT,
  redirect: '/template/list',
  meta: {
    orderNo: 40,
    title: '量体模板',
    icon: markRaw(UilFileAlt),
  },
  children: [
    {
      path: '/template/list',
      name: 'template_list',
      component: () => import('@/views/template/index.vue'),
      meta: {
        title: '模板管理',
      },
    },
  ],
};

export default template;
