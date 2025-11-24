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
          <el-table-column prop="mac" label="设备Mac"> </el-table-column>
          <el-table-column prop="Site.name" label="所属网点"> </el-table-column>
          <el-table-column prop="BusinessConfig.template_name" label="所属视频模板"> </el-table-column>
          <el-table-column prop="cos_url" label="视频">
            <template #default="{ row }">
              <el-button
                v-if="row.cos_url"
                type="primary"
                link
                size="small"
                @click="handlePreview(`${VIDEO_PREFIX}${row.cos_url}`)"
              >
                预览
              </el-button>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template #default="scope">
              <el-tag :type="handleTableFilterArr(scope.row.status, aiVideoStatus)?.tag" effect="dark">
                {{ handleTableFilterArr(scope.row.status, aiVideoStatus)?.label }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column label="订单状态">
            <template #default="scope">
              <el-tag :type="handleTableFilterArr(scope.row.order_status, aiVideoStatus)?.tag" effect="dark">
                {{ handleTableFilterArr(scope.row.order_status, aiVideoStatus)?.label }}
              </el-tag>
            </template>
          </el-table-column> -->
          <el-table-column prop="create_time" label="生成开始时间/生成结束时间">
            <template #default="scope">
              <p>{{ format(scope.row.start_time) || '-' }}</p>
              <p>{{ format(scope.row.end_time) || '-' }}</p>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>

    <!-- 视频预览对话框 -->
    <el-dialog v-model="videoDialogVisible" title="视频预览" width="800px">
      <video v-if="currentVideoUrl" :src="currentVideoUrl" controls style="width: 100%; max-height: 500px"></video>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { usePagination, useSearchParams } from '@/hooks/elementPlus/usePagination';
import { getAiVideoRecordApi } from '@/api/member';
import { format } from '@/utils/dateUtil';
import { aiVideoStatus, handleTableFilterArr } from '@/enums';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';
import { useSearchBar } from './model/useSearchBar';
import { VIDEO_PREFIX } from './const';

const pageName = 'AiVideoRecord';
const { searchBarOptions } = useSearchBar(pageName, 'Site', 'Site');
const searchRef = ref();
const { query } = usePagination();
const state = reactive({
  row: {} as any,
  list: [] as any[],
  count: 0,
});

// 视频预览
const videoDialogVisible = ref(false);
const currentVideoUrl = ref('');

const handlePreview = (url: string) => {
  currentVideoUrl.value = url;
  videoDialogVisible.value = true;
};

const loadRecords = async () => {
  startLoading();
  const { Result, Count } = await getAiVideoRecordApi({
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
