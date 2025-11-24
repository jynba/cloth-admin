<template>
  <el-dialog
    v-model="visible"
    :title="objectId ? '编辑角色模板' : '新增角色模板'"
    destroy-on-close
    :close-on-click-modal="false"
    width="700px"
    :before-close="close"
    top="10vh"
    @opened="opened"
  >
    <el-form ref="formRef" label-position="right" label-width="100px" :rules="rules" :model="state.form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="state.form.name" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限类型" prop="node_type">
            <el-select v-model="state.form.node_type" disabled class="w-full">
              <el-option v-for="item in filterNodeType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平台类型" prop="role_type">
            <el-select v-model="state.form.role_type" class="w-full" @change="remoteTemplate">
              <el-option v-for="item in roleType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <!-- PC后台权限 -->
          <PermissionTree
            v-if="state.form.role_type === roleTypeEnum.PC"
            ref="treeRef"
            :params="state.form"
            :sys-type="roleTypeEnum.PC"
            :dict-type="dictTypeEnum.PC"
            :show-all="true"
            title="PC后台权限"
          />
          <!-- 商家版权限 -->
          <PermissionTree
            v-if="state.form.role_type === roleTypeEnum.WX"
            ref="wxTreeRef"
            :params="state.form"
            :sys-type="roleTypeEnum.WX"
            :dict-type="dictTypeEnum.WX"
            :show-all="true"
            title="商家版权限"
          />
        </el-col>
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
import { success } from '@/hooks/elementPlus/useMessage';
import { postRoleTemplateApi, putRoleTemplateApi } from '@/api/system';
import { dictTypeEnum, roleType, roleTypeEnum } from '@/enums';
import { buildForm, rules } from './model';
import PermissionTree from '../../role/components/PermissionTree.vue';
import { handleNodeType } from '@/utils/auth';
import { useUserStoreWithOut } from '@/store/modules/user';

const props = defineProps({
  params: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['fetch']);
const userStore = useUserStoreWithOut();
const filterNodeType = handleNodeType(userStore.user.node.node_type).filter((item) => item.value !== 'Root');
const formRef = ref();
const objectId = computed(() => props.params?.id);
const visible = ref(false);
const state = reactive({
  form: buildForm(props.params),
});

watch(
  () => props.params,
  (val) => {
    state.form = buildForm(val);
  },
);

const isEdit = computed(() => true);
const node_type = computed(() => state.form.node_type);
provide('RoleDialogProp', { objectId, isEdit, node_type });

const update = async () => {
  const params = useParams();
  const data = await putRoleTemplateApi(objectId.value, params);
  data.Result?.id && callback();
};

const create = async () => {
  const params = useParams();
  const data = await postRoleTemplateApi(params);
  data.Result?.id && callback();
};

const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (objectId.value) {
        update();
      } else {
        create();
      }
    }
  });
};

const useParams = () => {
  let permissions: string[] = [];
  let role_template_id = '';

  if (state.form.role_type === roleTypeEnum.PC) {
    if (treeRef?.value?.treeComRef) {
      const nodeList: string[] = treeRef.value.treeComRef.getCheckedKeys(false);
      const halfCheckedKeys: string[] = treeRef.value.treeComRef.getHalfCheckedKeys();
      permissions = [...nodeList, ...halfCheckedKeys] as string[]; // 路由的name
    }
    if (treeRef?.value?.state?.form?.role_template_id) {
      role_template_id = treeRef.value.state.form.role_template_id;
    }
  } else if (state.form.role_type === roleTypeEnum.WX) {
    if (wxTreeRef?.value?.treeComRef) {
      const wxNodeList: string[] = wxTreeRef.value.treeComRef.getCheckedKeys(false);
      const wxHalfCheckedKeys: string[] = wxTreeRef.value.treeComRef.getHalfCheckedKeys();
      permissions = [...wxNodeList, ...wxHalfCheckedKeys] as string[];
    }
    if (wxTreeRef?.value?.state?.form?.role_template_id) {
      role_template_id = wxTreeRef.value.state.form.role_template_id;
    }
  }

  return {
    name: state.form.name,
    role_template_id,
    permissions,
    node_type: state.form.node_type,
    role_type: state.form.role_type,
  };
};

const treeRef = ref();
const wxTreeRef = ref();

const remoteTemplate = async () => {
  // 等待下一个 tick 确保组件已经渲染
  await nextTick();

  if (state.form.role_type === roleTypeEnum.PC) {
    if (treeRef?.value?.state) {
      treeRef.value.state.loading = true;
    }
    if (treeRef?.value?.loadAuthDict) {
      treeRef.value.loadAuthDict();
    }
  }
  if (state.form.role_type === roleTypeEnum.WX) {
    if (wxTreeRef?.value?.state) {
      wxTreeRef.value.state.loading = true;
    }
    if (wxTreeRef?.value?.loadAuthDict) {
      wxTreeRef.value.loadAuthDict();
    }
  }
};

// 打开弹窗获取权限模板数据
const opened = async () => {
  await remoteTemplate();
};

const callback = () => {
  close();
  emit('fetch');
  success(`${objectId.value ? '修改' : '新增'}成功`);
};

const close = () => {
  formRef.value.resetFields();
  visible.value = false;
};

defineExpose({ visible });
</script>

<style lang="scss" scoped></style>
