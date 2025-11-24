import { roleTypeEnum } from '@/enums';

export const rules = {
  name: [{ required: true, message: '名称不能为空', trigger: 'change' }],
  node_type: [{ required: true, message: '描述不能为空', trigger: 'change' }],
  role_type: [{ required: true, message: '平台类型不能为空', trigger: 'change' }],
};

export function buildForm(form?: any) {
  return {
    name: form?.name,
    node_type: form?.node_type,
    role_type: form?.role_type ?? roleTypeEnum.PC,
    permissions: form?.permissions ?? [],
  };
}
