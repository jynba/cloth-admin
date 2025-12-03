import { ref } from 'vue';
import type { FormDataOptions } from '@/components/SearchBar/types/index';
import { ComponentNameEnum } from '@/components/SearchBar/types/index';
import { orderStatus } from '@/enums';

export const useSearchBar = () => {
  const searchBarOptions = ref<FormDataOptions[]>([
    {
      field: 'query',
      value: '',
      componentName: ComponentNameEnum.input,
      attrs: {
        placeholder: '订单号/客户/手机号 搜索',
      },
      visible: true,
    },
    {
      field: 'status',
      value: '',
      componentName: ComponentNameEnum.select,
      attrs: {
        placeholder: '订单状态',
      },
      options: orderStatus,
      visible: true,
    },
  ]);

  return {
    searchBarOptions,
  };
};

