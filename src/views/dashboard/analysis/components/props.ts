/*
 * @Author: kingford
 * @Date: 2021-08-03 14:46:54
 * @LastEditTime: 2021-09-17 16:47:59
 */
import type { PropType } from 'vue';

export interface BasicProps {
  width: string;
  height: string;
}

// 柱状图宽高度
export const basicProps = {
  width: {
    type: String as PropType<string>,
    default: '100%',
  },
  height: {
    type: String as PropType<string>,
    default: '100%',
  },
};
