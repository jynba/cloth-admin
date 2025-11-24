import { ErrorTypeEnum } from '/@/enums';
import { MenuModeEnum, MenuTypeEnum } from '/@/enums';
import { RoleInfo } from '/@/api/sys/model/userModel';
import { RoleFormData } from './role';

// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined;
  // Is it locked?
  isLock?: boolean;
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
}
export interface UserInfo {
  id: string;
  username: string;
  node_id: string;
  node: Info;
  status: number;
  created_at: string;
  updated_at: string;
  roles: RoleFormData[];
}

interface Info {
  node_name: string;
  node_type: 'Root' | 'Company' | 'Agent' | 'Shop' | 'Site';
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}
