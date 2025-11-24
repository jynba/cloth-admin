<template>
  <div class="table-box">
    <TablePro :query="query" :total="state.count" title="角色管理" @page-next="onPagination" @refresh="load">
      <template #search>
        <SearchBar @search="onSearch" />
      </template>
      <template #table-top>
        <el-button type="primary" @click="open">添加</el-button>
      </template>
      <template #table>
        <el-table stripe height="650" :data="state.list">
          <el-table-column prop="name" label="角色名称" />
          <el-table-column prop="node_type" label="角色类型">
            <template #default="scope">
              {{ `${handleTableFilterArr(scope.row?.node_type, roleNodeType)?.label}` }}
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="备注" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-switch
                v-model="row.status"
                v-auth="['role:u']"
                :active-value="managerEnum.NORMAL"
                :inactive-value="managerEnum.DISABLE"
                @click="switchRole(row)"
              />
              <el-tag :type="handleTableFilterArr(row.status, managerStatus)?.tag">
                {{ handleTableFilterArr(row.status, managerStatus)?.label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间">
            <template #default="scope">
              {{ format(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center">
            <template #default="scope">
              <el-button v-auth="['role:r']" @click="open(scope.row, false)">查看 </el-button>
              <el-button v-auth="['role:u']" @click="open(scope.row, true)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>
    <!-- 弹窗 -->
    <RoleDialog ref="dialogRef" :params="state.row" @fetch="onPagination"></RoleDialog>
  </div>
</template>

<script lang="ts" setup>
import { getRoleApi, putRoleApi } from '@/api/system';
import { handleTableFilterArr, managerEnum, managerStatus, roleNodeType } from '@/enums';
import { format } from '@/utils/dateUtil';
import { onMounted, reactive } from 'vue';
import { usePagination, useSearchParams } from '@/hooks/elementPlus/usePagination';
import { RoleDialog, SearchBar } from './components';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';
import { confirm } from '@/hooks/elementPlus/useMessageBox';
import { error, success } from '@/hooks/elementPlus/useMessage';

defineOptions({
  name: 'Role',
});
const dialogRef = ref();
const state = reactive({
  list: [],
  isVisible: false,
  row: {} as any,
  count: 0,
  isEdit: false,
});
const { query } = usePagination();
// 获取平台管理员
const load = async () => {
  startLoading();
  const params = {
    limit: query.limit,
    skip: query.skip,
    ...query.where,
  };
  const { Result, Count } = await getRoleApi(params).finally(() => endLoading());
  state.list = Result;
  state.count = Count;
};

onMounted(() => {
  load();
});

const onPagination = () => {
  load();
};

// 打开弹窗
const open = (row = {}, isEdit = true) => {
  row = {
    ...row,
    isEdit,
  }; // 编辑/查看
  state.row = { ...row };
  dialogRef.value.visible = true;
};

const onSearch = (form) => {
  query.where = useSearchParams(form);
  query.skip = 0;
  query.page = 1;
  load();
};

// 切换状态
const switchLoading = ref(false);
const switchRole = (row: any) => {
  const statusMsgMap = {
    [managerEnum.NORMAL]: {
      msg: '确认启用改角色?',
    },
    [managerEnum.DISABLE]: {
      msg: h('div', null, [
        h('h2', { style: 'margin-bottom: 8px' }, '确认停用该角色?'),
        h('p', { style: 'color: #b3b3b3' }, '停用后关联账号将失去当前角色的操作权限,是否确认停用?'),
      ]),
    },
  };
  switchLoading.value = true;
  confirm(statusMsgMap[row.status].msg, '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const data = await putRoleApi(row.id, { status: row.status }).finally(() => (switchLoading.value = false));
      if (data?.Result?.id) {
        load();
        success('设置成功');
      }
    })
    .catch(() => {
      row.status = row.status === managerEnum.NORMAL ? managerEnum.DISABLE : managerEnum.NORMAL;
      error('取消操作');
    });
};
</script>

<style lang="scss" scoped></style>
