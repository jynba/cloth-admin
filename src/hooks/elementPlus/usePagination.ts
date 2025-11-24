import { reactive } from 'vue';
import type { PageQuery } from '#/query';

export function usePagination({ limit } = { limit: 10 }) {
  const query: PageQuery = reactive({ page: 1, limit, skip: 0, total: 0, where: {} });
  return {
    query,
  };
}
/**
 * @description 用于搜索，此方法将需要搜索的字段和值传递过来，可以去除掉不需要的字段
 * @param params
 * @returns 传给后端搜索的字段和值
 */
export function useSearchParams(params) {
  const state = reactive({
    params: {},
  });
  for (const key in params) {
    let val = params[key];
    if (typeof val === 'string') {
      val = val.trim();
    }
    if (['', undefined, null].includes(val)) continue;
    state.params[key] = val;
  }
  return { ...state.params };
}
