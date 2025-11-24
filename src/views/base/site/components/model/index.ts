// import { phoneRule } from '@/utils/pattern';
import type { SiteForm } from '../../types';
// import { minuteToHours } from '@/utils/dateUtil';

// 表单校验
export const rules = {
  name: [{ required: true, message: '网点名称不能为空', trigger: 'change' }],
  parent_id: [{ required: true, message: '所属商户不能为空', trigger: 'change' }],
  address: [{ required: true, message: '详细地址不能为空', trigger: 'change' }],
  provinceAndCity: [{ required: true, message: '地址不能为空', trigger: 'change' }],
  // close_time: [{ required: true, message: '营业接受时间不能为空', trigger: 'change' }],
  // open_time: [{ required: true, message: '营业开始时间不能为空', trigger: 'change' }],
  // phone: [phoneRule()],
};

// 表单数据
export function buildForm(form?: SiteForm) {
  return {
    name: form?.name,
    provinceAndCity: form?.provinceAndCity, // 省市区
    address: form?.address, // 详细地址
    province: form?.province,
    city: form?.city,
    area: form?.area,
    parent_id: form?.node?.parent?.id,
    status: form?.status ?? 1,
    ding_staff_id: form?.ding_staff?.name ?? '',
    // fetch_type: form?.fetch_type ?? 1, // 取包方式
    // pay_rule_url: form?.pay_rule_url, //收费规则图片
    // logo_url: form?.logo_url, // logo图片
    // partner_type: form?.partner_type, // 合作类型
    // scene_type: form?.scene_type, // 场景分类
    // sub_scene_type: form?.sub_scene_type, // 子场景分类
    contact: form?.contact,
    phone: form?.phone,
    // note: form?.note,
    // open_time: minuteToHours(form?.open_time ?? 0),
    // close_time: minuteToHours(form?.close_time ?? 0),
    remark: form?.remark,
    week_mask: form?.week_mask || [], // 星期掩码
    time_ranges: form?.time_ranges || [], // 时间范围
    materiel_group_wechat: form?.materiel_group_wechat,
    materiel_phone: form?.materiel_phone,
    site_group_wechat: form?.site_group_wechat,
    site_group_phone: form?.site_group_phone,
    is_test: form?.node?.is_test ?? false,
  };
}
