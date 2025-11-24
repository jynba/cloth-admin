import { trim } from '@/utils/validate';
/**
 * @description 表单正则校验
 */

export const bankCardRule = [
  {
    required: true,
    message: '仅支持数字且16-19位',
    validator: (rule, value, callback) => {
      if (!/^\d+$/.test(trim(value))) {
        return callback(new Error('仅支持数字且16-19位'));
      }
      callback();
    },
    trigger: 'blur',
  },
];

export const idCardRule = [
  {
    required: true,
    message: '只支持数字、大写字母且6-18位数',
    pattern: /^[0-9A-Z]{6,18}$/,
    trigger: 'blur',
  },
];

export const moneyRule = [
  {
    required: true,
    message: '数值区间在0.01-9999999.99',
    pattern: /^(?!0+(?:\.0+)?$)(?:999|999.0|999.00|\d{1,9}(?:\.\d{1,2})?)$/,
    trigger: 'change',
  },
];

export const percentRule = [
  {
    required: true,
    message: '数值区间在0-100,且最多2位小数',
    pattern: /^(0|100|([1-9]\d?)|(0|[1-9]\d?)(\.\d{1,2}))?$/,
    trigger: 'change',
  },
];

export const moneyOther = [
  {
    required: true,
    message: '格式错误,只支持正数,且最多2位小数',
    pattern: /^[1-9](\d+)?(?:\.\d{1,2})?$|^0$|^\d\.\d{1,2}$/,
    trigger: 'change',
  },
];

export const moneyOtherWithoutRequired = [
  {
    required: false,
    message: '格式错误,只支持正数,且最多2位小数',
    pattern: /^[1-9](\d+)?(?:\.\d{1,2})?$|^0$|^\d\.\d{1,2}$/,
    trigger: 'change',
  },
];
// 文本校验规则
// export const textRule = [
//   {
//     required: true,
//     message: '描述不能为空',
//     trigger: 'change'
//   }
// ];
export const normalRule = [
  { required: true, message: '数值区间在0-999999999的整数', pattern: /^\d{1,9}$/, trigger: 'change' },
];
export const normalRuleWithoutRequired = [
  { required: false, message: '数值区间在0-999999999的整数', pattern: /^\d{1,9}$/, trigger: 'change' },
];

export const numberGtOneRule = [
  { required: true, message: '请输入大于0的数字', pattern: /^[1-9]\d*$/, trigger: 'change' },
];
export const numberGtOneRuleWithoutRequired = [
  { required: false, message: '请输入大于0的数字', pattern: /^[1-9]\d*$/, trigger: 'change' },
];

export const numberRule = [
  { required: true, message: '请输入1-99之间的数字', pattern: /^[1-9]\d?$/, trigger: 'change' },
];
export const requiredRule = [{ required: true, message: '该项不能为空', trigger: 'change' }];
export const phoneRule = (required = true) => ({
  required,
  message: '手机号格式错误',
  // pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
  pattern: /^\d{6,11}$/,
  trigger: 'blur',
});
export const textRule = (required = true) => [
  ...(required ? requiredRule : []),
  ...[
    {
      message: '不能输入特殊字符\\/^$*{}()\'"`且最长50个字符',
      pattern: /^[^\\/^$*{}()'"`]{0,50}$/,
      trigger: 'change',
    },
  ],
];
export const remarkRule = (required = true) => [
  ...(required ? requiredRule : []),
  ...[
    { message: '不能输入特殊字符\\/^$*{}()\'"`且最长50个字符', pattern: /^[^\\/^$*{}()'"`]{0,256}$/, trigger: 'blur' },
  ],
];

// 校验视频格式,通过后缀 - 已经使用了非捕获组，这个是正确的
export const isVideo = (file: any) => /\.(?:mp4|avi|wmv|flv|ogm|mpg|webm|ogv|mov|asx|mpeg)$/.test(file.name);

// 校验图片格式 - 已经使用了非捕获组，这个是正确的
export const isImage = (file: any) => /\.(?:gif|png|jpg|jpeg|webp|svg|psd|bmp|tif|pjpeg|apng|pjp)$/.test(file.name);

// 校验excel格式，通过文件类型 - 已经使用了非捕获组，这个是正确的
export const isSheet = (file: any) => /\.(?:xls|xlsx)$/.test(file.name);

// 判断是否为数值
export function isPositiveInteger(str: string) {
  return /^\d+$/.test(str);
}

// 判断数组是否为空
export function isArrayEmpty(arr: any): boolean {
  return !arr || !Array.isArray(arr) || arr.length === 0;
}
