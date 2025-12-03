<template>
  <el-dialog
    v-model="visible"
    :title="objectId ? '编辑师傅' : '新增师傅'"
    width="650px"
    destroy-on-close
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form ref="formRef" label-position="right" label-width="100px" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="real_name">
            <el-input v-model="form.real_name" clearable placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" clearable placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工号" prop="work_number">
            <el-input v-model="form.work_number" clearable placeholder="请输入工号(选填)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="等级" prop="level">
            <el-input-number v-model="form.level" :min="1" :max="10" class="w-full" controls-position="right" />
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
import type { PropType } from 'vue';
import { reactive, ref, watch, computed } from 'vue';
import { createTailor, updateTailor } from '@/api/app';
import { success } from '@/hooks/elementPlus/useMessage';

interface TailorForm {
  id?: number;
  real_name?: string;
  phone?: string;
  work_number?: string;
  level?: number;
}

const props = defineProps({
  params: {
    type: Object as PropType<TailorForm>,
    default: () => ({}),
  },
});
const emit = defineEmits(['fetch']);

const visible = ref(false);
const formRef = ref();
const objectId = computed(() => props.params?.id);

const form = reactive<TailorForm>({
  real_name: '',
  phone: '',
  work_number: '',
  level: 1,
});

const rules = {
  real_name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
};

watch(
  () => props.params,
  (val) => {
    form.id = (val as any)?.id;
    form.real_name = (val as any)?.real_name || '';
    form.phone = (val as any)?.phone || '';
    form.work_number = (val as any)?.work_number || '';
    form.level = (val as any)?.level ?? 1;
  },
  { immediate: true },
);

const submit = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;
    const payload: any = {
      real_name: form.real_name,
      phone: form.phone,
      work_number: form.work_number,
      level: form.level,
    };
    if (objectId.value) {
      await updateTailor(objectId.value as number, payload);
      success('修改成功');
    } else {
      await createTailor(payload);
      success('新增成功');
    }
    emit('fetch');
    visible.value = false;
  });
};

const close = () => {
  formRef.value?.resetFields?.();
  visible.value = false;
};

defineExpose({ visible });
</script>

<style scoped>
.w-full {
  width: 100%;
}
</style>
