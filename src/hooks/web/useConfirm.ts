import { confirm } from '../elementPlus/useMessageBox';
import { success } from '../elementPlus/useMessage';

export type MessageType = '' | 'success' | 'warning' | 'info' | 'error';

/**
 * @description 操作单条数据信息(二次确认【删除、禁用、启用、重置密码】),使用async await调用该方法！！
 * @param {Function} api 操作数据接口的api方法(必传)
 * @param {object} params 携带的操作数据参数 {id,params}(必传)
 * @param {string} message 提示信息(必传)
 * @param {string} confirmType icon类型(不必传,默认为 warning)
 * @return Promise
 */
export const useHandleData = <P = any, R = any>(
  api: (id: P, params: P) => Promise<R>,
  params: any,
  message: string,
  confirmType: MessageType = 'warning',
) => {
  return new Promise((resolve) => {
    confirm(`是否${message}?`, '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: confirmType,
    }).then(async () => {
      const res = await api(params.id, params.params);
      if (!res) return false;
      success(`${message}成功!`);
      resolve(true);
    });
  });
};

/**
 * @description 操作单条数据信息(二次确认【删除、禁用、启用、重置密码】),使用async await调用该方法！！
 * @param {Function} api 操作数据接口的api方法(必传)
 * @param {object} params 携带的操作数据参数 {id,params}(必传)
 * @param {string} message 提示信息自定义，会将返回值抛出去
 * @param {string} title 提示信息标题，会将返回值抛出去
 * @param {string} confirmType icon类型(不必传,默认为 warning)
 * @return Promise
 */
export const useHandleDataCustom = <P = any, R = any>(
  api: (id: P, params: P) => Promise<R>,
  params: any,
  message: string,
  title: string,
  confirmType: MessageType = 'warning',
) => {
  return new Promise((resolve) => {
    confirm(`${message}?`, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: confirmType,
    }).then(async () => {
      const res = await api(params.id, params.params);
      if (!res) return false;
      resolve(res);
    });
  });
};
