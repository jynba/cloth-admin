<template>
  <div>
    <el-card class="mb-4 box-card" shadow="never">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span> 版本信息</span>
            <div class="ml-4">
              <el-button v-auth="['version:u']" type="primary" @click="open"> 编辑 </el-button>
            </div>
          </div>
          <div class="flex items-center">
            <el-button
              v-auth="['version:upgrade']"
              type="primary"
              :disabled="!(state.selectedRows?.length > 0)"
              @click="onUpdate"
            >
              升级
            </el-button>
            <el-button type="primary" @click="fetchCabinets"> 刷新状态 </el-button>
            <el-button v-auth="['version:task']" type="primary" @click="openTask"> 查看升级任务 </el-button>
          </div>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col class="mb-4" :xs="24" :sm="12" :md="12" :lg="12" :xl="12"> 版本号：{{ state.item.code }} </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          状态：
          <el-tag :type="handleTableFilterArr(state.item?.status, handleStatus)?.tag">
            {{ handleTableFilterArr(state.item?.status, handleStatus)?.label }}
          </el-tag>
        </el-col>
        <el-col class="mb-4" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          file_url：{{ state.item?.file_url }}
        </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          上传时间： {{ format(state.item?.created_at) }}
        </el-col>
        <el-col class="mb-4" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          更新内容：{{ state.item?.description || '-' }}
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card" shadow="never">
      <template #header>
        <span> 更新机柜列表</span>
      </template>
      <div class="table-box">
        <TablePro :query="query" :total="state.count" style="box-shadow: none" @page-next="onPagination">
          <template #search>
            <GlobalSearch
              class="searchbar"
              page-name="Version"
              :keep-alive="true"
              :options="handleSearcnOptions"
              @search="search"
            ></GlobalSearch>
          </template>
          <template #table>
            <el-table
              ref="tableRef"
              stripe
              row-key="id"
              :data="state.list"
              tooltip-effect="dark"
              @selection-change="onSelection"
            >
              <el-table-column type="selection" width="55" :selectable="selectable" :reserve-selection="true" />
              <el-table-column prop="client_id" label="设备mac地址"> </el-table-column>
              <el-table-column prop="node.name" label="所属网点"> </el-table-column>
              <el-table-column label="在线情况">
                <template #default="{ row }">
                  <el-tag :type="row.online ? 'success' : 'danger'">
                    {{ row.online ? '在线' : '离线' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="version" label="版本号"> </el-table-column>
              <el-table-column label="更新状态">
                <template #default="{ row }">
                  <el-tag :type="row.version === state.item?.code ? 'success' : 'danger'">
                    <span> {{ row.version === state.item?.code ? '更新成功' : '待更新' }}</span>
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="更新时间">
                <template #default="{ row }">
                  {{ format(row.updated_at) }}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </TablePro>
      </div>
    </el-card>
    <!-- 弹窗 -->
    <EditVersion v-model:visible="state.isVisible" :params="state.item" @fetch="onPagination"></EditVersion>
    <TaskList v-model:visible="state.taskVisible" :params="state.item" @fetch="onPagination"></TaskList>
  </div>
</template>

<script lang="ts" setup>
import { getDevicesApi } from '@/api/cabinet';
import { getVersionsApi, sendVersionApi } from '@/api/system';
import { format } from '@/utils/dateUtil';
import { confirm } from '@/hooks/elementPlus/useMessageBox';
import { success } from '@/hooks/elementPlus/useMessage';
import { EditVersion } from '@/views/system/version/components';
import { handleStatus, handleTableFilterArr } from '@/enums';
import { usePagination, useSearchParams } from '@/hooks/elementPlus/usePagination';
import { useSearchBar } from '@/views/cabinet/lockers/model/useSearchBar';
import { TaskList } from './components';

const { searchBarOptions } = useSearchBar('Version');
const serachKeys = ['client_id_contains', 'parent_id'];
const handleSearcnOptions = searchBarOptions.value.filter((item) => item.field && serachKeys.includes(item.field));

const tableRef = ref();
const route = useRoute();
const state = reactive({
  list: [] as any[],
  item: {} as any,
  selectedRows: [],
  isVisible: false,
  taskVisible: false,
  count: 0,
});
const objectId = computed(() => route.query.id as string);
const { query } = usePagination();
const fetchVersion = async () => {
  const { Result } = await getVersionsApi(objectId.value);
  state.item = Result;
  fetchCabinets();
};
const fetchCabinets = async () => {
  const { Result, Count } = await getDevicesApi(undefined, {
    limit: query.limit,
    skip: query.skip,
    type: state.item.device_type,
    ...query.where,
  });
  state.list = Result;
  state.count = Count;
};

onMounted(() => {
  fetchVersion();
});

// 多选
const onSelection = (rows) => {
  state.selectedRows = rows;
};

// 禁止选中
const selectable = (row) => {
  // 不在线或更新过的不允许选中
  if (!row.online || row.version == state.item.code) {
    return false;
  }
  return true;
};

const onUpdate = async () => {
  await confirm(`此操作将更新机柜版本, 是否继续?`, '注意', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
  const ids = state.selectedRows.map((item: { id: string }) => item.id);
  const params = {
    file_url: state.item.file_url,
    version: state.item.code,
    ids,
  };
  // 更新接口
  await sendVersionApi(params);
  fetchCabinets();
  success('更新成功');
};

const open = () => {
  state.isVisible = true;
};

const openTask = () => {
  state.taskVisible = true;
};

const onPagination = () => {
  fetchVersion();
};

// 机柜搜索事件
const search = (form) => {
  query.where = useSearchParams(form);
  query.page = 1;
  query.skip = 0;
  fetchCabinets();
};
</script>

<style lang="scss" scoped>
.box-card {
  :deep {
    .el-card__header {
      padding: 15px;
      background: $bg-primary;
    }

    .version {
      .searchbar {
        padding: 0;
      }
    }
  }
}
</style>
