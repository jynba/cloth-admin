export { default as EditTemplate } from './EditTemplate.vue';
// 企业模板数据结构
export interface EnterpriseClothingData {
  top: EnterpriseTopWear; // 上衣
  pants: EnterprisePantsWear; // 裤装
  skirt: EnterpriseSkirtWear; // 裙装
}

export interface EnterpriseTopWear {
  neck_circumference: number; // 领围
  shoulder_width: number; // 肩宽
  chest_circumference: number; // 胸围
  abdomen_circumference: number; // 腹围
  hip_circumference: number; // 臀围
  sleeve_length: number; // 袖长
  upper_arm_circumference: number; // 大臂围
  cuff_circumference: number; // 袖口
  front_length_shirt: number; // 前长（衬衫）
  back_length_shirt: number; // 后长（衬衫）
  front_length_suit: number; // 前长（西装）
  back_length_suit: number; // 后长（西装）
  remark: string; // 备注
}

export interface EnterprisePantsWear {
  waist_circumference: number | string; // 腰围
  hip_circumference: number | string; // 臀围
  rise_including_waist: number | string; // 立裆含腰
  thigh_circumference: number | string; // 大腿围
  pants_length: number | string; // 裤长
  leg_opening: number | string; // 裤口
  remark: string; // 备注
}

export interface EnterpriseSkirtWear {
  waist_circumference: number | string; // 腰围
  hip_circumference: number | string; // 臀围
  skirt_length: number | string; // 裙长
  remark: string; // 备注
}

// 个人模板数据结构
export interface PersonalClothingData {
  top: PersonalTopWear; // 上衣
  pants: PersonalPantsWear; // 裤装
  skirt: PersonalSkirtWear; // 裙装
}

export interface PersonalTopWear {
  neck_circumference: number | string; // 领围
  shoulder_width: number | string; // 肩宽
  chest_circumference: number | string; // 胸围
  abdomen_circumference: number | string; // 腹围
  hip_circumference: number | string; // 臀围

  left_sleeve_length: number | string; // 左袖长
  right_sleeve_length: number | string; // 右袖长

  front_chest_width: number | string; // 前胸宽
  back_width: number | string; // 后背宽

  upper_arm_circumference: number | string; // 大臂围
  cuff_circumference: number | string; // 袖口

  front_length_with_remark: number | string; // 前长（需在输入框内备注衬衫/西装/马甲）
  back_length_with_remark: number | string; // 后长（需在输入框内备注衬衫/西装/马甲）

  bust_apex_height: number | string; // 胸高点
  bust_distance: number | string; // 胸间距

  front_waist_section: number | string; // 前腰节
  back_waist_section: number | string; // 后腰节

  remark: string; // 备注
}

export interface PersonalPantsWear {
  waist_circumference: number | string; // 腰围
  hip_circumference: number | string; // 臀围

  rise_including_waist: number | string; // 立裆含腰
  crotch_including_waist: number | string; // 通裆含腰

  thigh_circumference: number | string; // 大腿围

  pants_length: number | string; // 裤长
  leg_opening: number | string; // 裤口

  remark: string; // 备注
}

export interface PersonalSkirtWear {
  waist_circumference: number | string; // 腰围
  hip_circumference: number | string; // 臀围
  skirt_length: number | string; // 裙长
  remark: string; // 备注
}

// 款式配置
export type CategoryType = 'shirt' | 'suit' | 'vest' | 'other';
export interface StyleConfig {
  category: CategoryType; // 品类（单选）
  shirt_style?: ShirtStyle; // 衬衫款式
  suit_style?: SuitStyle; // 西装款式
}

/* ------------------------- 品类 ------------------------- */
// 旧结构废弃：改为单选字符串
// export interface Category {
//   shirt: boolean; // 衬衫
//   suit: boolean; // 西装
//   vest: boolean; // 马甲
//   other: string; // 其他（手动输入）
// }

/* ------------------------- 衬衫款式 ------------------------- */
export interface ShirtStyle {
  main_fabric_no: string; // 主面料号（手动输入）
  sub_fabric_no: string; // 辅面料号（手动输入）

  /* ---------- 领型 ---------- */
  collar_type: string; // 领型：
  // A01=直角立领
  // A02=圆角立领
  // A11=尖领
  // A12=领扣领
  // A20=方领
  // A21=开领
  // A22=大开领
  // A23=一字领
  // A90=燕式领
  collar_with_white: boolean; // 是否配白（默认否）

  /* ---------- 袖型 ---------- */
  sleeve_type: string; // 袖型：
  // C01=截角袖
  // C02=圆角袖
  // C03=直角袖
  // C04=法式袖
  sleeve_with_white: boolean; // 是否配白（默认否）

  /* ---------- 后身省 ---------- */
  back_pleat: string; // 后身省：
  // B00=无褶
  // B01=中间褶
  // B02=两侧褶
  // B03=收腰省

  /* ---------- 胸袋 ---------- */
  chest_pocket: string; // 胸袋：
  // P00=无胸袋
  // P01=截角袋
  // P02=圆角袋
  // P03=尖角袋

  /* ---------- 门襟 ---------- */
  placket: string; // 门襟：
  // F01=平门襟
  // F02=明门襟
  // F03=暗门襟

  lining: string; // 衬：常规 / 柔软
  grade: string; // 等级：常规 / 经典
  button: string; // 纽扣：常规 / 珍贝

  embroidery_content: string; // 绣花内容
  embroidery_color: string; // 绣花颜色
  embroidery_position: string; // 绣花部位

  remark: string; // 备注
}

/* ------------------------- 西装款式 ------------------------- */
export interface SuitStyle {
  button_style: string; // 单排扣 / 双排扣（选后可继续手动输入）

  vent: string; // 后开衩：
  // 无衩 / 中衩 / 双衩

  lapel: string; // 驳头：
  // 平驳头 / 戗驳头 / 青果领

  lapel_width: string; // 驳头宽（手动输入）

  pocket: string; // 口袋：正常
  chest_pocket: string; // 胸兜：正常

  sleeve_button: string; // 袖扣：
  // 真袖衩 / 假袖衩

  inner_lining: string; // 内部：
  // 全里 / 半里

  workmanship: string; // 工艺：
  // 粘合衬 / 半毛衬 / 全毛衬

  dress_pants: string; // 西裤褶：
  // 无褶 / 单褶 / 双褶

  leg_opening: string; // 脚口：
  // 常规 / 外翻边

  remark: string; // 备注（手动输入）
}
