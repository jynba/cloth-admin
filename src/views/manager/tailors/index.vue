<template>
  <div class="table-box">
    <TablePro :query="query" :total="state.count" title="师傅管理" @page-next="onPagination" @refresh="load">
      <template #table-top>
        <el-button class="btn" type="primary" @click="open">新增师傅</el-button>
      </template>
      <template #table>
        <el-table stripe :data="state.list" height="100%" style="min-height: 400px">
          <el-table-column prop="real_name" label="姓名" />
          <el-table-column prop="phone" label="手机号" />
          <el-table-column prop="work_number" label="工号" />
          <el-table-column prop="level" label="等级" />
          <el-table-column prop="created_at" label="创建时间">
            <template #default="{ row }">{{ format(row.created_at) }}</template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="200">
            <template #default="{ row }">
              <el-button size="small" @click="editRow(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="onDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>

    <EditTailor ref="dialogRef" :params="state.row" @fetch="load" />
  </div>
</template>

<script lang="ts" setup>
import { getTailorList, deleteTailor } from '@/api/app';
import { usePagination } from '@/hooks/elementPlus/usePagination';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';
import { format } from '@/utils/dateUtil';
import { EditTailor } from './components';

const { query } = usePagination();

const state = reactive({
  all: [] as any[],
  list: [] as any[],
  count: 0,
  row: {} as any,
});

const dialogRef = ref();

const paginate = () => {
  const start = query.skip || 0;
  const end = (query.skip || 0) + (query.limit || 10);
  state.list = state.all.slice(start, end);
  state.count = state.all.length;
};

const load = async () => {
  startLoading();
  try {
    const res: any = await getTailorList();
    const items = res ?? [];
    state.all = Array.isArray(items) ? items : [];
    paginate();
  } finally {
    endLoading();
  }
};

onMounted(() => {
  load();
});

const onPagination = () => {
  paginate();
};

const open = () => {
  state.row = {};
  (dialogRef.value as any).visible = true;
};

const editRow = (row: any) => {
  state.row = { ...row };
  (dialogRef.value as any).visible = true;
};

const onDelete = async (row: any) => {
  await deleteTailor(row.id);
  load();
};
</script>

<style lang="scss" scoped></style>
