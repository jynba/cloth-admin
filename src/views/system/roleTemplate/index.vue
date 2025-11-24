<template>
  <div class="table-box">
    <TablePro :query="query" :total="state.count" title="组织架构权限" @page-next="onPagination" @refresh="load">
      <template #search>
        <el-row class="my-2">
          <el-col :xs="12" :sm="8" :md="6" :lg="5" :xl="3">
            <el-select v-model="state.type" @change="changeOption">
              <el-option v-for="item in filterNodeType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </template>
      <template #table-top>
        <el-button v-auth="['roleTemplate:c']" type="primary" @click="open">添加</el-button>
      </template>
      <template #table>
        <el-table style="min-height: 400px" stripe height="100%" :data="state.list">
          <el-table-column prop="name" label="模板名称" />

          <el-table-column prop="permissions" label="权限字段">
            <template #default="{ row }">
              <EllipsisTip max-width="100%" :line="2">{{ row.permissions || '-' }}</EllipsisTip>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center">
            <template #default="scope">
              <el-button v-auth="['roleTemplate:u']" @click="open(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>
    <EditDialog ref="dialogRef" :params="state.row" @fetch="load"></EditDialog>
  </div>
</template>

<script lang="ts" setup>
import { getRoleTemplateApi } from '@/api/system';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';
import { usePagination } from '@/hooks/elementPlus/usePagination';
import { reactive } from 'vue';
import { EditDialog } from './components';
import { handleNodeType } from '@/utils/auth';
import { useUserStoreWithOut } from '@/store/modules/user';

defineOptions({
  name: 'RoleTemplate',
});
const userStore = useUserStoreWithOut();
const filterNodeType = handleNodeType(userStore.user.node.node_type).filter((item) => item.value !== 'Root');
const dialogRef = ref();
const state = reactive({
  list: [],
  count: 0,
  row: {},
  type: 'Company',
});
const { query } = usePagination();
// 获取平台管理员
const load = async () => {
  startLoading();
  const params = {
    node_type: state.type,
    limit: query.limit,
    skip: query.skip,
    ...query.where,
  };
  const { Result, Count } = await getRoleTemplateApi(params).finally(() => endLoading());
  state.list = Result;
  state.count = Count;
};
const changeOption = (val) => {
  state.type = val;
  load();
};
load();
const onPagination = () => {
  load();
};
const open = (row: any) => {
  state.row = {
    ...row,
    node_type: state.type,
  };
  dialogRef.value.visible = true;
};
</script>

<style lang="scss" scoped></style>
