<template>
  <el-dialog
    v-model="isVisible"
    :title="objectId ? '编辑公司' : '新增公司'"
    width="700px"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form ref="formRef" label-position="right" label-width="100px" :rules="rules" :model="state.form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="公司名称" prop="name">
            <el-input v-model="state.form.name" clearable></el-input>
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
        <el-col :span="24">
          <el-form-item label="联系电话" prop="contact_phone">
            <el-input v-model="state.form.contact_phone" clearable placeholder="请输入联系电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="地址" prop="address">
            <el-input v-model="state.form.address" clearable placeholder="请输入公司地址"></el-input>
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
import { areaForm, rules } from './model/index';
import { postCompanyApi, putCompanyApi } from '@/api/app';
import { success } from '@/hooks/elementPlus/useMessage';
import { managerStatus } from '@/enums';

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
  form: areaForm(props.params),
});

watch(
  () => props.params, // 监听非响应式数据
  (val) => {
    state.form = areaForm(val);
  },
);

const create = async () => {
  const params = getParams();
  const data = await postCompanyApi({ ...params });
  data?.Result?.id && callback();
};

const update = async () => {
  const params = getParams();
  const data = await putCompanyApi(objectId.value, params);
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
