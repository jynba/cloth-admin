<template>
  <div class="table-box">
    <TablePro
      :data-length="state.list"
      title="公众号管理"
      :query="query"
      @page-next="onPagination"
      @refresh="fetchSites"
    >
      <template #table-top>
        <el-button class="btn" type="primary" @click="open()">添加</el-button>
      </template>
      <template #table>
        <el-table :data="state.list" height="100%">
          <el-table-column prop="name" label="公众号名称"></el-table-column>
          <el-table-column prop="create_time" label="创建时间">
            <template #default="scope">
              {{ formatUnix(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="120">
            <template #default="scope">
              <el-button @click="goTo(scope.row.id)">查看</el-button>
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
import { usePagination } from '@/hooks/elementPlus/usePagination';
import { getSocialApi } from '@/api/system';
import { formatUnix } from '@/utils/dateUtil';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';

const { query } = usePagination();
const router = useRouter();
const state = reactive({
  isVisible: false,
  row: {},
  list: [] as any[],
});

const fetchSites = async () => {
  startLoading();
  const { data } = await getSocialApi({
    limit: query.limit,
    skip: query.skip,
    ...query.where,
  }).finally(() => endLoading());
  state.list = data;
};
fetchSites();
const open = (row?: any) => {
  state.isVisible = true;
  state.row = row;
};

// 跳转详情
const goTo = (id: string) => {
  router.push({
    path: '/system/carrierDetails',
    query: {
      id,
    },
  });
};

// const search = (params: any) => {
//   query.where = useSearchParams(params);
//   fetchSites();
// };

const onPagination = () => {
  fetchSites();
};
</script>

<style lang="scss" scoped></style>
