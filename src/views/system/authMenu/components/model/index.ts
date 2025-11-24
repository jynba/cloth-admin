import { dictTypeEnum } from '@/enums';
import { JSONUtils } from '@/utils/tools';

export const rules = {
  name: [{ required: true, message: '名称不能为空', trigger: 'change' }],
  desc: [{ required: true, message: '描述不能为空', trigger: 'change' }],
  info: {
    group: [{ required: true, message: '当前组不能为空', trigger: 'change' }],
  },
};

export function buildForm(form?: any) {
  return {
    name: form?.name,
    desc: form?.desc,
    info: {
      group: form.info?.group,
      parent_group: form.info?.parent_group,
    },
    type: form?.type ?? dictTypeEnum.PC,
  };
}

export function arrayToTree(items) {
  const result = [] as any[];
  const itemMap = {} as Record<string, any>;

  for (const item of items) {
    if (typeof item.info === 'string') item.info = JSONUtils.parse(item.info);

    const group = item.info?.group;
    const parent_group = item.info?.parent_group;

    if (!group) continue;

    if (group === parent_group) {
      console.warn(`group=${group} 不能是自己的父级，跳过`);
      continue;
    }

    if (!itemMap[group]) itemMap[group] = { children: [] };
    itemMap[group] = { ...item, children: itemMap[group].children };

    const treeItem = itemMap[group];

    if (!parent_group) {
      result.push(treeItem);
    } else {
      if (!itemMap[parent_group]) itemMap[parent_group] = { children: [] };
      itemMap[parent_group].children.push(treeItem);
    }
  }

  return result;
}
