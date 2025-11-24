<template>
  <div class="table-box">
    <TablePro :query="query" :total="state.count" title="版本升级" @page-next="onPagination">
      <template #search>
        <SearchBar @open="open" @search="onSearch"></SearchBar>
      </template>
      <template #table-top>
        <el-button v-auth="['version:c']" class="btn" type="primary" @click="open"> 添加版本 </el-button>
      </template>
      <template #table>
        <el-table height="645" :data="state.versions">
          <el-table-column prop="device_type" label="设备类型">
            <template #default="{ row }">
              {{ handleTableFilterArr(row.device_type, deviceType)?.label }}
            </template>
          </el-table-column>
          <el-table-column prop="code" label="版本号"> </el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag :type="handleTableFilterArr(scope.row.status, handleStatus)?.tag">
                {{ handleTableFilterArr(scope.row.status, handleStatus)?.label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="上传时间">
            <template #default="scope">
              {{ formatToDateTime(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column prop="description" label="更新内容"> </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="300">
            <template #default="scope">
              <el-button v-auth="['version:u']" type="primary" @click="open(scope.row)"> 编辑 </el-button>
              <el-button
                v-auth="['version:r']"
                type="primary"
                @click="
                  $router.push({
                    path: '/system/version-detail',
                    query: { id: scope.row.id },
                  })
                "
              >
                版本详情
              </el-button>
              <el-button v-auth="['version:d']" type="danger" @click="deleteVersion(scope.row)"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>
    <!-- 弹窗 -->
    <EditVersion v-model:visible="state.isVisible" :params="state.row" @fetch="onPagination"></EditVersion>
  </div>
</template>

<script lang="ts" setup>
import { EditVersion, SearchBar } from './components';
import { deleteVersionApi, getVersionsApi } from '@/api/system';
import { usePagination } from '@/hooks/elementPlus/usePagination';
import { deviceType, handleStatus, handleTableFilterArr } from '@/enums';
import { formatToDateTime } from '@/utils/dateUtil';
import { success } from '@/hooks/elementPlus/useMessage';
import { confirm } from '@/hooks/elementPlus/useMessageBox';

const { query } = usePagination();
const state = reactive({
  menus: [
    {
      name: '版本升级',
      path: '/system/version',
    },
  ],
  versions: [],
  isVisible: false,
  row: {},
  count: 0,
});

const fetchversions = async () => {
  const { Result, Count } = await getVersionsApi(undefined, {
    limit: query.limit,
    skip: query.skip,
    ...query.where,
  });
  state.versions = Result;
  state.count = Count;
};

onMounted(() => {
  fetchversions();
});

const onPagination = () => {
  fetchversions();
};

const onSearch = (form) => {
  query.where = form;
  query.page = 1;
  query.skip = 0;
  fetchversions();
};

const open = (row?: any) => {
  state.row = row ? { ...row } : {};
  state.isVisible = true;
};

const deleteVersion = async (row: any) => {
  try {
    await confirm(`此操作将删除机柜版本, 是否继续?`, '注意', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await deleteVersionApi(row.id);
    success('删除成功');
    fetchversions();
  } catch (err) {
    console.log(err);
  }
};
</script>

<style lang="scss" scoped>
.resource {
  .tb {
    padding: 0 20px;
    background: $bg-panel;

    .pagination {
      padding: 15px 20px 15px 0;
    }
  }
}
</style>
