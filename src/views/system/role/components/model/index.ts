import type { RoleDateItem, RoleFormData } from '#/role';

export const rules = {
  name: [{ required: true, message: '角色名不能为空', trigger: 'change' }],
};

export function buildForm(form?: any) {
  return {
    name: form?.name, // 权限名
    node_type: form?.node_type ?? 'Company', // 权限类型
    role_template_id: form?.role_template_id, // 权限模板id
    permissions: form?.permissions ?? [], // 权限数组
  };
}

export function buildRoleForm(form?: Partial<RoleFormData>): RoleFormData {
  return {
    name: form?.name,
    node_type: form?.node_type ?? 'Company', // 权限类型
    permissions: form?.permissions ?? [], // PC端权限数组
    wx_permissions: form?.wx_permissions ?? [], // 商户端权限数组
    role_template_id: form?.role_template_id, // 权限模板id
    desc: form?.desc, // 描述
  };
}

/**
 * @description 字典值过滤，过滤出只有当前角色模板有的字典值
 */
export function findDict(permission, dict) {
  const res = [] as any;
  permission.forEach((el) => {
    res.push(dict.filter((item) => item.name === el)[0]);
  });
  return res;
}

// 多层路由
// 递归获取有非叶子节点id
const arr: string[] = [];
export const formatSource = (source: RoleDateItem[]) => {
  source.forEach((el: RoleDateItem) => {
    if (el.children?.length) {
      arr.push(el.key as string);
      formatSource(el.children);
    }
  });
  return arr;
};
