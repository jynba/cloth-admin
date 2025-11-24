<template>
  <el-dialog
    v-model="isVisible"
    title="查看升级任务"
    width="1000px"
    destroy-on-close
    :close-on-click-modal="true"
    :before-close="close"
  >
    <div class="table-box">
      <TablePro :query="query" :total="state.count" style="box-shadow: none" @page-next="onPagination">
        <template #search>
          <GlobalSearch
            class="searchbar"
            page-name="Tasks"
            :keep-alive="true"
            :options="searchBarOptions"
            @search="search"
          ></GlobalSearch>
        </template>
        <template #table>
          <el-table ref="tableRef" stripe :data="state.list" tooltip-effect="dark">
            <el-table-column prop="device.client_id" label="设备mac地址"> </el-table-column>
            <el-table-column prop="node.name" label="所属网点"> </el-table-column>
            <el-table-column prop="status" label="任务状态">
              <template #default="{ row }">
                <el-tag :type="handleTableFilterArr(row.status, taskStatus)?.tag">
                  {{ handleTableFilterArr(row.status, taskStatus)?.label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="任务创建时间">
              <template #default="{ row }">
                {{ formatToDateTime(row.created_at) }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </TablePro>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getTaskApi } from '@/api/system';
import { usePagination, useSearchParams } from '@/hooks/elementPlus/usePagination';
import { useSearchBar } from './model/useSearchBar';
import { handleTableFilterArr, taskStatus } from '@/enums';
import { formatToDateTime } from '@/utils/dateUtil';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  params: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['fetch', 'update:visible']);
const { searchBarOptions } = useSearchBar();
const { query } = usePagination();
const tableRef = ref();
const isVisible = computed(() => props.visible);
const state = reactive({
  list: [],
  count: 0,
});

const close = () => {
  emit('update:visible', false);
};

const search = (form) => {
  query.where = useSearchParams(form);
  query.page = 1;
  query.skip = 0;
  fetchTasks();
};

const onPagination = () => {
  fetchTasks();
};

const fetchTasks = async () => {
  if (!props.params?.code) return;
  const { Result, Count } = await getTaskApi({
    limit: query.limit,
    skip: query.skip,
    version: props.params.code,
    ...query.where,
  });
  state.list = Result;
  state.count = Count;
};

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      fetchTasks();
    }
  },
);
</script>
