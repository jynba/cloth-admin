import { ref } from 'vue';
import type { FormDataOptions } from '@/components/SearchBar/types/index';
import { ComponentNameEnum } from '@/components/SearchBar/types/index';
import { deviceType, orderStatus } from '@/enums';
import { OrzSelect } from '@/components/Query';
import { useStorageForm } from '@/components/SearchBar/useStorageForm';

export const useSearchBar = (pageName: string, enter: string, type: string = '') => {
  const { getItemToForm } = useStorageForm(ref(pageName));
  const { parent_list } = getItemToForm();
  const parentList = parent_list && parent_list.length > 0 ? parent_list : [];
  const searchBarOptions = ref<FormDataOptions[]>([
    {
      field: 'display_id',
      value: '',
      attrs: {
        placeholder: '订单编号',
      },
      componentName: ComponentNameEnum.input,
    },
    {
      field: 'transaction_id',
      value: '',
      componentName: ComponentNameEnum.input,
      attrs: {
        placeholder: '交易单号',
      },
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
        txt: '选择所属网点',
        type,
      },
      render: (item, form) => {
        return <OrzSelect v-model:list={form.parent_list} />;
      },
      visible: true,
    },
    {
      field: 'status',
      value: '',
      componentName: ComponentNameEnum.select,
      attrs: {
        placeholder: '状态',
      },
      options: orderStatus,
    },
    {
      field: 'device_type',
      value: '',
      componentName: ComponentNameEnum.select,
      attrs: {
        placeholder: '设备类型',
      },
      options: deviceType,
    },
    {
      field: 'current_date',
      value: '',
      componentName: ComponentNameEnum.datePicker,
      attrs: {
        placeholder: '支付时间',
        type: 'datetimerange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ]);
  return {
    searchBarOptions,
  };
};
