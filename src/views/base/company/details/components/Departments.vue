<template>
  <div class="departments-box">
    <div class="mb-3 flex justify-between items-center">
      <div class="text-base font-medium">部门列表</div>
      <el-button type="primary" @click="open()">新增部门</el-button>
    </div>
    <el-table :data="state.list" height="100%" style="min-height: 300px">
      <el-table-column prop="name" label="部门名称" min-width="160" />
      <el-table-column prop="parent_id" label="上级部门ID" width="140" />
      <el-table-column prop="created_at" label="创建时间" width="180">
        <template #default="scope">
          {{ format(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="160">
        <template #default="scope">
          <el-button size="small" @click="editRow(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <DepartmentEditDialog
      v-model:visible="state.isVisible"
      :params="state.row"
      :company-id="companyId"
      @fetch="fetchList"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, onMounted } from 'vue';
import { getDepartmentList } from '@/api/app';
import { format } from '@/utils/dateUtil';
import DepartmentEditDialog from './DepartmentEditDialog.vue';

const props = defineProps<{ companyId: number | string }>();

const state = reactive({
  isVisible: false,
  row: {} as any,
  list: [] as any[],
});

const fetchList = async () => {
  if (!props.companyId) return;
  const { Result = [] } = await getDepartmentList(undefined, {
    company_id: props.companyId,
    limit: 1000,
    skip: 0,
  });
  state.list = Result;
};

const open = () => {
  state.row = {};
  state.isVisible = true;
};

const editRow = async (row: any) => {
  const { Result } = await getDepartmentList(row?.id);
  state.row = Result;
  state.isVisible = true;
};

watch(
  () => props.companyId,
  () => fetchList(),
  { immediate: true },
);

onMounted(() => fetchList());
</script>

<style scoped>
.departments-box {
  padding: 8px 0;
}
</style>
