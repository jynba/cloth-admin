<template>
  <div class="table-box">
    <TablePro
      :query="query"
      :total="state.count"
      :title="titleVisible()"
      @page-next="onPagination"
      @refresh="fetchUsers"
    >
      <template #table-top>
        <el-button class="btn" type="primary" @click="open">添加</el-button>
      </template>
      <template #table>
        <el-table stripe :data="state.users" height="100%" style="min-height: 400px">
          <el-table-column prop="username" label="账号" />
          <el-table-column prop="real_name" label="姓名" />
          <el-table-column prop="phone" label="手机号" />
          <el-table-column prop="role" label="角色">
            <template #default="{ row }">
              {{ row.role === 1 ? '店长' : '师傅' }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag :type="handleTableFilterArr(row.status === 1 ? 1 : 2, managerStatus)?.tag">
                {{ handleTableFilterArr(row.status === 1 ? 1 : 2, managerStatus)?.label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间">
            <template #default="{ row }">
              {{ format(row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center">
            <template #default="scope">
              <el-button @click="editRow(scope.row)">编辑</el-button>
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
import { getUserList } from '@/api/app';
import { handleTableFilterArr, managerStatus } from '@/enums';
import { usePagination } from '@/hooks/elementPlus/usePagination';
import type { FormType, userStateProps } from './types';
import { EditManage } from './components';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';
import { format } from '@/utils/dateUtil';
const state = reactive<userStateProps>({
  users: [],
  isVisible: false,
  row: {} as FormType,
  userId: '',
  count: 0,
  list: [],
});
const dialogRef = ref();
const { query } = usePagination();
// 获取平台用户列表（按 User 返回结构展示）
const fetchUsers = async () => {
  startLoading();
  const params = {
    page: query.page,
    limit: query.limit,
    search: query.where?.username || undefined,
  } as any;
  try {
    const { data }: any = await getUserList(params);
    state.users = data?.users || [];
    state.count = data?.total || 0;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    state.users = [];
    state.count = 0;
  } finally {
    endLoading();
  }
};

onMounted(() => {
  fetchUsers();
});

const open = () => {
  dialogRef.value.visible = true;
};

// 显示文案
const titleVisible = () => {
  return '管理员管理';
};

const onPagination = () => {
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
