import { error as ElError } from '@/hooks/elementPlus/useMessage';
import { clearAuthCache } from '@/utils/auth';
import { sleep } from '@/utils/tools';

const messageToast = (message: string) => {
  if (message) {
    return new ElError(message);
  }
};
/**
 * @description: 校验错误网络请求状态码
 * @param {number} response
 * @return void
 */

export function checkStatus(response: any, message: string): void {
  if (!response) return;
  console.log('错误响应response: ', response);
  console.log('错误信息message: ', message);
  // 超时报错
  // if (!response && message ) {
  //   ElError('服务器响应超时');
  // }
  // 后端自定义报错
  if (response.data?.ErrMsg) {
    messageToast(response.data.ErrMsg);
    return;
  }
  switch (response.status) {
    case 400:
      messageToast('400：请求错误');
      break;
    case 401:
      messageToast('token已失效,请重新登录');
      sleep(2).then(() => {
        clearAuthCache();
        window.location.reload();
      });
      break;
    case 403:
      messageToast('当前账号无权限访问！');
      break;
    case 404:
      messageToast('你所访问的资源不存在！');
      break;
    case 405:
      messageToast('请求方式错误！请您稍后重试');
      break;
    case 408:
      messageToast('请求超时！请您稍后重试');
      break;
    case 500:
      messageToast('服务器异常！');
      break;
    case 502:
      messageToast('网关错误！');
      break;
    case 503:
      messageToast('服务不可用！');
      break;
    case 504:
      messageToast('网关超时！');
      break;
  }
}
