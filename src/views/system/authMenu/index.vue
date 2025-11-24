<template>
  <div class="table-box">
    <TablePro :query="query" :total="state.count" title="菜单管理" :menus="menus" :page-visible="false" @refresh="load">
      <template #table-top>
        <el-button v-auth="['authMenu:c']" type="primary" @click="open">添加</el-button>
      </template>
      <template #table>
        <el-table row-key="id" stripe height="100%" :data="state.list">
          <el-table-column prop="name" label="权限字段" width="300px" />
          <el-table-column prop="desc" label="描述" />
          <el-table-column prop="info.parent_group" label="父级组" />
          <el-table-column prop="info.group" label="当前组" />
          <el-table-column label="操作" fixed="right" align="center">
            <template #default="scope">
              <el-button v-auth="['authMenu:u']" @click="open(scope.row)">编辑 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>
    <EditDialog ref="dialogRef" :params="state.row" @fetch="load"></EditDialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { getAuthApi } from '@/api/system';
import { usePagination } from '@/hooks/elementPlus/usePagination';
import { arrayToTree, EditDialog } from './components';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';
import { menus } from './const';
import { useRoute } from 'vue-router';

const dialogRef = ref();
const state = reactive({
  list: [],
  count: 0,
  isVisible: false,
  row: {},
});
const { query } = usePagination({ limit: 200 });
const { meta } = useRoute();

// 获取平台管理员
const load = async () => {
  startLoading();
  const params = {
    limit: query.limit,
    skip: query.skip,
    type: meta.type,
    ...query.where,
  };
  const { Result, Count } = await getAuthApi(params).finally(() => endLoading());
  state.list = arrayToTree(Result);
  state.count = Count;
};
load();

const open = (row: any) => {
  state.row = {
    ...row,
    type: meta.type,
  };
  dialogRef.value.visible = true;
};
</script>

<style lang="scss" scoped></style>
