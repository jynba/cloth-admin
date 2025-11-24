<template>
  <el-dialog
    v-model="isVisible"
    :title="objectId ? '编辑公众号' : '新增公众号'"
    width="400px"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form ref="formRef" label-position="right" label-width="100px" :rules="rules" :model="state.form">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="公众号名称" prop="name">
            <el-input v-model="state.form.name" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="mpAppId" prop="mp_app_id">
            <el-input v-model="state.form.mp_app_id" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="oaAppId" prop="oa_app_id">
            <el-input v-model="state.form.oa_app_id" clearable></el-input>
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
import { computed, reactive, ref, watch } from 'vue';
import { buildForm, rules } from './model/index';
import { postSocialApi, putSocialApi } from '@/api/system';
import { success } from '@/hooks/elementPlus/useMessage';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:visible', 'fetch']);
const isVisible = computed(() => props.visible);
const objectId = computed(() => props.params.id);
const formRef = ref();
const state = reactive({
  form: buildForm(props.params),
});

watch(
  () => props.params, // 监听非响应式数据
  (val) => {
    state.form = buildForm(val);
  },
);

const create = async () => {
  const params = getParams();
  const data = await postSocialApi(params);
  data.id && callback();
};

const update = async () => {
  const params = getParams();
  const data = await putSocialApi(objectId.value, params);
  data.id && callback();
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

const close = () => {
  formRef.value.resetFields();
  emit('update:visible', false);
};

const refresh = () => {
  emit('fetch');
};

const callback = () => {
  close();
  refresh();
  success(`${objectId.value ? '修改' : '新增'}成功`);
};
</script>
