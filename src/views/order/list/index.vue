<template>
  <div class="table-box">
    <TablePro :query="query" :total="state.count" title="订单列表" @page-next="onPagination" @refresh="load">
      <template #search>
        <GlobalSearch class="searchbar" :keep-alive="true" :options="searchBarOptions" @search="onSearch" />
      </template>
      <template #table-top>
        <el-button class="btn" type="primary" @click="onExport">导出</el-button>
      </template>
      <template #table>
        <el-table stripe :data="state.list" height="100%" style="min-height: 460px">
          <el-table-column prop="order_no" label="订单号" min-width="180" />
          <el-table-column prop="customer.name" label="客户名称" min-width="120">
            <template #default="{ row }">{{ row.customer?.name }}</template>
          </el-table-column>
          <el-table-column prop="customer.phone" label="客户手机号" min-width="140">
            <template #default="{ row }">{{ row.customer?.phone }}</template>
          </el-table-column>
          <el-table-column prop="tailor.real_name" label="师傅" min-width="120">
            <template #default="{ row }">{{ row.tailor?.real_name || '-' }}</template>
          </el-table-column>
          <el-table-column prop="total_amount" label="金额(元)" min-width="120">
            <template #default="{ row }">{{ Number(row.total_amount || 0).toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="order_status" label="订单状态" min-width="120">
            <template #default="{ row }">
              <el-tag :type="handleTableFilterArr(row.order_status, orderStatus)?.tag">
                {{ handleTableFilterArr(row.order_status, orderStatus)?.label || row.order_status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" min-width="160">
            <template #default="{ row }">{{ format(row.created_at) }}</template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="220">
            <template #default="{ row }">
              <el-button size="small" @click="goDetail(row)">详情</el-button>
              <el-select v-model="row.order_status" size="small" style="width: 120px" @change="(v)=>onUpdateStatus(row, v)">
                <el-option v-for="s in orderStatus" :key="s.value" :label="s.label" :value="s.value" />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>
  </div>
</template>

<script lang="ts" setup>
import { getOrderList, searchOrder, exportOrders, updateOrderStatus } from '@/api/app';
import { usePagination, useSearchParams } from '@/hooks/elementPlus/usePagination';
import { handleTableFilterArr, orderStatus } from '@/enums';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';
import { format } from '@/utils/dateUtil';
import { useSearchBar } from '../model/useSearchBar';

const router = useRouter();
const { searchBarOptions } = useSearchBar();
const { query } = usePagination();

const state = reactive({
  list: [] as any[],
  count: 0,
});

const load = async () => {
  startLoading();
  const q = query.where || {};
  const hasQuery = !!q.query;
  try {
    if (hasQuery) {
      const res: any = await searchOrder({ query: q.query, page: query.page, limit: query.limit });
      state.list = res?.data || [];
      state.count = res?.total || 0;
    } else {
      const res: any = await getOrderList({ page: query.page, limit: query.limit, status: q.status } as any);
      state.list = res?.data || [];
      state.count = res?.total || 0;
    }
  } finally {
    endLoading();
  }
};

onMounted(() => {
  load();
});

const onSearch = (form: any) => {
  query.where = useSearchParams(form);
  query.page = 1;
  query.skip = 0 as any;
  load();
};

const onPagination = () => {
  load();
};

const onExport = async () => {
  const q = query.where || {};
  const res = await exportOrders({ status: q.status, query: q.query } as any);
  const url = (res as any)?.download_url;
  if (url) window.open(url);
};

const goDetail = (row: any) => {
  router.push({ path: `/order/detail/${row.id}` });
};

const onUpdateStatus = async (row: any, status: number) => {
  await updateOrderStatus(row.id, { status });
  // 可选择刷新或局部更新
  // load();
};
</script>

<style lang="scss" scoped></style>

