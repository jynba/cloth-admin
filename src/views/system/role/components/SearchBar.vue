<template>
  <div class="searchbar">
    <el-form ref="formRef" label-position="right" label-width="0px" :model="form">
      <el-row class="gap-y-2 gap-x-2">
        <el-col :xs="12" :sm="8" :md="6" :lg="5" :xl="3">
          <el-form-item prop="name">
            <el-input v-model="form.name" clearable placeholder="角色名称"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="8" :md="6" :lg="5" :xl="3">
          <el-form-item prop="node_type">
            <el-select v-model="form.node_type">
              <el-option v-for="item in filterNodeType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="8" :md="6" :lg="5" :xl="2">
          <SearchButton @search="search" @reset="reset" />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { useUserStoreWithOut } from '@/store/modules/user';
import { handleNodeType } from '@/utils/auth';

const emit = defineEmits(['search']);
const userStore = useUserStoreWithOut();
const filterNodeType = handleNodeType(userStore.user.node.node_type).filter((item) => item.value !== 'Root');
const formRef = ref();
const form = reactive({
  name: '',
  node_type: '',
});

const search = () => {
  emit('search', { ...form });
};

const reset = () => {
  formRef.value.resetFields();
  emit('search', {});
};
</script>

<style lang="scss" scoped></style>
