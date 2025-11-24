import { defHttp } from '@/utils/http/axios';
import { useGlobSetting } from '@/hooks/setting';
import type { UploadFileParams } from '#/axios';

const { uploadUrl = '' } = useGlobSetting();

export function uploadApi(url = '', params: UploadFileParams) {
  return defHttp.uploadFile(
    {
      url: uploadUrl + url + '/upload/',
    },
    params,
  );
}

export function uploadVersionsApi(params: UploadFileParams) {
  return defHttp.uploadFile(
    {
      url: uploadUrl + '/versions/upload/',
    },
    params,
  );
}
