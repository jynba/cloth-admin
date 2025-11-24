<template>
  <div class="table-box">
    <TablePro
      :query="query"
      :total="state.count"
      :title="titleVisible()"
      @page-next="onPagination"
      @refresh="fetchUsers"
    >
      <template #search>
        <GlobalSearch
          class="searchbar"
          :keep-alive="true"
          :options="searchBarOptions"
          @search="onSearch"
        ></GlobalSearch>
      </template>
      <template #table-top>
        <el-button v-auth="['admins:c']" class="btn" type="primary" @click="open">添加</el-button>
      </template>
      <template #table>
        <el-table stripe :data="state.users" height="100%" style="min-height: 400px">
          <el-table-column prop="username" label="管理员账号" />
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag :type="handleTableFilterArr(scope.row.status, managerStatus)?.tag">
                {{ handleTableFilterArr(scope.row.status, managerStatus)?.label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="node_name" label="所属组织-类型">
            <template #default="scope">
              {{ `${scope.row.node.name}-${handleTableFilterArr(scope.row.node.node_type, roleNodeType)?.label}` }}
            </template>
          </el-table-column>
          <el-table-column prop="roles.name" label="角色名称" width="180">
            <template #default="{ row }">
              <el-tooltip
                class="box-item"
                effect="light"
                :content="row.roles.map((item) => item.name).join(',')"
                popper-class="testtooltip"
                placement="top-start"
              >
                <div class="ellipsis-text">{{ row.roles.map((item) => item.name).join(',') }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间">
            <template #default="scope">
              {{ format(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" />
          <el-table-column label="操作" fixed="right" align="center">
            <template #default="scope">
              <el-button v-auth="['admins:u']" @click="editRow(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>
    <!-- 弹窗 -->
    <EditManage ref="dialogRef" :params="state.row" @fetch="fetchUsers" />
  </div>
</template>

<script lang="ts" setup>
import { getManagerApi } from '@/api/app';
import { handleTableFilterArr, managerStatus, roleNodeType } from '@/enums';
import { usePagination, useSearchParams } from '@/hooks/elementPlus/usePagination';
import type { FormType, userStateProps } from './types';
import { EditManage } from './components';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';
import { format } from '@/utils/dateUtil';
import { useSearchBar } from './components/model/useSearchBar';

const { searchBarOptions } = useSearchBar();
const state = reactive<userStateProps>({
  users: [],
  isVisible: false,
  row: {} as FormType,
  userId: '',
  count: 0,
});
const dialogRef = ref();
const { query } = usePagination();
// 获取平台管理员
const fetchUsers = async () => {
  startLoading();
  const params = {
    limit: query.limit,
    skip: query.skip,
    ...query.where,
  };
  const { Result, Count } = await getManagerApi(undefined, params).finally(() => endLoading());
  state.users = Result;
  state.count = Count;
};

onMounted(() => {
  fetchUsers();
});

const open = () => {
  dialogRef.value.visible = true;
  state.row = {};
};

// 显示文案
const titleVisible = () => {
  return '管理员管理';
};

const onPagination = () => {
  fetchUsers();
};

const onSearch = (form) => {
  query.where = useSearchParams(form);
  query.page = 1;
  query.skip = 0;
  fetchUsers();
};

const editRow = (row) => {
  state.row = row;
  dialogRef.value.visible = true;
};
</script>

<style lang="scss" scoped>
.ellipsis-text {
  width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
