import { phoneRule } from '@/utils/pattern';
import type { FormType } from '../../types';

export const rules = {
  username: [{ required: true, message: '账号不能为空', trigger: 'change' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'change' }], // 新增时必填；编辑时在组件中动态置为非必填
  phone: [phoneRule(false)],
  role: [{ required: true, message: '角色不能为空', trigger: 'change' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
};

export function buildForm(form?: FormType) {
  return {
    id: form?.id,
    username: form?.username,
    password: '',
    phone: form?.phone,
    real_name: form?.real_name,
    role: form?.role ?? 1,
    status: form?.status ?? 1,
  } as FormType;
}

// 修改密码（备用）
export const rulesPassword = {
  newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '确认密码不能为空', trigger: 'blur' }],
};

export function buildFormPassword(form?: any) {
  return {
    newPassword: form?.newPassword,
    confirmPassword: form?.confirmPassword,
  };
}
