<template>
  <el-dialog
    v-model="visible"
    :title="objectId ? (isEdit ? '编辑角色' : '详情') : '新增角色'"
    destroy-on-close
    :close-on-click-modal="false"
    width="700px"
    :before-close="close"
    top="10vh"
    @opened="opened"
  >
    <el-form ref="formRef" :model="state.form" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <el-form-item label="角色类型" prop="node_type">
            <el-select v-model="state.form.node_type" class="w-full" @change="remoteTemplate">
              <el-option v-for="item in filterNodeType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="0">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="state.form.name" clearable :readonly="!isEdit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" :offset="0">
          <el-form-item label="描述" prop="desc">
            <el-input v-model="state.form.desc" type="textarea" maxlength="100" show-word-limit :readonly="!isEdit" />
          </el-form-item>
        </el-col>
        <!-- PC后台权限 -->
        <PermissionTree
          ref="treeRef"
          :params="state.form"
          :sys-type="roleTypeEnum.PC"
          :dict-type="dictTypeEnum.PC"
          :show-all="false"
          title="PC后台权限"
        />
        <!-- 商家版权限 -->
        <PermissionTree
          ref="wxTreeRef"
          :params="state.form"
          :sys-type="roleTypeEnum.WX"
          :dict-type="dictTypeEnum.WX"
          :show-all="false"
          title="商家版权限"
        />
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button v-debounce type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { dictTypeEnum, roleTypeEnum } from '@/enums';
import { postRoleApi, putRoleApi } from '@/api/system';
import { success } from '@/hooks/elementPlus/useMessage';
import { buildRoleForm, rules } from './model';
import PermissionTree from './PermissionTree.vue';
import { handleNodeType } from '@/utils/auth';
import { useUserStoreWithOut } from '@/store/modules/user';

const props = defineProps({
  params: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['update:visible', 'fetch']);
const userStore = useUserStoreWithOut();
const filterNodeType = handleNodeType(userStore.user.node.node_type).filter((item) => item.value !== 'Root');
const formRef = ref();
const visible = ref(false);
const objectId = computed(() => props.params.id);
const isEdit = computed(() => props.params.isEdit);
const state = reactive({
  form: buildRoleForm(props.params),
  treeProps: {
    children: 'children',
    label: 'label',
  },
  loading: true,
  checkedKeys: [] as string[],
  halfCheckedKeys: [],
  templateArr: [] as any,
  permissionArr: [] as any,
});
watch(
  () => props.params,
  (val) => {
    state.form = buildRoleForm(val);
  },
);
const node_type = computed(() => state.form.node_type);
provide('RoleDialogProp', { objectId, isEdit, node_type });

// 创建
const create = async () => {
  const params = useParams();
  const data = await postRoleApi(params);
  data.Result?.id && callback();
};
// 更新
const update = async () => {
  const params = useParams();
  const data = await putRoleApi(objectId.value, params);
  data.Result?.id && callback();
};
const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      (props.params.id ? update : create)();
    }
  });
};

const useParams = () => {
  let permissions: string[] = [];
  let wx_permissions: string[] = [];

  // 获取PC端权限
  if (treeRef?.value?.treeComRef) {
    const nodeList: string[] = treeRef.value.treeComRef.getCheckedKeys(false);
    const halfCheckedKeys: string[] = treeRef.value.treeComRef.getHalfCheckedKeys();
    permissions = [...nodeList, ...halfCheckedKeys] as string[];
  }

  // 获取商户端权限
  if (wxTreeRef?.value?.treeComRef) {
    const wxNodeList: string[] = wxTreeRef.value.treeComRef.getCheckedKeys(false);
    const wxHalfCheckedKeys: string[] = wxTreeRef.value.treeComRef.getHalfCheckedKeys();
    wx_permissions = [...wxNodeList, ...wxHalfCheckedKeys] as string[];
  }

  return {
    name: state.form.name,
    node_type: state.form.node_type,
    permissions,
    wx_permissions,
    desc: state.form.desc,
  };
};

const treeRef = ref();
const wxTreeRef = ref();

const remoteTemplate = async () => {
  // 等待下一个 tick 确保组件已经渲染
  await nextTick();
  if (treeRef?.value?.state) {
    treeRef.value.state.loading = true;
  }
  if (treeRef?.value?.loadAuthDict) {
    treeRef.value.loadAuthDict();
  }
  if (wxTreeRef?.value?.state) {
    wxTreeRef.value.state.loading = true;
  }
  if (wxTreeRef?.value?.loadAuthDict) {
    wxTreeRef.value.loadAuthDict();
  }
};

// 打开弹窗获取权限模板数据
const opened = () => {
  remoteTemplate();
};

const callback = () => {
  close();
  emit('fetch');
  success(`${objectId.value ? '修改' : '新增'}成功`);
};

const close = () => {
  formRef.value.resetFields();
  state.checkedKeys = [];
  state.loading = true;
  visible.value = false;
};

defineExpose({ visible });
</script>
