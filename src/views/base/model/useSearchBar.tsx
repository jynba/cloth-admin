import { ref } from 'vue';
import type { FormDataOptions } from '@/components/SearchBar/types/index';
import { ComponentNameEnum } from '@/components/SearchBar/types/index';
import { managerStatus } from '@/enums';
import { OrzSelect } from '@/components/Query';
import { useStorageForm } from '@/components/SearchBar/useStorageForm';

export const useSearchBar = (pageName: string, enter: string, type: string = '') => {
  const { getItemToForm } = useStorageForm(ref(pageName));
  const { parent_list } = getItemToForm();
  const parentList = parent_list && parent_list.length > 0 ? parent_list : [];
  // const investorList = investor_list && investor_list.length > 0 ? investor_list : [];
  const searchBarOptions = ref<FormDataOptions[]>([
    {
      field: 'name_contains',
      value: '',
      attrs: {
        placeholder: '名称',
      },
      componentName: ComponentNameEnum.input,
    },
    {
      field: 'parent_id',
      extraField: [
        {
          field: 'parent_list',
          value: parentList,
        },
      ],
      value: '',
      attrs: {
        txt: '选择所属上级',
        type,
      },
      render: (item, form) => {
        return <OrzSelect v-model:list={form.parent_list} />;
      },
      visible: ['Agent', 'Shop', 'Site'].includes(enter),
    },
    {
      field: 'status',
      value: '',
      componentName: ComponentNameEnum.select,
      attrs: {
        placeholder: '状态',
      },
      options: managerStatus,
    },
  ]);
  return {
    searchBarOptions,
  };
};
