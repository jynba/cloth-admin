<template>
  <el-skeleton :rows="3" style="width: 100%" :loading="state.loading" animated>
    <el-col :span="12" :offset="0">
      <el-form-item :label="title">
        <el-tree
          ref="treeComRef"
          empty-text="暂无权限......"
          class="permissions-tree"
          :data="state.permissionArr"
          :default-checked-keys="state.checkedKeys"
          node-key="key"
          :props="state.treeProps"
          :show-checkbox="isEdit"
          :highlight-current="true"
        />
      </el-form-item>
    </el-col>
  </el-skeleton>
</template>

<script setup lang="ts">
import { buildForm, findDict, formatSource } from './model';
import { dictTypeEnum, roleTypeEnum } from '@/enums';
import { getAuthApi, getRoleTemplateApi } from '@/api/system';
import { arrayToTree } from './index';
import type { ElTree } from 'element-plus';
import { usePermissionStore } from '@/store/modules/permission';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  sysType: {
    type: Number,
    default: roleTypeEnum.PC,
  },
  dictType: {
    type: String,
    default: dictTypeEnum.PC,
  },
  showAll: {
    type: Boolean,
    default: false,
  },
  params: {
    type: Object,
    default: () => {},
  },
  nodeType: {
    type: String,
    default: 'Company',
  },
});

const roleConfig = inject('RoleDialogProp') as any;

const isEdit = computed(() => roleConfig.isEdit.value);
const node_type = computed(() => roleConfig.node_type.value);

const treeComRef = ref<InstanceType<typeof ElTree>>();

const state = reactive({
  form: buildForm(props.params),
  treeProps: {
    children: 'children',
    label: 'label',
  },
  loading: true,
  checkedKeys: [] as string[],
  halfCheckedKeys: [],
  templateArr: [] as any,
  permissionArr: [] as any,
  route_ids: [] as string[],
});

// 获取路由用于排序
const accessedRoutes = usePermissionStore().accessedRoutes;
const getRouteIds = (routes: any) => {
  let index = 0;
  const ids = {} as any;
  const traverseRoutes = (routes: any) => {
    routes.forEach((route: any) => {
      ids[route.name] = index++;
      if (route.children) {
        traverseRoutes(route.children);
      }
    });
  };
  traverseRoutes(routes);
  return ids;
};
const rank_ids = getRouteIds(accessedRoutes);

// 根据系统类型获取对应的权限数据
const getPermissionsBySysType = () => {
  if (props.sysType === roleTypeEnum.PC) {
    return props.params?.permissions || [];
  } else if (props.sysType === roleTypeEnum.WX) {
    // 角色模板管理场景下，商家版权限也存储在permissions字段中
    if (props.showAll) {
      return props.params?.permissions || [];
    } else {
      // 角色管理场景下，商家版权限存储在wx_permissions字段中
      return props.params?.wx_permissions || [];
    }
  }
  return [];
};

// 字典
const loadAuthDict = async () => {
  let data: any[] = [];

  if (props.showAll) {
    // 角色模板管理：使用getAuthApi获取所有权限
    const { Result: authData } = await getAuthApi({ limit: 200, type: props.dictType });
    data = authData;
  } else {
    // 角色管理：使用getRoleTemplateApi获取角色模板权限
    const { Result: getSystemPermission } = await getRoleTemplateApi({
      limit: 100,
      skip: 0,
      node_type: node_type.value, // 权限模板类型，平台，商户，合作商，网点等
    });
    // 返回的角色类型的 模板权限数组
    const SystemPermission = getSystemPermission.find((item) => item.role_type === props.sysType); // 默认PC
    state.form.permissions = SystemPermission?.permissions ?? [];
    state.form.role_template_id = SystemPermission?.id;

    // 获取角色模板对应的权限数据
    const { Result: authData } = await getAuthApi({ limit: 200, type: props.dictType });
    data = authData;
  }

  // 将data对象数组中的name属性按照getRouteIds排序
  data.sort((a: any, b: any) => {
    return rank_ids[a.name] - rank_ids[b.name];
  });
  state.checkedKeys = [];
  const currentPermissions = getPermissionsBySysType();

  // 查看角色跳出
  if (!isEdit.value) {
    const filterArr = findDict(currentPermissions, data) ?? [];
    state.permissionArr = arrayToTree(filterArr) ?? [];
    state.permissionArr.sort((a: any, b: any) => {
      return rank_ids[a.key] - rank_ids[b.key];
    });
    state.loading = false;
    return;
  }

  let filterArr;
  if (props.showAll) {
    // 角色模板管理：显示所有权限
    state.permissionArr = arrayToTree(data) ?? [];
    state.permissionArr.sort((a: any, b: any) => {
      return rank_ids[a.key] - rank_ids[b.key];
    });
  } else {
    // 角色管理：显示角色模板权限
    filterArr = findDict(state.form.permissions, data) ?? [];
    state.permissionArr = arrayToTree(filterArr) ?? [];
    state.permissionArr.sort((a: any, b: any) => {
      return rank_ids[a.key] - rank_ids[b.key];
    });
  }

  // 添加角色跳出
  if (!currentPermissions) {
    state.loading = false;
    // 新增，默认【平台】类型，权限功能默认全部勾选。
    // state.checkedKeys.push(...state.form.permissions);
    // console.log('state.form.permissions', state.checkedKeys);

    return;
  }

  const arr = formatSource(state.permissionArr);
  // 添加勾选了一级菜单且没有子集的项
  state.permissionArr.forEach((item: any) => {
    if (currentPermissions.indexOf(item.key) !== -1 && !item.children.length) {
      state.checkedKeys.push(item.key);
    }
  });

  // 添加所有子项进入可以项中，无视父项状态
  currentPermissions.forEach((item: string) => {
    if (arr.indexOf(item) === -1) {
      state.checkedKeys.push(item);
    }
  });
  treeComRef.value?.setCheckedKeys(state.checkedKeys, false);
  state.loading = false;
};
defineExpose({
  loadAuthDict,
  state,
  treeComRef,
});
</script>

<style scoped>
.permissions-tree {
  width: 100%;
  min-height: 200px;
}

.permissions-tree :deep(.el-tree__empty-block) {
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.permissions-tree :deep(.el-tree__empty-text) {
  font-size: 14px;
  color: #909399;
  white-space: nowrap;
  overflow: visible;
  text-overflow: unset;
  line-height: 1.5;
  word-break: keep-all;
  text-align: center;
}

/* 确保树组件容器有足够的空间 */
.permissions-tree :deep(.el-tree) {
  min-height: 200px;
  width: 100%;
}

/* 当没有数据时，确保空状态区域有足够的空间 */
.permissions-tree :deep(.el-tree__empty-block) {
  width: 100%;
  min-height: 120px;
}
</style>
