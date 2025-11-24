import { PageEnum } from '@/enums';
import { isAdmin } from '@/router/guard/helper';
import { asyncRoutes } from '@/router/routes';
import type { AppRouteRecordRaw } from '@/router/types';
import { filterAsyncRoutes } from '@/store/modules/permission';

export const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'change' }],
  password: [{ required: true, message: '请输入密码', trigger: 'change' }],
};

export const getRoutes = (_user, router) => {
  // 临时跳过权限控制，登录后直接进入首页
  router.push(PageEnum.BASE_HOME);
};
