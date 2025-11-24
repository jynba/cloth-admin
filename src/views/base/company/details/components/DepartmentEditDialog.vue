<template>
  <el-dialog
    v-model="isVisible"
    :title="objectId ? '编辑部门' : '新增部门'"
    width="640px"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form ref="formRef" label-position="right" label-width="100px" :rules="rules" :model="state.form">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="state.form.name" clearable placeholder="请输入部门名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上级部门" prop="parent_id">
            <el-select
              v-model="state.form.parent_id"
              class="w-full"
              placeholder="选择上级部门（可选）"
              clearable
              filterable
              remote
              :remote-method="remoteMethod"
            >
              <el-option v-for="item in state.treeData" :key="item.id" :label="item.name" :value="item.id" />
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
import { computed, reactive, ref, watch, onMounted } from 'vue';
import { createDepartment, updateDepartment, getDepartmentList } from '@/api/app';
import { success } from '@/hooks/elementPlus/useMessage';

const props = defineProps({
  visible: { type: Boolean, default: false },
  params: { type: Object, default: () => ({}) },
  companyId: { type: [Number, String], required: true },
});
const emit = defineEmits(['update:visible', 'fetch']);
const isVisible = computed(() => props.visible);
const objectId = computed(() => props.params?.id);
const formRef = ref();

const rules = {
  name: [{ required: true, message: '部门名称不能为空', trigger: 'change' }],
};

const state = reactive<Record<string, any>>({
  form: { name: '', parent_id: null, company_id: props.companyId as any },
  treeData: [],
});

watch(
  () => props.params,
  (val) => {
    state.form = {
      name: val?.name || '',
      parent_id: val?.parent_id ?? null,
      company_id: props.companyId as any,
    };
    fetchTree();
  },
  { immediate: true },
);

onMounted(() => {
  fetchTree();
});

const fetchTree = async () => {
  if (!props.companyId) return;
  const { Result = [] } = await getDepartmentList(undefined, { company_id: props.companyId, limit: 1000, skip: 0 });
  state.treeData = Result.filter((item: any) => item.id !== objectId.value);
};

const remoteMethod = async (query?: string) => {
  if (!props.companyId) return;
  const { Result = [] } = await getDepartmentList(undefined, {
    company_id: props.companyId,
    name_contains: query && query !== ' ' ? query : undefined,
  });
  state.treeData = Result.filter((item: any) => item.id !== objectId.value);
};

const submit = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;
    const payload = { name: state.form.name, parent_id: state.form.parent_id, company_id: props.companyId } as any;
    const data = objectId.value
      ? await updateDepartment(objectId.value, { name: payload.name, parent_id: payload.parent_id })
      : await createDepartment(payload);
    const ok = data?.id || data?.Result?.id;
    if (ok) callback();
  });
};

const close = () => {
  formRef.value?.resetFields?.();
  emit('update:visible', false);
};

const refresh = () => emit('fetch');

const callback = () => {
  close();
  refresh();
  success(`${objectId.value ? '修改' : '新增'}成功`);
};
</script>
