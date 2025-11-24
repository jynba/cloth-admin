export const rules = {
  name: [{ required: true, message: '公司名称不能为空', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  contact_phone: [
    { required: true, message: '联系电话不能为空', trigger: 'change' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'change' },
  ],
  address: [{ required: true, message: '地址不能为空', trigger: 'change' }],
};

export function areaForm(form?: any) {
  return {
    id: form?.id,
    name: form?.name || '',
    status: form?.status ?? 1,
    contact_phone: form?.contact_phone || '',
    address: form?.address || '',
  };
}
