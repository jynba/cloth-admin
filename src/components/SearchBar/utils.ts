import { isObject } from '@/utils/is';
import type { FormDataOptions } from './types';
import { ComponentNameEnum } from './types';
import type { ColSizeObject } from 'element-plus';
import { add } from '@/utils/decimal';

export function getColSpanByComponentName(option: FormDataOptions) {
  if (option.componentName === ComponentNameEnum.datePicker && option?.attrs?.type?.includes?.('datetimerange')) {
    return {
      xl: 12,
      lg: 18,
      md: 24,
      sm: 24,
      xs: 24,
    };
  } else {
    return {
      xl: 3,
      lg: 4,
      md: 6,
      sm: 8,
      xs: 8,
    };
  }
}

const xl = 1920;
const lg = 1200;
const md = 992;
const sm = 768;
// 获取当前视口的宽度
export function getViewportWidth() {
  // 尝试使用window.innerWidth属性获取视口宽度
  let viewportWidth = window.innerWidth;
  // 如果使用window.innerWidth属性失败（例如在某些浏览器中），则尝试使用document.documentElement.clientWidth属性获取视口宽度
  if (Number.isNaN(viewportWidth)) {
    viewportWidth = document.documentElement.clientWidth;
  }
  // 如果使用document.documentElement.clientWidth属性失败（例如在某些浏览器中），则尝试使用document.body.clientWidth属性获取视口宽度
  if (Number.isNaN(viewportWidth)) {
    viewportWidth = document.body.clientWidth;
  }
  // 返回视口宽度
  return viewportWidth;
}

export const getColViewPortType = () => {
  const viewportWidth = getViewportWidth();
  if (viewportWidth >= xl) {
    return 'xl';
  } else if (viewportWidth >= lg) {
    return 'lg';
  } else if (viewportWidth >= md) {
    return 'md';
  } else if (viewportWidth >= sm) {
    return 'sm';
  } else {
    return 'xs';
  }
};

// 计算当前col span 和offset(占位) 的大小
export function calcCurrentColSpan(option: FormDataOptions) {
  const colObj = getColSpanByComponentName(option);
  const colType = getColViewPortType();
  const getObject = (key): ColSizeObject => {
    return isObject(option?.colAttrs?.[key])
      ? option?.colAttrs?.[key]
      : { span: option?.colAttrs?.[key] ?? colObj?.[key], offset: 0 };
  };
  const item = Reflect.has(option, 'visible') && !option?.visible ? {} : getObject(colType);
  return add(item.offset ?? 0, item.span ?? 0);
}
