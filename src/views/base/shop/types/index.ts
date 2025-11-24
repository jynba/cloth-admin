export interface ShopForm {
  id?: string;
  name: string;
  status: number;
  parent_id: string;
  province: string;
  city: string;
  area: string;
  mch: string;
  use_balance_enable: boolean;
  address: string;
  remark: string;
  contact: string;
  phone: string;
  corp_name: string;
  note: string;
  agent_name?: string;
  site_count?: number;
  create_time?: number;
  info: {
    node_name: string;
    parent_name: string;
  };
  node?: {
    is_test: boolean;
    parent?: {
      name: string;
      id: string;
    };
  };
  NodeListMap: any[];
  rate_map: {
    shop: number;
    agent1: number;
    agent2: number;
    agent3: number;
    agent4: number;
    agent5: number;
    agent6: number;
    agent7: number;
    agent8: number;
    agent9: number;
    agent10: number;
    company: number;
  };

  /** ai视频开关 */
  ai_video_enable: boolean;
  /** 业务配置 */
  business_config?: IBusinessConfig[];
}

export interface IBusinessConfig {
  id?: string;
  prompt: string;
  sample_video: string;
  seed: number;
  watermark: boolean;
  wm_position: number;
  wm_url: string;
  shop: null;
  shop_id: string;
  sort_order: number;
  template_name: string;
  template_params: string;
  created_at: string;
  updated_at: string;
}
