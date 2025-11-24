import { phoneRule } from '@/utils/pattern';
import type { FormType } from '../../types';
import { managerEnum } from '@/enums';

export const rules = {
  username: [{ required: true, message: '管理员账号不能为空', trigger: 'change' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'change' }],
  phone: [phoneRule(false)],
  node_type: [{ required: true, message: '账号类型不能为空', trigger: 'blur' }],
  role_ids: [{ required: true, message: '权限不能为空', trigger: 'change' }],
  node_id: [{ required: true, message: '组织不能为空', trigger: 'change' }],
};

export function buildForm(form?: FormType) {
  const role_ids = form?.roles?.map((item) => item.id);
  return {
    username: form?.username,
    password: form?.password,
    status: form?.status ?? managerEnum.NORMAL,
    node_id: form?.node_id,
    name: form?.node?.name,
    node_type: form?.node?.node_type,
    role_ids,
  };
}

// 修改密码
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
