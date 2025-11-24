<template>
  <el-dialog
    v-model="visible"
    :title="objectId ? '编辑菜单' : '新增菜单'"
    destroy-on-close
    :close-on-click-modal="false"
    width="700px"
    :before-close="close"
    top="10vh"
  >
    <el-form ref="formRef" label-position="right" label-width="100px" :rules="rules" :model="state.form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="字典名称" prop="name">
            <el-input v-model="state.form.name" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="描述" prop="desc">
            <el-input v-model="state.form.desc" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="当前组字段" prop="info.group">
            <el-input v-model="state.form.info.group" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="父级组字段" prop="info.parent_group">
            <el-input v-model="state.form.info.parent_group" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-select v-model="state.form.type" class="w-full" placeholder="请选择状态" disabled>
              <el-option v-for="item in menuDictTypeOption" :key="item.value" :label="item.label" :value="item.value" />
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
import { error, success } from '@/hooks/elementPlus/useMessage';
import { postAuthApi, putAuthApi } from '@/api/system';
import { buildForm, rules } from './model';
import { menuDictTypeOption } from '../const';

const props = defineProps({
  params: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['fetch']);
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

const create = async () => {
  const params = getParams();
  const data = await postAuthApi({ ...params });
  data?.Result?.id && callback();
};

const update = async () => {
  const params = getParams();
  if (params.info.group === params.info.parent_group) {
    error('当前组不能等于父级组');
    return;
  }
  const data = await putAuthApi(objectId.value, params);
  data?.Result?.id && callback();
};
const getParams = () => {
  return { ...state.form };
};

const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      (objectId.value ? update : create)();
    }
  });
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
