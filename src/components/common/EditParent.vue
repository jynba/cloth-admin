<template>
  <el-dialog
    v-model="visible"
    title="修改绑定上级"
    width="550px"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form ref="formRef" label-position="right" label-width="100px" :model="state.form">
      <el-row :gutter="20">
        <el-col :span="24" :offset="0">
          <el-form-item :label="showNodeType()" prop="parent_id">
            <OrzSelect v-model:node-id="state.form.parent_id" :type="type" :txt="showNodeType()" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-debounce @click="close">取 消</el-button>
        <el-button v-debounce type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { putNodeApi } from '@/api/app';
import { success } from '@/hooks/elementPlus/useMessage';

const props = defineProps({
  params: {
    type: Object,
    default: () => ({}),
  },
  type: {
    type: String,
  },
});
const emit = defineEmits(['fetch']);
const formRef = ref();
const visible = ref(false);
console.log('props: ', props.params.info?.parent_name);
const state = reactive({
  form: {
    parent_id: '',
  },
});
watch(
  () => props.params,
  (val) => {
    state.form.parent_id = val.info?.parent_name;
  },
);

const showNodeType = () => {
  switch (props.type) {
    case 'Company':
      return '选择公司';
    case 'Platform':
      return '选择平台';
    case 'Agent':
      return '选择合作商';
    case 'Shop':
      return '选择商户';
  }
};
const close = () => {
  formRef.value.resetFields();
  visible.value = false;
};
const update = async () => {
  const params = {
    parent_id:
      state.form.parent_id === props.params.info?.parent_name ? props.params.info?.parent_id : state.form.parent_id,
  };
  const data = await putNodeApi(props.params.id, params);
  data.id && callback();
};
const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      update();
    }
  });
};
const refresh = () => {
  emit('fetch');
};

const callback = () => {
  close();
  refresh();
  success(`修改成功`);
};

defineExpose({ visible });
</script>

<style lang="scss" scoped></style>
