import { getCommonStoragePrefix, getStorageShortName } from '@/utils/env';

export function initAppConfigStore() {
  setTimeout(() => {
    clearObsoleteStorage();
  }, 16);
}

export function clearObsoleteStorage() {
  const commonPrefix = getCommonStoragePrefix();
  const shortPrefix = getStorageShortName();

  [localStorage, sessionStorage].forEach((item: Storage) => {
    Object.keys(item).forEach((key) => {
      if (key && key.startsWith(commonPrefix) && !key.startsWith(shortPrefix)) {
        item.removeItem(key);
      }
    });
  });
}
