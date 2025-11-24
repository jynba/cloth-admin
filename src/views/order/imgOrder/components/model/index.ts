export const rules = {
  site_id: [{ required: true, message: '网点不能为空', trigger: 'blur' }],
};

export function buildForm(form?) {
  return {
    site_id: form.site_id,
    status: form.status,
    remark: form.remark,
  };
}

export const refundRules = (payed) => {
  return {
    money: [
      { required: true, message: '退款金额不能为空', trigger: 'blur' },
      {
        pattern: /^(?!0+(?:\.0+)?$)(?:999|999.0|999.00|\d{1,4}(?:\.\d{1,2})?)$/,
        message: '数值区间在0.01-9999.99',
        trigger: 'blur',
      },
      {
        validator: (rule, value, callback) => {
          if (value > payed) {
            callback(new Error('退款金额不能大于实付金额'));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
  };
};

export function buildRefundForm(form?) {
  return {
    money: '',
    remark: form.remark,
  };
}
