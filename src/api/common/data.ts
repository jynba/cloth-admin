import { defHttp } from '@/utils/http/axios';
// 获取区域地址数据
export function getRegionData() {
  return defHttp.get(
    {
      url: 'https://web-file.xironiot.com/xiaoiron/common/static/json/chinese_area_data.json',
    },
    {
      apiUrl: '',
      joinPrefix: false,
    },
    // params
  );
}
