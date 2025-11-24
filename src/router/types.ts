import type { RouteMeta, RouteRecordRaw } from 'vue-router';
import type { RoleEnum } from '@/enums';
import type { defineComponent } from 'vue';

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>);

export interface PermissionState {
  accessedRoutes: AppRouteModule[];
  hasRoleRoutes: boolean;
}

interface IRouteMeta extends RouteMeta {
  roles?: RoleEnum[];
  orderNo?: number;
  activeMenu?: string; // 激活菜单
}

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children' | 'redirect'> {
  name: string;
  meta: IRouteMeta;
  component?: Component | string;
  components?: Component;
  children?: AppRouteRecordRaw[];
  props?: Recordable;
  fullPath?: string;
  hidden?: boolean;
  auth?: routeResult[];
  keepAlive?: boolean;
  redirect?: RouteRecordRaw['redirect'];
}

export interface MenuTag {
  type?: 'primary' | 'error' | 'warn' | 'success';
  content?: string;
  dot?: boolean;
}
export interface routeResult {
  label?: string;
  key?: string;
  disabled?: any;
  children?: routeResult[] | undefined;
  sort?: number | undefined;
}
export interface Menu {
  name: string;

  icon?: any;

  path: string;

  // path contains param, auto assignment.
  paramPath?: string;

  disabled?: boolean;

  children?: Menu[];

  orderNo?: number;

  roles?: RoleEnum[];

  meta?: Partial<RouteMeta>;

  tag?: MenuTag;

  hideMenu?: boolean;
}

export interface MenuModule {
  orderNo?: number;
  menu: Menu;
}

export type AppRouteModule = AppRouteRecordRaw;
