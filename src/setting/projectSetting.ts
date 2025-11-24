import { CacheTypeEnum, DefaultColor } from '@/enums';

type deviceType = 'desktop' | 'mobile';

export interface ProjectConfig {
  permissionCacheType: CacheTypeEnum;
  device: deviceType;
  isCollapse: boolean;
  withoutAnimation: boolean;
  useErrorHandle: boolean;
  openKeepAlive: boolean;
  themeColor: string;
}

// ! You need to clear the browser cache after the change
const setting: ProjectConfig = {
  permissionCacheType: CacheTypeEnum.LOCAL,
  device: 'desktop',
  isCollapse: false,
  withoutAnimation: false,
  useErrorHandle: true, // 错误信息
  openKeepAlive: true,
  themeColor: DefaultColor.COLOR,
};

export default setting;
