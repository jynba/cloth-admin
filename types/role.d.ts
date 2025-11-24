export interface RoleDateItem {
  key: string;
  label: string;
  children: RoleDateItem[];
}

// 角色表单类型声明
export interface RoleFormData {
  id?: string;
  name?: string; // 角色名
  node_type?: string; // 权限类型
  permissions?: string[]; // PC端权限数组
  wx_permissions?: string[]; // 商户端权限数组
  role_template_id?: string | number; // 权限模板id
  desc?: string; // 描述
}
