import { moneyOther, normalRule } from '@/utils/pattern';
import { handleMoney } from '@/utils/tools';
import { minuteToHours } from '@/utils/dateUtil';

export const rules = {
  name: [{ required: true, message: '规则名称不能为空', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  forget_count: normalRule,
  deposit: moneyOther,
  prepaid: moneyOther,
  forget_paid: moneyOther,
  cost: {
    end_time: [{ required: true, message: '清柜时间不能为空', trigger: 'change' }],
    per_time: normalRule,
    top_time: normalRule,
    per_money: moneyOther,
    top_money: moneyOther,
    owing_time: normalRule,
    free_time: normalRule,
    unlock_count: normalRule,
  },
};

export function buildForm(form?: any) {
  return {
    name: form.name,
    forget_count: form.forget_count ?? 0, // 忘记取包次数
    forget_paid: handleMoney(form.forget_paid) ?? 0, // 忘记取包费用
    locker_type: form.locker_type ?? 1, // 柜门类型
    type: form.type ?? 1, // 收费类型
    deposit: handleMoney(form.deposit) ?? 0, // 押金
    prepaid: handleMoney(form.prepaid) ?? 0, // 预付费
    desc: form.desc ?? '', // 描述
    cost: {
      unlock_count: form.cost?.unlock_count ?? 0, // 开门次数
      free_time: form.cost?.free_time, // 免费时长
      end_time: minuteToHours(form.cost?.end_time), // 清柜时间
      per_time: form.cost?.per_time, // 单位时长
      top_time: form.cost?.top_time, // 封顶时长
      per_money: handleMoney(form.cost?.per_money), // 单位金额
      top_money: handleMoney(form.cost?.top_money), // 封顶金额
      owing_time: form.cost?.owing_time, // 超时时长
    },
  };
}
