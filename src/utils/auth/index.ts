import type { BasicKeys } from '@/utils/cache/persistent';
import { Persistent } from '@/utils/cache/persistent';
import { CacheTypeEnum, roleNodeType, TOKEN_KEY, USER_INFO_KEY } from '@/enums';
import projectSetting from '@/setting/projectSetting';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

// 获取缓存token信息
export function getToken(): string {
  return getAuthCache(TOKEN_KEY);
}

// 获取缓存用户信息
export function getUser() {
  return getAuthCache(USER_INFO_KEY);
}

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(key: BasicKeys, value) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}

export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}

export const handleNodeType = (node_type: string) => {
  // node_type只能展示当前node_type之后的组织（含当前node_type）
  const index = roleNodeType.findIndex((item) => item.value === node_type);
  return roleNodeType.slice(index);
};
