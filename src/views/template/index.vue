<template>
  <div class="table-box">
    <TablePro :query="query" :total="state.count" title="量体模板" @page-next="onPagination" @refresh="load">
      <template #table-top>
        <el-button class="btn" type="primary" @click="open">新增模板</el-button>
      </template>
      <template #table>
        <el-table stripe :data="state.list" height="100%" style="min-height: 400px">
          <el-table-column prop="name" label="模板名称" />
          <el-table-column prop="type" label="类型" width="120">
            <template #default="{ row }">{{ row.type === 2 ? '企业' : '个人' }}</template>
          </el-table-column>
          <el-table-column prop="category" label="分类">
            <template #default="{ row }">
              {{ categoryLabel(row.category) }}
            </template>
          </el-table-column>
          <el-table-column prop="default_data.style_config" label="款式配置">
            <template #default="{ row }">
              <el-tooltip
                effect="light"
                :content="formatStyleConfig(row.default_data?.style_config)"
                placement="top-start"
              >
                <div class="ellipsis-text">{{ formatStyleConfig(row.default_data?.style_config) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="default_data" label="默认数据">
            <template #default="{ row }">
              <el-tooltip effect="light" :content="formatDefaultData(row.default_data)" placement="top-start">
                <div class="ellipsis-text">{{ formatDefaultData(row.default_data) }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="180">
            <template #default="{ row }">{{ format(row.created_at) }}</template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="180">
            <template #default="{ row }">
              <el-button size="small" @click="editRow(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="onDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TablePro>

    <EditTemplate ref="dialogRef" :params="state.row" @fetch="load" />
  </div>
</template>

<script lang="ts" setup>
import { getTemplateList, deleteTemplate } from '@/api/app';
import { usePagination } from '@/hooks/elementPlus/usePagination';
import { endLoading, startLoading } from '@/hooks/elementPlus/useLoading';
import { format } from '@/utils/dateUtil';
import { EditTemplate } from './components';

const { query } = usePagination();

const state = reactive({
  all: [] as any[],
  list: [] as any[],
  count: 0,
  row: {} as any,
});

const dialogRef = ref();

const categoryLabel = (val: number) => {
  if (val === 1) return '上衣';
  if (val === 2) return '裤装';
  if (val === 3) return '裙装';
  return '-';
};

const formatStyleConfig = (sc: any) => {
  try {
    if (!sc) return '-';
    const json = typeof sc === 'string' ? JSON.parse(sc) : sc;
    const cat = json?.category || {};
    const checked = Object.keys(cat)
      .filter((k) => !!cat[k])
      .join('/');
    return checked || JSON.stringify(json);
  } catch {
    return typeof sc === 'string' ? sc : JSON.stringify(sc);
  }
};

const formatDefaultData = (data: any) => {
  try {
    if (!data) return '-';
    return JSON.stringify(data);
  } catch {
    return typeof data === 'string' ? data : JSON.stringify(data);
  }
};
const paginate = () => {
  const start = query.skip || 0;
  const end = (query.skip || 0) + (query.limit || 10);
  state.list = state.all.slice(start, end);
  state.count = state.all.length;
};

const load = async () => {
  startLoading();
  try {
    const res: any = await getTemplateList();
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
  await deleteTemplate(row.id);
  load();
};
</script>

<style lang="scss" scoped>
.ellipsis-text {
  width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
