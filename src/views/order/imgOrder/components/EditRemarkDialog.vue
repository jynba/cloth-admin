<template>
  <el-dialog
    v-model="isVisible"
    title="编辑备注"
    width="550px"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form ref="formRef" label-position="right" label-width="50px" :model="state.form">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="state.form.remark" type="textarea" :rows="6" placeholder="请输入备注" />
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
import { buildRefundForm } from './model/index';
import { postOrdersRemarkApi } from '@/api/member';
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
const emit = defineEmits(['fetch', 'update:visible']);
const isVisible = computed(() => props.visible);
const objectId = computed(() => props.params.id);
const formRef = ref();
const state = reactive({
  form: buildRefundForm(props.params),
});

watch(
  () => props.params, // 监听非响应式数据
  (val) => {
    state.form = buildRefundForm(val);
  },
);

const close = () => {
  formRef.value.resetFields();
  emit('update:visible', false);
};

const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const params = {
        ...state.form,
      };
      postOrdersRemarkApi(objectId.value, params).then(() => {
        success('编辑备注成功');
        emit('fetch');
        close();
      });
    }
  });
};
</script>
