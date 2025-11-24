import type { RoleFormData } from '#/role';

export interface WhereProps {
  status?: string;
  username?: string;
  nickname?: string;
}
export interface FormType {
  id?: string;
  username: string;
  password: string;
  status: number;
  role_ids: string[];
  roles: RoleFormData[];
  node: {
    node_type: 'Root' | 'Company' | 'Agent' | 'Shop' | 'Site';
    name: string;
  };
  node_id: string;
  remark: string;
  contact: string;
  phone: number;
  role_name: string;
  info: any;
}

// TODO: 完善类型
export interface userStateProps {
  users: any[];
  row: FormType;
  userId: string;
  isVisible: boolean;
  list?: any[];
}
