import { uniqWith } from 'lodash-es';
import { computed, ref, watch } from 'vue';
import type { ToRef } from 'vue';

/**
 * 解决下拉框数据分页导致的当前选中的值无法在当前列表中找到，正确回显的问题
 * @description 当下拉框数据通过分页加载时，已选中的值可能不在当前页中，此hook确保选中值能正确显示
 * @param {object} options - 配置选项
 * @param {ToRef<any[]>} options.list - 当前下拉框远程获取到的列表数据
 * @param {ToRef<string>} options.currentSelect - 下拉框当前选中的值
 * @param {ToRef<string>} options.currentQuery - 下拉框输入框输入的关键词
 * @param {ToRef<Function>} options.https - 查询当前选中值的方法，通常是API请求函数
 * @param {string} options.key - 当前选中值在列表数据中的唯一标识字段，默认为'id'
 * @returns {object} 包含mergelist的对象，mergelist为合并后的列表数据，确保包含当前选中项
 */
export function useCurrentItem({
  list,
  currentSelect,
  currentQuery,
  https,
  key = 'id',
}: {
  list: ToRef<any[]>; //  当前下拉框远程获取到的列表数据
  currentSelect: ToRef<string>; // 下拉框当前选中的值
  currentQuery: ToRef<string>; // 下拉框输入框输入的关键词
  https: ToRef<any>; // 查询当前选中值得的方法，一般是数据接口
  key?: string; // 当前选中值列表数据中对应的字段
}) {
  // 当前值详情数据
  const currentDevice = ref<any>({});

  /**
   * 获取当前选中值的详情数据
   * @async
   * @private
   * @description 通过API获取当前选中值的完整数据信息
   */
  const loadCurrentDevice = async () => {
    const { Result, Results } = await https.value(currentSelect.value);
    if (Results) {
      currentDevice.value = Results?.[0] || {};
    } else {
      currentDevice.value = Result || {};
    }
  };

  /**
   * 合并当前列表和当前值详情
   * @description 确保当前选中的项在列表中可见，即使它不在当前页的数据中
   */
  const mergelist = computed(() => {
    let _list: any[] = [];
    if (currentDevice.value?.[key] && currentDevice.value?.[key] === currentSelect.value && !currentQuery.value) {
      _list = [currentDevice.value, ...list.value];
    } else {
      _list = list.value;
    }
    return uniqWith(_list, (a, b) => {
      return a.id === b.id;
    });
  });

  /**
   * 监听列表和选中值的变化
   * @description 当列表或选中值变化时，确保选中项在列表中，如果不在则通过API获取
   */
  watch([list, currentSelect], () => {
    if (!currentSelect.value) return;
    const item = list.value.find((item) => item?.[key] === currentSelect.value);
    if (item) {
      currentDevice.value = item;
    }
    if (currentDevice.value?.[key] !== currentSelect.value) {
      loadCurrentDevice();
    }
  });

  return {
    mergelist,
  };
}
