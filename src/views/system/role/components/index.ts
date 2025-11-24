import SearchBar from './SearchBar.vue';
import RoleDialog from './RoleDialog.vue';
import type { RoleDateItem } from '#/role';
import { isEmpty } from '@/utils/is';
import { JSONUtils } from '@/utils/tools';

export function arrayToTree(items) {
  const result = [] as RoleDateItem[]; // 存放结果集
  const itemMap = {} as any; //
  for (const item of items) {
    if (!item) return;
    typeof item?.info === 'string' && (item.info = JSONUtils.parse(item.info));
    const group = item?.info?.group;
    const parent_group = item?.info?.parent_group || '';
    if (!itemMap[group]) {
      itemMap[group] = {
        children: [],
      };
    }
    // 替换成element可展示的树形结构数组
    // itemMap[group] = {
    //   ...item,
    //   children: itemMap[group]['children']
    // }
    itemMap[group] = {
      key: item.name,
      label: item.desc,
      children: itemMap[group].children,
    };
    const treeItem = itemMap[group];
    if (isEmpty(parent_group)) {
      result.push(treeItem);
    } else {
      if (!itemMap[parent_group]) {
        itemMap[parent_group] = {
          children: [],
        };
      }
      itemMap[parent_group].children.push(treeItem);
    }
  }
  return result;
}

export { RoleDialog, SearchBar };
export * from './model';
