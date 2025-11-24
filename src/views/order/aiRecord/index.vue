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
      <template #table>
        <el-table stripe :data="state.list" height="100%" style="min-height: 400px">
          <el-table-column prop="display_id" label="订单编号" width="110"></el-table-column>
          <el-table-column prop="transaction_id" label="交易单号" width="110"></el-table-column>
          <el-table-column label="原图">
            <template #default="scope">
              <el-image preview-teleported :src="scope.row.ori_url" :preview-src-list="[scope.row.ori_url]" />
            </template>
          </el-table-column>
          <el-table-column prop="info.site_name" label="生成图片">
            <template #default="scope">
              <el-image preview-teleported :src="scope.row.gen_url" :preview-src-list="[scope.row.gen_url]" />
            </template>
          </el-table-column>
          <el-table-column prop="client_id" label="设备Mac"> </el-table-column>
          <el-table-column prop="node.name" label="所属网点"> </el-table-column>
          <el-table-column prop="template_name" label="所属模板">
            <template #default="{ row }">
              <div class="flex items-center gap-6px">
                {{ row.template_name }}
                <el-tooltip effect="light" v-if="row.engine || row.prompt">
                  <el-icon><Warning /></el-icon>
                  <template #content>
                    <div class="max-w-300px break-all">
                      <span v-if="row.engine">模型: {{ handleTableFilterArr(row.engine, engineOptions)?.label }} </span
                      ><br />
                      <span v-if="row.prompt"> Prompt: {{ row.prompt }}</span>
                    </div>
                  </template>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="channel" label="图片来源">
            <template #default="{ row }">
              {{ handleTableFilterArr(row.channel, channelType)?.label }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template #default="scope">
              <el-tag :type="handleTableFilterArr(scope.row.status, orderStatus)?.tag" effect="dark">
                {{ handleTableFilterArr(scope.row.status, orderStatus)?.label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="订单状态">
            <template #default="scope">
              <el-tag :type="handleTableFilterArr(scope.row.order_status, orderStatus)?.tag" effect="dark">
                {{ handleTableFilterArr(scope.row.order_status, orderStatus)?.label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="开始时间/结束时间">
            <template #default="scope">
              <p>{{ format(scope.row.start_at) }}</p>
              <p>{{ format(scope.row.end_at) }}</p>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" fixed="right" align="center" width="120"> -->
          <!-- <template #default="scope">
            <el-button @click="goTo(scope.row.id)">查看</el-button>
            </template> -->
          <!-- </el-table-column> -->
        </el-table>
      </template>
    </TablePro>
  </div>
</template>

<script lang="ts" setup>
import { usePagination, useSearchParams } from '@/hooks/elementPlus/usePagination';
import { getRecordApi } from '@/api/member';
import { format } from '@/utils/dateUtil';
import { channelType, handleTableFilterArr, orderStatus, engineOptions } from '@/enums';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';
import { useSearchBar } from './model/useSearchBar';

const pageName = 'AiRecord';
const { searchBarOptions } = useSearchBar(pageName, 'Site', 'Site');
const searchRef = ref();
const { query } = usePagination();
const state = reactive({
  row: {} as any,
  list: [] as any[],
  count: 0,
});

const loadRecords = async () => {
  startLoading();
  const { Result, Count } = await getRecordApi(undefined, {
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
  loadRecords();
};

// 搜索

const search = (form) => {
  query.where = useSearchParams(form);
  query.skip = 0;
  query.page = 1;
  loadRecords();
};
</script>

<style lang="scss" scoped></style>
