import { getAppEnvConfig } from '@/utils/env';

const { VITE_GLOB_APP_TITLE } = getAppEnvConfig();
/**
 * @description 通过vue-router设置页面标题
 * @param pageTitle
 * @returns string
 */
export function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${VITE_GLOB_APP_TITLE}`;
  }
  return `${VITE_GLOB_APP_TITLE}`;
}
