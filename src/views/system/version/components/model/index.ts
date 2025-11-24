export const rules = {
  code: [{ required: true, message: '版本号不能为空', trigger: 'change' }],
  device_type: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
  file_url: [{ required: true, message: '文件路径不能为空', trigger: 'change' }],
  platform: [{ required: true, message: '版本不能为空', trigger: 'change' }],
  description: [{ required: true, message: '更新内容不能为空', trigger: 'change' }],
};

export function buildForm(form?: any) {
  return {
    code: form?.code,
    device_type: form?.device_type,
    platform: form?.platform,
    status: form?.status ?? 1,
    file_url: form?.file_url,
    description: form?.description,
  };
}
