<template>
  <div class="searchbar">
    <el-form ref="formRef" label-position="right" label-width="0px" :model="state.form">
      <el-row :gutter="20" class="flex-1">
        <el-form-item prop="device_type">
          <el-select v-model="state.form.device_type" clearable placeholder="设备类型">
            <el-option v-for="item in deviceType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-col :xs="12" :sm="8" :md="4" :lg="4" :xl="3" class="searchbar-item">
          <el-form-item prop="code">
            <el-input v-model="state.form.code" clearable placeholder="版本号" />
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="6" :lg="5" :xl="3" class="searchbar-item">
          <SearchButton @search="search" @reset="reset" />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { deviceType } from '@/enums';

const emit = defineEmits(['search']);
const formRef = ref();
const state = reactive({
  form: {
    code: '',
    device_type: undefined,
  },
});

const search = () => {
  emit('search', state.form);
};
const reset = () => {
  formRef.value.resetFields();
  emit('search', {});
};
</script>

<style lang="scss" scoped></style>
