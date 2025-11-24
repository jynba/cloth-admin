import { ref } from 'vue';
import type { FormDataOptions } from '@/components/SearchBar/types/index';
import { ComponentNameEnum } from '@/components/SearchBar/types/index';
import { channelType, deviceType, orderStatus } from '@/enums';
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
      field: 'template_name',
      value: '',
      componentName: ComponentNameEnum.input,
      attrs: {
        placeholder: '所属模板',
      },
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
      field: 'client_id',
      value: '',
      componentName: ComponentNameEnum.input,
      attrs: {
        placeholder: '设备mac',
      },
    },
    {
      field: 'current_date',
      value: '',
      componentName: ComponentNameEnum.datePicker,
      attrs: {
        placeholder: '时间范围',
        type: 'datetimerange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      field: 'order_status',
      value: '',
      componentName: ComponentNameEnum.select,
      attrs: {
        placeholder: '订单状态',
      },
      options: orderStatus,
    },
    {
      field: 'channel',
      value: '',
      componentName: ComponentNameEnum.select,
      attrs: {
        placeholder: '图片来源',
      },
      options: channelType,
    },
  ]);
  return {
    searchBarOptions,
  };
};
