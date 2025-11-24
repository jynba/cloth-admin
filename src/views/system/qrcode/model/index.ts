export const qrcodeStatus = [
  { name: '正常', value: 'normal' },
  { name: '禁用', value: 'disabled' },
];

export const rules = {
  name: [{ required: true, message: '楼宇名称不能为空', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  contact: [{ required: true, message: '联系人不能为空', trigger: 'change' }],
  phone: [{ required: true, message: '联系方式不能为空', trigger: 'change' }],
};

export function qrcodeForm(form?: any) {
  return {
    count: form?.count,
    // status: form?.status,
    url: form?.url,
    // remark: form?.remark,
    carrier: form?.carrier,
  };
}
