import type { RoleFormData } from '#/role';
import type { User } from '@/api/interface';

export interface WhereProps {
  status?: string;
  username?: string;
  nickname?: string;
}

// 表单类型（用于新增/编辑管理员），与列表 User 展示无关
export interface FormType {
  id?: string | number;
  username?: string;
  password?: string;
  phone?: string;
  real_name?: string;
  role?: 1 | 2; // 1: 店长, 2: 师傅
  status?: 0 | 1; // 0: 禁用, 1: 启用
}

export interface userStateProps {
  users: User[];
  row: FormType;
  userId: string;
  isVisible: boolean;
  count: number;
  list?: any[];
}
