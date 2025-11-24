<template>
  <el-dialog
    v-model="visible"
    :title="objectId ? '编辑管理员' : '新增管理员'"
    width="750px"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
    @open="opened"
  >
    <el-form ref="formRef" label-position="right" label-width="100px" :rules="rules" :model="state.form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="管理员账号" prop="username">
            <el-input
              v-model="state.form.username"
              clearable
              :disabled="!!objectId"
              placeholder="管理员账号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input v-model="state.form.password" clearable type="password" placeholder="输入密码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="state.form.status" class="w-full" placeholder="请选择状态">
              <el-option v-for="item in managerStatus" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="权限级别" prop="node_type">
            <el-select
              v-model="state.form.node_type"
              class="w-full"
              placeholder="请选择权限级别"
              @change="handleNodeChange"
            >
              <el-option v-for="item in NodeTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="state.form.node_type" :span="12">
          <el-form-item v-if="state.form.node_type !== 'Root'" :label="`所属${currentNodeType?.label}`" prop="node_id">
            <OrzSelect
              v-model:node-id="state.form.node_id"
              :type="state.form.node_type"
              :txt="`选择所属${currentNodeType?.label}`"
            />
          </el-form-item>
          <el-form-item v-if="state.form.node_type === 'Root'" label="Root权限ID" prop="node_id">
            <el-input v-model="state.form.node_id" clearable placeholder="输入Root权限ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="state.form.node_type !== 'Root'" :span="12">
          <el-form-item label="角色名称" prop="role_ids">
            <el-select
              v-model="state.form.role_ids"
              class="w-full"
              placeholder="选择角色"
              remote
              :remote-method="remote"
              clearable
              filterable
              multiple
              default-first-option
            >
              <el-option v-for="item in state.roleList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
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
import { buildForm, rules } from './model';
import type { FormType } from '../types';
import { success } from '@/hooks/elementPlus/useMessage';
import { managerEnum, managerStatus } from '@/enums';
import { createManagerApi, updateManagerApi } from '@/api/app';
import type { PropType } from 'vue';
import { computed, reactive, ref, watch } from 'vue';
import { getRoleApi } from '@/api/system';
import { handleNodeType } from '@/utils/auth';
import { useUserStoreWithOut } from '@/store/modules/user';

const props = defineProps({
  params: {
    type: Object as PropType<FormType>,
    default: () => ({}),
  },
});
const emit = defineEmits(['fetch']);
const userStore = useUserStoreWithOut();
const NodeTypeOptions = handleNodeType(userStore.user.node.node_type);
const currentNodeType = computed(() => NodeTypeOptions.find((item) => item.value === state.form.node_type));
const visible = ref(false);
const objectId = computed(() => props.params?.id);
const formRef = ref();
const { password } = rules;
const state = reactive({
  form: buildForm(props.params),
  roleList: [] as any,
});

watch(
  () => props.params,
  (val) => {
    state.form = buildForm(val);
    remote();
  },
);

const handleNodeChange = () => {
  state.form.node_id = '';
  remote();
};

const opened = () => {
  objectId.value ? (password[0].required = false) : (password[0].required = true);
};

// 创建平台管理员
const create = async (params) => {
  const data = await createManagerApi(params);
  data?.Result?.id && callback();
};
// 更新平台管理员
const update = async (params) => {
  const datas = params;
  // datas.role_id === props.params.role_name && (datas.role_id = props.params.role_id);
  // datas.node_id === props.params.info?.node_name && (datas.node_id = props.params.node_id);
  const data = await updateManagerApi(objectId.value, datas);
  data?.Result?.id && callback();
};

const useParams = () => {
  return { ...state.form };
};

// 提交数据
const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const params = useParams();
      (props.params.id ? update : create)(params);
    }
  });
};

const remote = async (query?: string) => {
  if (!state.form.node_type) return;
  const { Result } = await getRoleApi({
    name__contains: query && query !== ' ' ? query : undefined,
    node_type: state.form.node_type,
    status: managerEnum.NORMAL,
    limit: 30,
  });
  state.roleList = Result || [];
};

const close = () => {
  formRef.value.resetFields();
  visible.value = false;
};

const callback = () => {
  close();
  emit('fetch');
  success(`${objectId.value ? '修改' : '新增'}成功`);
};

defineExpose({ visible });
</script>
