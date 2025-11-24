<template>
  <div class="searchbar">
    <el-form ref="formRef" label-position="right" label-width="0px" :model="state.form">
      <el-row class="gap-y-2 gap-x-2">
        <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3">
          <el-form-item prop="name">
            <el-input v-model="state.form.name" clearable placeholder="姓名搜索" />
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3">
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
    name: '',
  },
});
const search = () => {
  const { ...rest } = state.form;
  emit('search', { ...rest });
};
const reset = () => {
  formRef.value.resetFields();
  emit('search', {});
};
</script>

<style lang="scss" scoped></style>
