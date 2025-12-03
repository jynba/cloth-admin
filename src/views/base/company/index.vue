<template>
  <div class="table-box">
    <TablePro :total="state.count" title="公司管理" :query="query" @page-next="onPagination">
      <template #search>
        <GlobalSearch
          ref="searchRef"
          :page-name="pageName"
          :keep-alive="true"
          class="searchbar"
          :options="searchBarOptions"
          @search="search"
        ></GlobalSearch>
      </template>
      <template #table-top>
        <el-button v-auth="['company:c']" class="btn" type="primary" @click="open()">添加</el-button>
      </template>
      <template #table>
        <el-table :data="state.list" height="100%" style="min-height: 400px">
          <el-table-column prop="name" label="公司名称"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag :type="handleTableFilterArr(scope.row.status, managerStatus)?.tag">
                {{ handleTableFilterArr(scope.row.status, managerStatus)?.label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="contact_phone" label="联系电话"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="created_at" label="创建时间">
            <template #default="scope">
              {{ format(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column v-auth="['company:r']" label="操作" fixed="right" align="center" width="260">
            <template #default="scope">
              <el-button @click="goTo(scope.row)">详情</el-button>
              <el-button v-auth="['company:u']" @click="editRow(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>
    <EditDialog v-model:visible="state.isVisible" :params="state.row" @fetch="onPagination"></EditDialog>
  </div>
</template>

<script lang="ts" setup>
import { EditDialog } from './components';
import { usePagination, useSearchParams } from '@/hooks/elementPlus/usePagination';
import { getCompanyApi } from '@/api/app';
import { format } from '@/utils/dateUtil';
import { handleTableFilterArr, managerStatus } from '@/enums';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';
import { useSearchBar } from '../model/useSearchBar';

const pageName = 'Company';
const { searchBarOptions } = useSearchBar(pageName, 'Company');
const searchRef = ref();
const { query } = usePagination();
const router = useRouter();
const state = reactive({
  isVisible: false,
  row: {},
  list: [] as any[],
  count: 0,
});

const load = async () => {
  startLoading();
  const { Result, Count } = await getCompanyApi(undefined, {
    limit: query.limit,
    skip: query.skip,
    ...query.where,
  }).finally(() => endLoading());
  console.log(Result, Count, 'Result, Count');

  state.list = Result;
  state.count = Count;
};

const open = () => {
  state.isVisible = true;
  state.row = {};
};

const fetchData = () => {
  const formData = searchRef.value?.getFormData() || {};
  search(formData);
};

onMounted(() => {
  fetchData();
});

// 跳转详情
const goTo = (row) => {
  router.push({
    path: '/base/companyDetail',
    query: {
      id: row.id,
      row: encodeURIComponent(JSON.stringify(row)),
    },
  });
};

const search = (params: any) => {
  query.where = useSearchParams(params);
  query.page = 1;
  query.skip = 0;
  load();
};

const editRow = (params) => {
  state.isVisible = true;
  state.row = { ...params };
};

const onPagination = () => {
  load();
};
</script>

<style lang="scss" scoped></style>
