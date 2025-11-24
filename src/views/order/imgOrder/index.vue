<template>
  <div class="table-box">
    <TablePro :query="query" :total="state.count" @page-next="onPagination">
      <template #search>
        <GlobalSearch
          ref="searchRef"
          class="searchbar"
          :page-name="pageName"
          :keep-alive="true"
          :options="searchBarOptions"
          @search="search"
        ></GlobalSearch>
      </template>
      <template #table-top>
        <el-button v-auth="['imgOrder:export']" type="primary" @click="handleExport">导出Excel</el-button>
      </template>
      <template #table>
        <el-table stripe :data="state.list" height="100%" style="min-height: 400px">
          <el-table-column prop="display_id" label="订单编号" width="110"></el-table-column>
          <el-table-column label="用户openid/手机号">
            <template #default="scope">
              <p>{{ scope.row.user?.open_id }}</p>
              <p>{{ scope.row.phone || '-' }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="transaction_id" label="交易单号" width="150"></el-table-column>
          <el-table-column prop="info.site_name" label="网点">
            <template #default="scope">
              <div>{{ scope.row.node?.name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="device.client_id" label="设备Mac"> </el-table-column>
          <el-table-column prop="device.type" label="设备类型">
            <template #default="scope">
              {{ handleTableFilterArr(scope.row.device?.type, deviceType)?.label }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template #default="scope">
              <el-tag :type="handleTableFilterArr(scope.row.status, orderStatus)?.tag" effect="dark">
                {{ handleTableFilterArr(scope.row.status, orderStatus)?.label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="payed" label="订单/实付金额">
            <template #default="scope">
              <p>{{ handleMoney(scope.row.money) }}元</p>
              <p>{{ handleMoney(scope.row.payed) }}元</p>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="支付时间">
            <template #default="scope">
              <p>{{ format(scope.row.created_at) }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注">
            <template #default="scope">
              {{ scope.row.remark }}
              <i-ep-edit-pen
                v-auth="['imgOrder:remark']"
                class="ml-2 cursor-pointer text-blue-500"
                @click="openEditRemarkDialog(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="120">
            <template #default="scope">
              <el-button
                v-if="showRefundBtn(scope.row)"
                v-auth="['imgOrder:refund']"
                @click="openRefundDialog(scope.row)"
              >
                退款
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>
    <RefundDialog v-model:visible="state.showRefundDialog" :params="state.row" @fetch="loadOrders"></RefundDialog>
    <EditRemarkDialog
      v-model:visible="state.showEditRemarkDialog"
      :params="state.row"
      @fetch="loadOrders"
    ></EditRemarkDialog>
  </div>
</template>

<script lang="ts" setup>
import { usePagination, useSearchParams } from '@/hooks/elementPlus/usePagination';
import { getOrdersApi, getOrdersExportApi } from '@/api/member';
import { handleMoney } from '@/utils/tools';
import { format, formatToDateTime, isToday } from '@/utils/dateUtil';
import { deviceType, handleTableFilterArr, orderStatus } from '@/enums';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';
import { EditRemarkDialog, RefundDialog } from './components';
import { useSearchBar } from './model/useSearchBar';
import { warning } from '@/hooks/elementPlus/useMessage';
import dayjs from 'dayjs';

const pageName = 'ImgOrder';
const { searchBarOptions } = useSearchBar(pageName, 'Site', 'Site');
const searchRef = ref();
const { query } = usePagination();
const state = reactive({
  row: {} as any,
  list: [] as any[],
  showRefundDialog: false,
  showEditRemarkDialog: false,
  count: 0,
});

const loadOrders = async () => {
  startLoading();
  const { Result, Count } = await getOrdersApi(undefined, {
    limit: query.limit,
    skip: query.skip,
    ...query.where,
  }).finally(() => {
    endLoading();
  });
  state.list = Result;
  state.count = Count;
};

const fetchData = () => {
  const formData = searchRef.value?.getFormData() || {};
  search(formData);
};

onMounted(() => {
  fetchData();
});

// 分页切换
const onPagination = () => {
  loadOrders();
};

// const goTo = (id: string) => {
//   router.push({ path: '/orders/ordersDetails', query: { id: id } });
// };

const showRefundBtn = (row) => {
  if (row.payed === 0) return false;
  if (row.status !== 2 && row.status !== 4) return false;
  if (!isToday(formatToDateTime(row.created_at))) return false;
  return true;
};

const openEditRemarkDialog = (row) => {
  state.row = row;
  state.showEditRemarkDialog = true;
};

const openRefundDialog = (row) => {
  state.row = row;
  state.showRefundDialog = true;
};

// 搜索
const search = (form) => {
  query.where = useSearchParams(form);
  query.skip = 0;
  query.page = 1;
  loadOrders();
};

const handleExport = async () => {
  const formData = searchRef.value?.getFormData() || {};
  const current_date = formData.current_date;
  if (!current_date || current_date.length === 0) {
    warning('请先选择订单支付时间，支持导出一个月的订单数据');
    return;
  }
  if (dayjs(current_date[1]).diff(dayjs(current_date[0]), 'day') > 31) {
    warning('订单支付时间不得超出一个月');
    return;
  }
  const { Result } = await getOrdersExportApi(query.where);

  if (Result) {
    const link = document.createElement('a');
    link.href = Result;
    link.download = '订单统计.xlsx';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
</script>

<style lang="scss" scoped></style>
