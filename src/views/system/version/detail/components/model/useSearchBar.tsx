import { ref } from 'vue';
import type { FormDataOptions } from '@/components/SearchBar/types/index';
import { ComponentNameEnum } from '@/components/SearchBar/types/index';
import { taskStatus } from '@/enums';

export const useSearchBar = () => {
  const searchBarOptions = ref<FormDataOptions[]>([
    {
      field: 'client_id',
      value: '',
      attrs: {
        placeholder: '设备mac地址',
      },
      componentName: ComponentNameEnum.input,
    },
    {
      field: 'status',
      value: '',
      componentName: ComponentNameEnum.select,
      attrs: {
        placeholder: '任务状态',
      },
      options: taskStatus,
    },
  ]);
  return {
    searchBarOptions,
  };
};
