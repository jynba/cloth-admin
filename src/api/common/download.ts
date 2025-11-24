import { defHttp } from '@/utils/http/axios';

/**
 * @description 导出数据，提供导出接口和过滤参数可选
 * @param url
 * @param params
 * @returns any
 */
export const ExportDataApi = (url: string, params?: any) =>
  defHttp.post({
    url,
    params,
    responseType: 'blob',
    // headers: {
    //   'Content-type': 'application/octet-stream',
    // },
  });
