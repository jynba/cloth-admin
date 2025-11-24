<template>
  <el-dialog
    v-model="visible"
    title="编辑订单"
    width="700px"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form ref="formRef" label-position="right" label-width="100px" :rules="rules" :model="state.form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="网点" prop="site_id">
            <OrzSelect v-model:node-id="state.form.site_id" type="Site" txt="选择网点" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="state.form.status" clearable class="w-full" placeholder="请选择状态">
              <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="state.form.remark" :rows="2" type="textarea" clearable></el-input>
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
import { createPlatformApi, updatePlatformApi } from '@/api/app';
import { success } from '@/hooks/elementPlus/useMessage';
import { orderStatus } from '@/enums';

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
const emit = defineEmits(['fetch']);
const visible = ref(false);
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
  const data = await createPlatformApi(params);
  data.id && callback();
};

const update = async () => {
  const params = getParams();
  const data = await updatePlatformApi(objectId.value, params);
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
  visible.value = false;
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
