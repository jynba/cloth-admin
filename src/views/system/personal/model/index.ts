export const rulesPassword = {
  newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '确认密码不能为空', trigger: 'blur' }],
  username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
};
