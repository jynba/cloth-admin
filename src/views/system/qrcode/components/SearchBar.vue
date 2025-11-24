<template>
  <div class="searchbar">
    <el-form ref="formRef" label-position="right" label-width="0px" :model="state.form">
      <el-row :gutter="20" class="flex-1">
        <el-col :xs="12" :sm="8" :md="4" :lg="4" :xl="3" class="searchbar-item">
          <el-form-item prop="status">
            <el-select v-model="state.form.status" placeholder="请选择状态" clearable>
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="12" :md="6" :lg="4" :xl="3">
          <SearchButton @search="search" @reset="reset" />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['search']);
const formRef = ref();
const state = reactive({
  form: {
    status: '',
  },
});
const options = [
  {
    value: 'normal',
    label: '正常',
  },
  {
    value: 'disabled',
    label: '禁用',
  },
];
const search = () => {
  emit('search', { ...state.form });
};
const reset = () => {
  formRef.value.resetFields();
  emit('search', {});
};
</script>

<style lang="scss" scoped></style>
