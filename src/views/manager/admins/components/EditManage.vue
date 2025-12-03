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
          <el-form-item label="账号" prop="username">
            <el-input v-model="state.form.username" clearable :disabled="!!objectId" placeholder="请输入账号" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!objectId">
          <el-form-item label="密码" prop="password">
            <el-input v-model="state.form.password" clearable type="password" placeholder="请输入密码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="real_name">
            <el-input v-model="state.form.real_name" clearable placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="state.form.phone" clearable placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="role">
            <el-select v-model="state.form.role" class="w-full" placeholder="请选择角色">
              <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="state.form.status" class="w-full" placeholder="请选择状态">
              <el-option v-for="item in managerStatus" :key="item.value" :label="item.label" :value="item.value" />
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
import { createManagerApi, updateManagerApi } from '@/api/app';
import type { PropType } from 'vue';
import { reactive, ref, watch, computed } from 'vue';
import { managerStatus } from '@/enums';

const roleOptions = [
  { label: '店长', value: 1 },
  { label: '师傅', value: 2 },
];

const props = defineProps({
  params: {
    type: Object as PropType<FormType>,
    default: () => ({}),
  },
});
const emit = defineEmits(['fetch']);
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
  },
);

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
