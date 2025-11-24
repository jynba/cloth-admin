import { getSitesApi } from '@/api/site';
import type { FormDataOptions } from './types';
import { ComponentNameEnum } from './types';
import { ref } from 'vue';
import { RemoteDataSelect } from '@/components/Query';
import { withLatestWeek } from '@/utils/dateUtil';

export const useSearchBar = () => {
  const date = withLatestWeek();
  const searchBarOptions = ref<FormDataOptions[]>([
    {
      field: 'name',
      value: '',
      label: '姓名',
      componentName: ComponentNameEnum.input,
      colAttrs: {
        xl: { span: 6, offset: 0 },
      },
    },
    {
      field: 'dates',
      value: '',
      componentName: ComponentNameEnum.datePicker,
      label: '时间区间',
      attrs: {
        type: 'date',
      },
      colAttrs: {
        xl: { span: 6, offset: 6 },
      },
    },
    {
      field: 'password',
      value: '',
      componentName: ComponentNameEnum.input,
      label: '密码',
      colAttrs: {
        xl: { span: 6, offset: 0 },
      },
    },
    {
      field: 'id',
      value: '',
      componentName: ComponentNameEnum.remoteDataSelect,
      render: (option) => {
        return (
          <RemoteDataSelect v-bind={option.attrs}>
            {{
              default: ({ list }) =>
                list.map((item) => (
                  <el-option label={`${item.no}/${item.name}`} key={item.id} value={item.id}></el-option>
                )),
            }}
          </RemoteDataSelect>
        );
      },
      label: '所属网点',
      formItemAttrs: {
        labelWidth: '80px',
      },
      attrs: {
        searchKey: 'name__contains',
        api: getSitesApi,
      },
      colAttrs: {
        xl: { span: 6, offset: 0 },
      },
    },
    {
      field: 'status',
      value: '',
      componentName: ComponentNameEnum.select,
      label: '状态',
      options: [
        { label: '篮球', value: '1' },
        { label: '排球', value: '2' },
      ],
      colAttrs: {
        xl: { span: 6, offset: 0 },
      },
    },
    {
      field: 'site_id',
      value: '',
      componentName: ComponentNameEnum.select,
      label: '所属网点',
      attrs: {
        remote: true,
        filterable: true,
        remoteMethod: async (value) => {
          const { Results } = await getSitesApi(undefined, {
            name__contains: value,
          });
          const item = searchBarOptions.value.find((item) => item.field === 'site_id');
          if (item?.options) {
            item.options = (Results ?? []).map((item) => {
              return {
                label: `${item.name}${item.no}`,
                value: item.id,
              };
            });
          }
        },
      },
      options: [],
      colAttrs: {
        xl: { span: 6, offset: 0 },
      },
    },
    {
      field: 'dates2',
      value: [],
      componentName: ComponentNameEnum.datePicker,
      label: '时间区间',
      attrs: {
        type: 'datetimerange',
      },
    },
    {
      field: 'currentDate',
      extraField: [
        { field: 'create_time_gte', value: date[0] },
        { field: 'create_time_lte', value: date[1] },
      ],
      value: [],
      colAttrs: {
        xl: 4,
        lg: 6,
        md: 18,
        sm: 18,
        xs: 24,
      },
      attrs: {},
      render: (item, form) => {
        return <PickerRange v-model:start={form.create_time_gte} v-model:end={form.create_time_lte} />;
      },
    },
  ]);

  return {
    searchBarOptions,
  };
};
