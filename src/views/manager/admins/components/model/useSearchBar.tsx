import { ref } from 'vue';
import type { FormDataOptions } from '@/components/SearchBar/types/index';
import { ComponentNameEnum } from '@/components/SearchBar/types/index';
import { OrzSelect } from '@/components/Query';
import { handleNodeType } from '@/utils/auth';
import { useUserStoreWithOut } from '@/store/modules/user';
import { managerStatus } from '@/enums';

export const useSearchBar = () => {
  const userStore = useUserStoreWithOut();

  const searchBarOptions = ref<FormDataOptions[]>([
    {
      field: 'username',
      value: '',
      componentName: ComponentNameEnum.input,
      attrs: {
        placeholder: '管理员账号',
      },
      visible: true,
    },
    {
      field: 'node_type',
      value: '',
      componentName: ComponentNameEnum.select,
      attrs: {
        placeholder: '组织类型',
      },
      options: handleNodeType(userStore.user.node.node_type),
      onChange: (value, form) => {
        if (form) {
          form.node_id = '';
        }
      },
      visible: true,
    },
    {
      field: 'node_id',
      extraField: [
        {
          field: 'node_type',
          value: '',
        },
      ],
      value: '',
      attrs: {
        txt: '选择组织',
      },
      render: (item, form) => {
        const nodeId = form?.node_id || '';
        const nodeType = form?.node_type || '';
        return <OrzSelect v-model:node-id={nodeId} type={nodeType as any} txt="选择组织" />;
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
      options: managerStatus,
    },
  ]);

  return {
    searchBarOptions,
  };
};
