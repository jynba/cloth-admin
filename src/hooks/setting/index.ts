import type { GlobConfig } from '../../../types/config';

import { warn } from '@/utils/log';
import { getAppEnvConfig } from '@/utils/env';

export const useGlobSetting = (): Readonly<GlobConfig> => {
  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_APP_ID,
    VITE_GLOB_MCH_HUIFU,
    VITE_GLOB_MCH_ORIGIN_WECHAT,
  } = getAppEnvConfig();

  if (!/[a-z_]*/i.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`,
    );
  }

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
    appId: VITE_GLOB_APP_ID,
    mch_huifu: VITE_GLOB_MCH_HUIFU,
    mch_origin: VITE_GLOB_MCH_ORIGIN_WECHAT,
  };
  return glob as Readonly<GlobConfig>;
};
