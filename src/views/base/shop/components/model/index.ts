import type { ShopForm } from '../../types';
import { useGlobSetting } from '@/hooks/setting';

const globSetting = useGlobSetting();

export const rules = {
  name: [{ required: true, message: '商户名称不能为空', trigger: 'blur' }],
  parent_id: [{ required: true, message: '请选择平台', trigger: 'blur' }],
  mch: [{ required: true, message: '入账编号不能为空', trigger: 'blur' }],
};

export const useBalanceEnable = [
  { label: '可使用余额', value: true },
  { label: '禁止使用余额', value: false },
];

export function buildForm(form?: ShopForm) {
  return {
    name: form?.name,
    status: form?.status || 1,
    parent_id: form?.node?.parent?.id,
    mch: form?.mch || globSetting.mch_huifu,
    remark: form?.remark,
    contact: form?.contact,
    phone: form?.phone,
    NodeListMap: form?.NodeListMap || [],
    rate_map: {
      shop: form?.rate_map?.shop ?? 0,
      agent1: form?.rate_map?.agent1 ?? 0,
      agent2: form?.rate_map?.agent2 ?? 0,
      agent3: form?.rate_map?.agent3 ?? 0,
      agent4: form?.rate_map?.agent4 ?? 0,
      agent5: form?.rate_map?.agent5 ?? 0,
      agent6: form?.rate_map?.agent6 ?? 0,
      agent7: form?.rate_map?.agent7 ?? 0,
      agent8: form?.rate_map?.agent8 ?? 0,
      agent9: form?.rate_map?.agent9 ?? 0,
      agent10: form?.rate_map?.agent10 ?? 0,
      company: form?.rate_map?.company ?? 100,
    },
    is_test: form?.node?.is_test ?? false,
  };
}
