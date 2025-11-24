<template>
  <div class="table-box">
    <TablePro :query="query" :total="state.count" title="组织人员管理" @page-next="onPagination" @refresh="fetchData">
      <template #search>
        <SearchBar @search="search" />
      </template>
      <template #table-top>
        <el-button type="primary" :loading="state.isRefreshLoading" @click="onRefresh">同步钉钉</el-button>
      </template>
      <template #table>
        <el-table stripe :data="state.list" table-layout="fixed" height="100%" style="min-height: 400px">
          <el-table-column prop="user_id" label="钉钉人员ID"> </el-table-column>
          <el-table-column prop="name" label="姓名"> </el-table-column>
        </el-table>
      </template>
    </TablePro>
  </div>
</template>

<script lang="ts" setup>
import { usePagination, useSearchParams } from '@/hooks/elementPlus/usePagination';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';
import { confirm } from '@/hooks/elementPlus/useMessageBox';
import { success } from '@/hooks/elementPlus/useMessage';
import { getDingStaffApi, refreshDingStaffApi } from '@/api/app';
import SearchBar from './components/SearchBar.vue';

defineOptions({
  name: 'DingStaff',
});

const { query } = usePagination({ limit: 50 });
const state = reactive({
  list: [],
  count: 0,
  isRefreshLoading: false,
});

const fetchData = async () => {
  startLoading();
  const { Result, Count } = await getDingStaffApi({
    limit: query.limit,
    skip: query.skip,
    ...query.where,
  }).finally(() => endLoading());
  state.list = Result;
  state.count = Count;
};

const search = (params) => {
  query.where = useSearchParams(params);
  query.page === 1 ? fetchData() : (query.page = 1);
};

const onPagination = () => {
  fetchData();
};

const onRefresh = () => {
  confirm('此操作将同步钉钉员工数据，是否继续', '注意', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    state.isRefreshLoading = true;
    refreshDingStaffApi()
      .then(() => {
        success('刷新成功');
        fetchData();
      })
      .finally(() => {
        state.isRefreshLoading = false;
      });
  });
};

onMounted(() => {
  fetchData();
});
</script>

<style lang="scss" scoped></style>
