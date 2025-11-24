import NProgress from 'nprogress';
import type { Router } from 'vue-router';
import { generateFinallyRoutes, hasRoleRoutes, hasToken, isWhiteList, setPageTitle } from './helper';

// 设置路由守卫
export function setupRouterGuard(router: Router) {
  NProgress.start();
  createPageGuard(router);
}

function createPageGuard(router: Router) {
  router.beforeEach(async (to, _, next) => {
    // 设置标题
    setPageTitle(to.meta.title);

    // 判断是否登录
    if (hasToken()) {
      if (to.path === '/login') {
        next({ path: '/' });
        return;
      }

      // 判断是否已经生成角色路由，由于pinia状态存储刷新后值会丢失，所以当页面重载(F5)会重新生成权限数组
      if (hasRoleRoutes()) {
        next();
        return;
      }
      // 生成动态路由
      await generateFinallyRoutes(router, to, next);
      return;
    }
    // 判断是否白名单
    if (isWhiteList(to)) {
      next();
      return;
    }
    // 是否忽略授权
    if (to.meta.ignoreAuth) {
      next();
      return;
    }
    // 没登录就一直跳转到登录页
    next(`/login?redirect=${to.path}`);
  });

  router.afterEach(() => {
    NProgress.done();
  });
}
