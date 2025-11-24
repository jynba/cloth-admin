import { dictTypeEnum } from '@/enums';

export const menus = [
  {
    name: 'PC端菜单',
    path: '/system/authMenu/pc',
  },
  {
    name: '商户端菜单',
    path: '/system/authMenu/wechat',
  },
];

export const menuDictTypeOption = [
  { label: 'PC端菜单', value: dictTypeEnum.PC },
  { label: '商户端菜单', value: dictTypeEnum.WX },
];
