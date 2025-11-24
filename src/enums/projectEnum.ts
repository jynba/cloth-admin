import { lastWeek, withLastMonth } from '@/utils/dateUtil';
import type { StatusList } from '#/query';
import { useGlobSetting } from '@/hooks/setting';
/**
 * @description 配合枚举使用，用于表格中的枚举值转对应描述，以及tag标签样式
 * @param val
 * @param list
 * @returns 返回对应数组值
 */

export function handleTableFilterArr(val: string | number | boolean, list: Array<StatusList | any>) {
  return list.filter((item) => item.value === val)[0];
}

export const bundlesType: StatusList[] = [
  { label: '先付费商品', value: 1 },
  // { label: '后付费商品', value: 3 },
];

export const sexType: StatusList[] = [
  { label: '男', value: 1 },
  { label: '女', value: 2 },
  { label: '通用', value: 3 },
];

export const bundlesStatus: StatusList[] = [
  { label: '上架', value: 1, tag: 'success' },
  { label: '下架', value: 2, tag: 'danger' },
];

export enum bundlesEnum {
  UP = 1,
  DOWN = 2,
}

export const managerStatus: StatusList[] = [
  { label: '正常', value: 1, tag: 'success' },
  { label: '停用', value: 2, tag: 'danger' },
];

export enum managerEnum {
  NORMAL = 1,
  DISABLE = 2,
}

export const exceptionStatusEnum = {
  EXCEPTION: 1,
  NORMAL: 2,
};
export const exceptionStatus: StatusList[] = [
  { label: '异常', value: exceptionStatusEnum.EXCEPTION, tag: 'danger' },
  { label: '正常', value: exceptionStatusEnum.NORMAL, tag: 'success' },
];

export enum deviceEnum {
  CARD = 1,
  NEWSPAPER = 2,
}
export const deviceType: StatusList[] = [
  { label: '打卡机', value: deviceEnum.CARD },
  { label: '拍报机', value: deviceEnum.NEWSPAPER },
];

export const styleType: StatusList[] = [
  { label: '明信片', value: 'postcard' },
  { label: '报纸', value: 'newspaper' },
  { label: '贴纸', value: 'sticker' },
];

export const printerModelReflect: StatusList[] = [
  { label: '佳能(黑白)', value: '佳能' },
  { label: '惠普(黑白)', value: '惠普' },
  { label: '爱普生(彩色)', value: '爱普生' },
];

export const templateType: StatusList[] = [
  { label: '经典款(6*4)', value: 'classic' },
  { label: '双联分享款(6*2*2)', value: 'dual_sharing' },
];

export const templateColorEnum = {
  BLACKWHITE: 1, // 黑白
  COLOURS: 2, // 彩色
};
export const templateColor: StatusList[] = [
  { label: '黑白', value: templateColorEnum.BLACKWHITE },
  { label: '彩印', value: templateColorEnum.COLOURS },
];

export const roleNodeType: StatusList[] = [
  { label: '超级管理员', value: 'Root' },
  { label: '公司', value: 'Company' },
  { label: '合作商', value: 'Agent' },
  { label: '商户', value: 'Shop' },
  { label: '网点', value: 'Site' },
];

export const follwStatus: StatusList[] = [
  { label: '未关注', value: 0, tag: 'info' },
  { label: '关注中', value: 1, tag: 'success' },
  { label: '已取关', value: 2, tag: 'danger' },
];

export const followType: StatusList[] = [
  { label: '未关注', value: false, tag: 'info' },
  { label: '已关注', value: true },
];

export const payChannel: StatusList[] = [
  { label: '微信', value: 'wechat', tag: 'success' },
  { label: '支付宝', value: 'alipay' },
];

export const memberType: StatusList[] = [
  { label: '公众号用户', value: 1, tag: 'success' },
  { label: '非公众号用户', value: 2, tag: 'warning' },
];

export const modelStatusType: StatusList[] = [
  { label: '工厂模式', value: 1, tag: 'info' },
  { label: '出厂模式', value: 2, tag: 'warning' },
  { label: '已安装', value: 3, tag: 'primary' },
  { label: '已上线', value: 4, tag: 'success' },
  { label: '已撤机', value: 5, tag: 'danger' },
];

export enum modelStatusEnum {
  Factory = 1,
  OutFactory = 2,
  Installed = 3,
  Online = 4,
  Stop = 5,
}

export const orderStatus: StatusList[] = [
  { label: '处理中', value: 1, tag: 'success' },
  { label: '已完成', value: 2, tag: 'danger' },
  { label: '失败', value: 3, tag: 'danger' },
  { label: '部分退款', value: 4, tag: 'danger' },
  { label: '已退款', value: 5, tag: 'danger' },
  { label: '自动退款', value: 6, tag: 'danger' },
];

export const owingStatus: StatusList[] = [
  { label: '未超时', value: false, tag: 'info' },
  { label: '超时', value: true, tag: 'warning' },
];

export const couponUserStatus: StatusList[] = [
  { label: '待使用', value: 0, tag: 'success' },
  { label: '已使用', value: 1, tag: 'danger' },
  { label: '已作废', value: 2, tag: 'warning' },
  { label: '已过期', value: 3, tag: 'info' },
];

export const agentType: StatusList[] = [
  { label: '代理', value: 'self' },
  { label: '市场', value: 'market' },
  { label: '介绍人', value: 'introducer' },
  { label: '分公司', value: 'branch' },
];

// 机柜在线离线
export const onlineStatus: StatusList[] = [
  { label: '在线', value: true, tag: 'success' },
  { label: '离线', value: false, tag: 'danger' },
];

// 设备预警状态
export const alarmStatus: StatusList[] = [
  { label: '正常', value: 1, tag: 'success' },
  { label: '预警中', value: 2, tag: 'warning' },
];

export const lockerStatus: StatusList[] = [
  { label: '可用', value: 1, tag: 'success' },
  { label: '占用', value: 2, tag: 'danger', disabled: true },
  { label: '停用', value: 3, tag: 'info' },
];

export const lockerType: StatusList[] = [
  { label: '小柜', value: 1 },
  { label: '中柜', value: 2, tag: 'warning' },
  { label: '大柜', value: 3, tag: 'success' },
];

export const couponType: StatusList[] = [
  { label: '抵扣时长', value: 1 },
  { label: '抵扣现金', value: 2 },
  { label: '日通票', value: 3 },
];

export const couponStatus: StatusList[] = [
  { label: '上架', value: 1, tag: 'success' },
  { label: '下架', value: 2, tag: 'danger' },
];

export const rulesType: StatusList[] = [
  { label: '免费', value: 1, tag: 'success' },
  { label: '按时', value: 2 },
  { label: '按柜', value: 3, tag: 'warning' },
];
/**
 * @description 网点模块
 */
export const fetchType: StatusList[] = [{ label: '手机号加密码', value: 1 }];

/**
 * @description 财务模块
 * @package
 */

export const timeOptions = [
  { name: '日', value: 1, label: 'date' },
  { name: '月', value: 2, label: 'month' },
  { name: '年', value: 3, label: 'year' },
];

export enum timeOptionsEnum {
  DAY = 1,
  MONTH,
  YEAR,
}

export const timeSelect = [
  { name: '最近一周', value: 'week', checked: true, timeFun: lastWeek() },
  { name: '最近一个月', value: 'month', checked: false, timeFun: withLastMonth() },
  { name: '最近三个月', value: 'threeMonth', checked: false, timeFun: withLastMonth(3) },
];

export const flowOptions = [
  { name: '全部', value: '', checked: true },
  { name: '收入', value: 1, checked: false },
  { name: '结算', value: 2, checked: false },
  { name: '提现', value: 3, checked: false },
  { name: '手续费', value: 4, checked: false },
];

export const orzOptions = [
  { label: '公司', value: 'Company' },
  { label: '合作商', value: 'Agent' },
  { label: '商户', value: 'Shop' },
  { label: '网点', value: 'Site' },
];

export const orzOptionsChecked = [
  { name: '公司', value: 'Company', checked: false },
  { name: '合作商', value: 'Agent', checked: false },
  { name: '商户', value: 'Shop', checked: false },
  { name: '网点', value: 'Site', checked: false },
];

export const baseStatTableVisibleList = [
  { label: '网点', prop: '1', visible: true },
  { label: '时间', prop: '1', visible: true },
  { label: '新增用户', prop: '1', visible: true },
  { label: '新增订单', prop: '1', visible: true },
  { label: '营收金额', prop: '1', visible: true },
  { label: '平台分成', prop: '1', visible: true },
  { label: '单门均天营收', prop: '1', visible: true },
  { label: '单门均天分成', prop: '1', visible: true },
  { label: '单门均天订单', prop: '1', visible: true },
  { label: '人均营收', prop: '1', visible: true },
  { label: '订单均营收', prop: '1', visible: true },
  { label: '订单均时长', prop: '1', visible: true },
  { label: '人流量', prop: '1', visible: true },
  { label: '未下单新用户', prop: '1', visible: true },
];

export const settleType = [
  { label: '每天', value: 0 },
  { label: '每周', value: 1 },
  { label: '每月', value: 2 },
  { label: '每年', value: 3 },
];

export const weekArr = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周日', value: 7 },
];

// 处理status,样式和值一起返回
export const handleStatus: StatusList[] = [
  { label: '正常', value: 1, tag: 'success' },
  { label: '停用', value: 2, tag: 'danger' },
  { label: '不可用', value: 3, tag: 'info' },
];

export const payRulesUnit = [
  { label: '分钟', value: 1 },
  { label: '小时', value: 2 },
  { label: '天', value: 3 },
];

export const versionStatus = [
  { label: '正常', value: 1, tag: 'success' },
  { label: '停用', value: 2, tag: 'danger' },
];

export const taskStatus: StatusList[] = [
  { label: '进行中', value: 1, tag: 'warning' },
  { label: '成功', value: 2, tag: 'success' },
  { label: '失败', value: 3, tag: 'danger' },
];

// 异常模块
export const exceptionModule: StatusList[] = [
  { label: '网络', value: 'network' },
  { label: '打印机', value: 'printer' },
  { label: '相机', value: 'camera' },
  { label: '应用程序', value: 'application' },
  { label: '渲染', value: 'rendering' },
];

// 处理状态
export const dealStatus: StatusList[] = [
  // { label: '待处理', value: 1, tag: 'danger' },
  { label: '自动恢复', value: 2, tag: 'primary' },
  { label: '人工处理', value: 3, tag: 'success' },
];

export enum dealEnum {
  PENDING = 1,
  AUTO = 2,
  HANDING = 3,
}

export const packageStatus: StatusList[] = [
  { label: '上架', value: 1, tag: 'success' },
  { label: '下架', value: 2, tag: 'danger' },
];

export enum packageEnum {
  UP = 1,
  DOWN = 2,
}

export enum dictTypeEnum {
  PC = 'permission',
  WX = 'wx_permission',
}

export enum roleTypeEnum {
  PC = 1,
  WX = 2,
}

export const roleType: StatusList[] = [
  { label: 'PC端', value: roleTypeEnum.PC },
  { label: '微信商家端', value: roleTypeEnum.WX },
];

const globSetting = useGlobSetting();
const { mch_huifu, mch_origin } = globSetting;
console.log(mch_huifu, mch_origin);
export const payChannelList: StatusList[] = [
  { label: '汇付支付', value: mch_huifu },
  { label: '原生支付(微信)', value: mch_origin },
];

export const channelType: StatusList[] = [
  { label: '手机上传', value: 'phone' },
  { label: '设备拍照', value: 'device' },
];

export const PaperLessDetectionStatus = [
  { label: '正常', value: 6, tag: 'success', desc: '剩余纸量大于50张' },
  { label: '正常', value: 5, tag: 'success', desc: '剩余纸量大于50张' },
  { label: '少纸', value: 4, tag: 'warning', desc: '剩余纸量大于20张小于50张' },
  { label: '少纸', value: 3, tag: 'warning', desc: '剩余纸量大于20张小于50张' },
  { label: '非常少', value: 2, tag: 'danger', desc: '剩余纸量小于20张' },
  { label: '预校准无纸张', value: 0, tag: 'danger', desc: '纸盒待装入纸张' },
];

// 纸张检测器连接状态（少纸检测器）
export const PaperLessDetectorConnectStatus = [
  { label: '正常', value: '1', tag: 'success' },
  { label: '断开', value: '0', tag: 'danger' },
];

// 纸张检测器剩余电量等级（0-5）
export const PaperLessDetectorPowerLevel = [
  { label: '95%-100%', value: 5, tag: 'success' },
  { label: '75%-94%', value: 4, tag: 'success' },
  { label: '50%-75%', value: 3, tag: 'warning' },
  { label: '25%-50%', value: 2, tag: 'warning' },
  { label: '2%-25%', value: 1, tag: 'danger' },
  { label: '2%', value: 0, tag: 'danger' },
];

export const aiVideoStatus: StatusList[] = [
  { label: '处理中', value: 0, tag: 'warning' },
  { label: '已完成', value: 1, tag: 'success' },
  { label: '失败', value: 2, tag: 'danger' },
];

export const deviceStatus: StatusList[] = [
  { label: '正常', value: 1, tag: 'success' },
  { label: '停用', value: 2, tag: 'danger' },
];

export enum deviceStatusEnum {
  NORMAL = 1,
  DISABLE = 2,
}

/**
 * AI模型枚举及选项
 */

export enum engineEnum {
  BANANA = 'banana',
  VOLCANO_DREAM = 'volcano_dream',
  VOLCANO = 'volcano',
  TENCENT = 'tencent',
  NoEngine = 'none',
}

export const engineOptions: StatusList[] = [
  { label: 'Banana', value: engineEnum.BANANA },
  { label: '火山 4.0', value: engineEnum.VOLCANO_DREAM },
  { label: '火山 3.0', value: engineEnum.VOLCANO },
  { label: '腾讯', value: engineEnum.TENCENT },
  { label: '无需模型，原图直出', value: engineEnum.NoEngine },
];
