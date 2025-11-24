import type { DirectiveBinding } from 'vue';
import { useUserStoreWithOut } from '@/store/modules/user';

const store = useUserStoreWithOut();
/**
 * v-auth(['这里填权限值'])
 * 按钮权限判断，获取当前账号权限数组值
 */
const auth = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const userInfo = store.user;
    // 给admin账号开放全部按钮权限
    if (userInfo.username === 'admin' || userInfo.node.node_type === 'Root') {
      return;
    }
    const permission = [...new Set(userInfo.roles.map((item) => item.permissions).flat())] as string[];
    if (!hasCommonElement(permission, binding.value)) {
      // 删除当前结点
      el.parentNode && el.parentNode.removeChild(el);
    }
  },
};

const hasCommonElement = (arr1: string[] = [], arr2 = []) => {
  // 使用 Set 数据结构来提高查找效率
  const set = new Set(arr1);
  for (const element of arr2) {
    if (set.has(element)) {
      return true;
    }
  }
  return false;
};

export default auth;
