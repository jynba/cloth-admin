import type { AppRouteModule } from '@/router/types';

// 路由展示排序
export function sortRouter(routes: AppRouteModule[]): AppRouteModule[] {
  return routes.sort((a, b) => {
    const aNo = a.meta.orderNo;
    const bNo = b.meta.orderNo;

    if (aNo && bNo) {
      return aNo > bNo ? 1 : aNo < bNo ? -1 : 0;
    }
    return 0;
  });
}
