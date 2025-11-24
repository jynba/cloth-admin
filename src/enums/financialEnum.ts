/*
 * @Author: pengjiaoli
 * @Date: 2024-01-05 14:49:25
 * @LastEditTime: 2025-08-15 10:23:00
 * @LastEditors: xujiayu
 */
import type { StatusList } from '#/query';

export enum WithdrawChannelEnum {
  hf = 1,
  free = 2,
}

export enum WithdrawTypeEnum {
  person = 1,
  company = 2,
  other = 3,
}

export const bankCardStatus: StatusList[] = [
  { label: '正常', value: 1, tag: 'success' },
  { label: '已删除', value: 2, tag: 'danger' },
];

export const withdrawTypeOptions = [
  { label: '个人账户', value: WithdrawTypeEnum.person },
  { label: '对公账户', value: WithdrawTypeEnum.company },
  { label: '其他方式', value: WithdrawTypeEnum.other },
];

export enum WithdrawOtherTextEnum {
  cargoDeduction = 1,
  shareAjust,
  costDeduction,
  transportCost,
  installCost,
  stickerCost,
}

export const withdrawOtherOptions = [
  { label: '抵扣货款', value: WithdrawOtherTextEnum.cargoDeduction },
  { label: '款项调整', value: WithdrawOtherTextEnum.shareAjust },
  { label: '杂项抵扣', value: WithdrawOtherTextEnum.costDeduction },
  { label: '扣运费', value: WithdrawOtherTextEnum.transportCost },
  { label: '扣安装费', value: WithdrawOtherTextEnum.installCost },
  { label: '扣贴纸费', value: WithdrawOtherTextEnum.stickerCost },
];

export enum hfStatusEnum {
  success = 2,
  fail = 3,
}

export const hfStatus: StatusList[] = [
  { label: '正常', value: 1, tag: 'primary' },
  // { label: '成功', value: 2, tag: 'success' },
  { label: '禁用', value: 2, tag: 'danger' },
];

export enum ApproveTypeEnum {
  processing = 1,
  pending = 2,
  execute = 3,
  done = 4,
  reject = 5,
}

export const approveStatus: StatusList[] = [
  { label: '待审核', value: 1, tag: 'primary' },
  { label: '待审批', value: 2, tag: 'primary' },
  { label: '待转账', value: 3, tag: 'warning' },
  { label: '已完成', value: 4, tag: 'success' },
  { label: '已驳回', value: 5, tag: 'danger' },
];

export const transferStatus: StatusList[] = [
  { label: '处理中', value: 1, tag: 'warning' },
  { label: '已完成', value: 2, tag: 'success' },
  { label: '失败', value: 3, tag: 'danger' },
];

export enum certTypeEnum {
  idCard = '00',
}

export enum CertValidityEnum {
  short = 0,
  long = 1,
}

export const certValidityType = [
  { label: '长期有效', value: 1 },
  { label: '截止日期', value: 0 },
];

export const bankList = [
  {
    label: '中国银行',
    value: '01040000',
  },
  {
    label: '中国农业银行',
    value: '01030000',
  },
  {
    label: '中国工商银行',
    value: '01020000',
  },
  {
    label: '中国建设银行',
    value: '01050000',
  },
  {
    label: '中国邮政储蓄银行',
    value: '04030000',
  },
  {
    label: '中国民生银行',
    value: '03050000',
  },
  {
    label: '交通银行',
    value: '03010000',
  },
  {
    label: '招商银行',
    value: '03080000',
  },
  {
    label: '华夏银行',
    value: '03040000',
  },
  {
    label: '上海浦东发展银行',
    value: '03100000',
  },
  {
    label: '浙商银行',
    value: '03160000',
  },
  {
    label: '广发银行',
    value: '03060000',
  },
  {
    label: '天津银行',
    value: '03130012',
  },
  {
    label: '济宁银行',
    value: '31346100',
  },
  {
    label: '兴业银行',
    value: '03090000',
  },
  {
    label: '中国光大银行',
    value: '03030000',
  },
  {
    label: '中信银行',
    value: '03020000',
  },
  {
    label: '平安银行',
    value: '03134402',
  },
  {
    label: '北京银行',
    value: '03130011',
  },
  {
    label: '宁波银行',
    value: '03133302',
  },
  {
    label: '中国农业发展银行',
    value: '02030000',
  },
  {
    label: '中国人民银行',
    value: '',
  },
  {
    label: '渤海银行',
    value: '03180000',
  },
  {
    label: '浦发银行',
    value: '77777781',
  },
  {
    label: '农村商业银行',
    value: '03140000',
  },
  {
    label: '邮储银行',
    value: '',
  },
  { label: '其他银行', value: 99999999 },
];

export const flowTypeList = [
  { label: '收入', value: 1 },
  { label: '结算', value: 2 },
  { label: '提现', value: 3 },
];

export enum FlowTypeEnum {
  INCOME = 1,
  SETTLEMENT = 2,
  WITHDRAW = 3,
  SERVERFEE = 4,
}

export const withdrawChannelOptions = [
  {
    label: '汇付天下',
    value: WithdrawChannelEnum.hf,
  },
  {
    label: '免费',
    value: WithdrawChannelEnum.free,
  },
];

export const serviceFeeOptions = [
  {
    label: '结算时自动扣除',
    value: true,
  },
  {
    label: '审核提现时手动扣除',
    value: false,
  },
];

export const invoiceType = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 2,
  },
];

export const tradeType = [
  {
    label: '充值',
    value: 1,
  },
  {
    label: '退款',
    value: 2,
  },
];

export const inMapOptions: StatusList[] = [
  { value: true, label: '是', tag: 'success' },
  { value: false, label: '否', tag: 'danger' },
];
