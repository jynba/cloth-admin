<template>
  <div class="table-box">
    <TablePro :query="query" :total="state.count" title="网点管理" @page-next="onPagination" @refresh="loadSite">
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
        <el-button v-auth="['site:c']" class="btn" type="primary" @click="open()">添加</el-button>
      </template>
      <template #table>
        <el-table stripe :data="state.tableData" height="100%" style="min-height: 400px">
          <el-table-column v-if="curNodeType === 'Company'" fixed="left" prop="id" label="网点ID" />
          <el-table-column fixed="left" prop="name" label="网点名称" />
          <el-table-column prop="node.parent.name" label="所属商户" />
          <el-table-column prop="contact" label="联系人"></el-table-column>
          <el-table-column prop="phone" label="联系方式"></el-table-column>
          <el-table-column prop="ding_staff.name" label="关联钉钉人员" />
          <el-table-column label="状态">
            <template #default="scope">
              <el-tag :type="handleTableFilterArr(scope.row.status, managerStatus)?.tag">
                {{ handleTableFilterArr(scope.row.status, managerStatus)?.label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="device_count" label="设备数量"></el-table-column>
          <el-table-column prop="created_at" label="创建时间">
            <template #default="scope">
              {{ format(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="营业时间" width="120">
            <template #default="{ row }">
              {{ convertWeekRange(row.week_mask).join('、') }}
              <div v-for="(date, index) in convertTimeRangesToDisplay(row.time_ranges)" :key="index">
                {{ date.startTime }} - {{ date.endTime }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" />
          <el-table-column v-auth="['site:r']" label="操作" fixed="right" align="center" width="120">
            <template #default="scope">
              <el-button v-auth="['site:u']" @click="editRow(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>
    <EditSite v-model:visible="state.isVisible" :params="state.row" @search="loadSite" />
  </div>
</template>

<script lang="ts" setup>
import { EditSite } from './components';
import { usePagination, useSearchParams } from '@/hooks/elementPlus/usePagination';
import { getSitesApi } from '@/api/app';
import { convertTimeRangesToDisplay, convertWeekRange, format } from '@/utils/dateUtil';
import type { SiteForm, SiteTable } from './types';
import { handleTableFilterArr, managerStatus } from '@/enums';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';
import { useSearchBar } from '@/views/base/model/useSearchBar';
import { useUserStoreWithOut } from '@/store/modules/user';
import { isAdmin } from '@/router/guard/helper';

const userStore = useUserStoreWithOut();
const curNodeType =
  userStore.user?.node?.node_type == 'Company' || isAdmin() ? 'Company' : userStore.user?.node?.node_type;
const pageName = 'Site';
const { searchBarOptions } = useSearchBar(pageName, 'Site', 'Shop');
const searchRef = ref();
const { query } = usePagination({ limit: 50 });
// const router = useRouter();
const state = reactive({
  tableData: [] as SiteTable[],
  isVisible: false,
  row: {} as SiteForm,
  count: 0,
});

const open = () => {
  state.isVisible = true;
  state.row = {};
};

const search = (params) => {
  query.where = useSearchParams(params);
  query.page = 1;
  query.skip = 0;
  loadSite();
};
// 获取网点
const loadSite = async () => {
  startLoading();
  const params = {
    limit: query.limit,
    skip: query.skip,
    ...query.where,
  };
  const { Result, Count } = await getSitesApi(undefined, params).finally(() => endLoading());
  state.tableData = Result;
  state.count = Count;
};

const fetchData = () => {
  const formData = searchRef.value?.getFormData() || {};
  search(formData);
};

onMounted(() => {
  fetchData();
});

const onPagination = () => {
  loadSite();
};
// 详情
// const goTo = async (id: string) => {
//   router.push({ path: '/base/siteDetail', query: { id } });
// };

const editRow = (row) => {
  state.row = row;
  state.isVisible = true;
};
</script>

<style lang="scss" scoped></style>
