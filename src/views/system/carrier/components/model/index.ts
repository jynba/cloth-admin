export const rules = {
  name: [{ required: true, message: '名称不能为空', trigger: 'change' }],
  mp_app_id: [{ required: true, message: 'id不能为空', trigger: 'change' }],
  oa_app_id: [{ required: true, message: 'id不能为空', trigger: 'change' }],
};

export function buildForm(form?: any) {
  return {
    name: form.name,
    mp_app_id: form.mp_app_id,
    oa_app_id: form.oa_app_id,
  };
}
