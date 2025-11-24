export interface SiteForm {
  id?: number;
  name: string;
  province: string;
  city: string;
  area: string;
  address: string;
  parent_id: string;
  status: number;
  pay_rule_url: string;
  logo_url: string;
  fetch_type: number;
  partner_type: string;
  scene_type: string;
  sub_scene_type: string;
  contact: string;
  phone: string;
  note: string;
  remark: string;
  node?: Record<string, any>;
  time?: string[]; // 营业时间
  provinceAndCity?: any; // 省市区
  week_mask: number[]; // 星期掩码，1-7表示星期一到星期日
  time_ranges: string[]; // 时间范围数组，格式如["630-1350","1360-1450"]
  materiel_group_wechat: string; // 物料沟通群
  materiel_phone: string; // 物料联系电话
  site_group_wechat: string; // 网点对账群
  site_group_phone: string; // 对账对接人
  ding_staff: {
    name: string; // 关联业务员
  };
  ding_staff_id: string;
}

type PickSiteForm = Pick<SiteForm, 'name' | 'status' | 'remark'>;

export interface SiteTable extends PickSiteForm {
  agent_name: string;
  shop_name: string;
  create_time: number;
}
